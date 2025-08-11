<template>
  <div class="result-container">
    <!-- <h2>恋爱大师回复助手 ❤️</h2> -->
    <div class="output" ref="outputRef">{{ outputText }}</div>
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
import { aiJunshiOnce, aiJunshiStream } from '@/utils/gptRequest'

const router = useRouter()
const userDataStore = useUserDataStore()
const { type, content } = storeToRefs(userDataStore)

// 判断输入类型
const image = type.value === 'image' && content.value instanceof File ? content.value : null
const text = type.value === 'text' ? (content.value as string) : null
const outputText = ref<string>('正在生成回复...')

const getJunshiResponse = async () => {
  let firstTrunk = true
  try {
    const stream = aiJunshiStream(text ? text : '我该怎么回复她', image ? await fileToBase64URL(image) : undefined)
    for await (const text of stream) {
      if (firstTrunk) {
        outputText.value = ''
        firstTrunk = false
      }
      outputText.value += text
    }
  } catch (error) {
    console.error('获取军师回复失败:', error)
    outputText.value = '获取回复失败，请稍后再试。'
    return
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
  getJunshiResponse()
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
