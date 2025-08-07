<template>
  <div class="result-container">
    <h2>恋爱大师回复助手 ❤️</h2>
    <div class="output" ref="outputRef">正在生成回复...</div>
    <div class="btns">
      <button @click="router.push({ name: 'UploadImg' })">重新上传图片</button>
      <button @click="router.push({ name: 'InputTxt' })">重新输入文本</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useUserDataStore } from '@/stores/userData'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()
const userDataStore = useUserDataStore()
const { type, content } = storeToRefs(userDataStore)

// prompt 提示词
const prompt = '我怎么回复她的消息'

// 判断输入类型
const image = type.value === 'image' && content.value instanceof File ? content.value : null
const text = type.value === 'text' && Array.isArray(content.value) ? content.value : null

const outputRef = ref<HTMLElement | null>(null)
const apiKey =
  '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'

const callOpenAI = async () => {
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }

    const body: any = {
      model: image ? 'gpt-4-vision-preview' : 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '假如你是一个恋爱经历丰富的情感大师，你现在要帮助我回复女朋友的消息。',
        },
        {
          role: 'user',
          content: image
            ? [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: await fileToBase64URL(image),
                  },
                },
              ]
            : `${prompt}\n${text?.join('\n')}`,
        },
      ],
      max_tokens: 1000,
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const json = await res.json()

    if (json.choices?.[0]?.message?.content) {
      outputRef.value!.innerText = json.choices[0].message.content
    } else {
      outputRef.value!.innerText = '⚠️ 无有效回复，可能是输入有误或接口限制。'
    }
  } catch (err) {
    outputRef.value!.innerText = '❌ 请求出错，请检查网络或 API Key。'
    console.error('OpenAI 调用失败:', err)
  }
}

const fileToBase64URL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 页面挂载时调用
onMounted(() => {
  callOpenAI()
})
</script>

<style lang="scss" scoped>
.result-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #fffbe6;
  font-family: 'Helvetica Neue', sans-serif;

  h2 {
    text-align: center;
    color: #d6336c;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .output {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    min-height: 120px;
    white-space: pre-wrap;
    font-size: 16px;
    color: #333;
    border: 1px solid #ffccd5;
    line-height: 1.6;
  }
}

.btns {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  justify-content: center;
}
</style>
