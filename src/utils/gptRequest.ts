// aiJunshi.ts
import imgBase64 from './base64'
const OPENAI_API_KEY =
  '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'
const BASE_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

type TextContent = { type: 'text'; text: string }
type ImageContent = { type: 'image_url'; image_url: { url: string } }

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: (TextContent | ImageContent)[]
}

interface ChatOptions {
  messages: ChatMessage[]
  stream?: boolean
}

/**
 * 解析 OpenAI Chat 流式输出
 */
function parseSSEChunk(chunk: string): string[] {
  const lines = chunk.split('\n').filter((line) => line.trim().startsWith('data:'))
  const texts: string[] = []

  for (const line of lines) {
    const jsonStr = line.replace(/^data:\s*/, '')
    if (jsonStr === '[DONE]') continue
    try {
      const json = JSON.parse(jsonStr)
      const delta = json.choices?.[0]?.delta?.content
      if (delta) texts.push(delta)
    } catch {
      // 跳过无法解析的行
    }
  }

  return texts
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
 * 底层封装 - 流式请求（使用 generator）
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
    for (const text of parseSSEChunk(chunk)) {
      yield text
    }
  }
}

/**
 * 上层封装 - AI 军师
 * @param text 用户输入文字
 * @param base64Image 可选的 base64 图片（带 data:image/png;base64,... 前缀）
 * @param stream 是否流式
 */
async function aiJunshi(text: string, base64Image?: string, stream = false): Promise<any> | AsyncGenerator<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: [
        {
          type: 'text',
          text: '你是一个恋爱聊天军师，帮用户回复女生的信息，展现男人的自信、幽默和魅力。',
        },
      ],
    },
    {
      role: 'user',
      content: [
        { type: 'text', text },
        ...(base64Image ? ([{ type: 'image_url', image_url: { url: base64Image } }] as ImageContent[]) : []),
      ],
    },
  ]

  if (stream) {
    return requestChatStream({ messages, stream: true })
  } else {
    return requestChatOnce({ messages, stream: false })
  }
}

// ======== 示例调用 ========

// 一次性请求
aiJunshi(
  '她说她今天很累',
  'https://czt666.cn/junshi/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_2025-08-10_205353_572.jpg',
  false,
).then((res: any) => {
  console.log('一次性结果：', res.choices[0].message.content)
})

// // 流式请求
// ;(async () => {
//   const stream = (await aiJunshi("帮我幽默地回复：'你吃饭了吗？'", undefined, true)) as AsyncGenerator<string>
//   for await (const chunk of stream) {
//     // 每次增量输出
//     console.log('流式增量：', chunk)
//   }
// })()
