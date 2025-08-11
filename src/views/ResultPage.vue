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
import { getFile } from '@/utils/indexedDb'
import { useRouter } from 'vue-router'
import { aiJunshiOnce } from '@/utils/gptRequest'

const router = useRouter()
const userDataStore = useUserDataStore()
const { userPrompt, chatHistoryText, chatScreenshotList } = storeToRefs(userDataStore)

const outputText = ref<string>('正在生成回复...')

const getJunshiResponse = async () => {
  let imageBase64: string | undefined
  if (chatScreenshotList.value.length > 0) {
    const fileBlob = await getFile(chatScreenshotList.value[0])
    if (fileBlob) {
      imageBase64 = await fileToBase64URL(fileBlob)
    }
  }

  const prompt = userPrompt.value ? `${userPrompt.value} \n\n` : ''
  const chatText = chatHistoryText.value ? `下面是我的聊天记录：\n ${chatHistoryText.value}` : ''
  const text = prompt + chatText
  const res = await aiJunshiOnce(text || '', imageBase64 ? imageBase64 : undefined)
  outputText.value = res
}

// utils/fileToBase64.ts
async function fileToBase64URL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
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
