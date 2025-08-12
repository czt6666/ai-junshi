// aiJunshi.ts
import imgBase64 from './base64'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY_01
const BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL
// const OPENAI_API_KEY = import.meta.env.VITE_TRANS_API_KEY_01
// const BASE_URL = import.meta.env.VITE_TRANS_BASE_URL
const MODEL = 'gpt-4o'

type TextContent = { type: 'text'; text: string }
type ImageContent = { type: 'image_url'; image_url: { url: string } }

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: (TextContent | ImageContent)[] | string
}

interface ChatOptions {
  messages: ChatMessage[]
  stream?: boolean
}

/**
 * 解析 OpenAI Chat 流式输出
 */
function parseSSEChunk(chunk: string): string[] {
  const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))
  const texts: string[] = []

  for (const line of lines) {
    const dataStr = line.slice(6).trim()
    if (!dataStr || dataStr === '[DONE]') continue

    try {
      const obj = JSON.parse(dataStr)
      const text =
        obj?.delta?.text ||
        obj?.delta?.content ||
        obj?.delta?.content_block_delta?.delta?.text ||
        obj.choices?.[0]?.delta?.content
      if (typeof text === 'string' && text) {
        texts.push(text)
      }
    } catch {
      // 忽略无法解析的行
    }
  }
  return texts
}

function buildMessages(text?: string, base64Image?: string): ChatMessage[] {
  if (!text && !base64Image) {
    throw new Error('至少需要提供文本或图片内容')
  }

  return [
    {
      role: 'system',
      content:
        '假如你是一个恋爱经历丰富的情感大师，你现在要帮助我回复女生朋友的消息。要调动聊天兴趣，同时保持神秘不可预测的聊天风格',
    },
    {
      role: 'user',
      content: [
        ...(text ? [{ type: 'text' as const, text }] : []),
        ...(base64Image ? [{ type: 'image_url' as const, image_url: { url: base64Image } }] : []),
      ],
    },
  ]
}

/**
 * 底层封装 - 一次性请求
 */
async function requestChatOnce(options: ChatOptions) {
  const { messages } = options
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: false,
    }),
  })

  return res.json()
}

/**
 * 底层封装 - 流式请求
 */
async function* requestChatStream(options: ChatOptions) {
  const { messages } = options
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
    }),
  })

  const reader = res.body?.getReader()
  if (!reader) throw new Error('浏览器不支持流式读取')

  const decoder = new TextDecoder('utf-8')

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    console.log('[流式数据start]', chunk, '[流式数据end]')

    for (const text of parseSSEChunk(chunk)) {
      yield text
    }
  }
}

export async function aiJunshiOnce(text?: string, base64Image?: string) {
  const messages = buildMessages(text, base64Image)
  const res = await requestChatOnce({ messages, stream: false })
  return res.content[0].text
}

export async function* aiJunshiStream(text?: string, base64Image?: string) {
  const messages = buildMessages(text, base64Image)
  yield* requestChatStream({ messages, stream: true })
}

// ======== 示例调用 ========
async function main() {
  // const stream = aiJunshiStream('帮我幽默地回复：你吃饭了吗？')
  // for await (const chunk of stream) {
  //   console.log('流式增量：', chunk)
  // }

  const response = await aiJunshiOnce('图片说了什么', imgBase64)
  console.log('一次性结果：', response)
}

// main()
