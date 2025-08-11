// aiJunshi.ts
import imgBase64 from './base64' // 你的 base64 图片字符串

const OPENAI_API_KEY = 'bb29d250-85f4-4000-b027-b2521996a756'
const DEEPSEEK_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
const MODEL = 'doubao-1.5-ui-tars'

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

// 解析 SSE 数据块
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
      // 解析失败忽略
    }
  }

  return texts
}

// 一次性请求函数，返回 Promise
export async function aiJunshiOnce(text: string, base64Image?: string): Promise<any> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: [{ type: 'text', text: '你是一个恋爱聊天军师，帮用户回复女生的信息，展现男人的自信、幽默和魅力。' }],
    },
    {
      role: 'user',
      content: [
        { type: 'text', text },
        ...(base64Image ? [{ type: 'image_url' as const, image_url: { url: base64Image } }] : []),
      ],
    },
  ]

  const res = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      // thinking: 'disabled',
      // thinking: {
      //   type: 'disabled',
      // },
      // max_tokens: 20,
      // streaSm: false,
    }),
  })

  return res.json()
}

// 流式请求函数，返回 AsyncGenerator
export async function* aiJunshiStream(text: string, base64Image?: string): AsyncGenerator<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: [{ type: 'text', text: '你是一个恋爱聊天军师，帮用户回复女生的信息，展现男人的自信、幽默和魅力。' }],
    },
    {
      role: 'user',
      content: [
        { type: 'text', text },
        ...(base64Image ? [{ type: 'image_url' as const, image_url: { url: base64Image } }] : []),
      ],
    },
  ]

  const res = await fetch(DEEPSEEK_API_URL, {
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

  if (!res.body) throw new Error('Stream not supported')

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    for (const text of parseSSEChunk(chunk)) {
      yield text
    }
  }
}

// ===== 示例调用 =====

// 1. 一次性调用
aiJunshiOnce('她说她今天很累').then((res) => {
  console.log('一次性结果:', res.choices[0].message.content)
})

// 2. 流式调用
// ;(async () => {
//   const stream = aiJunshiStream("帮我幽默地回复：'你吃饭了吗？'", imgBase64)
//   for await (const chunk of stream) {
//     console.log('流式增量：', chunk)
//   }
// })()
