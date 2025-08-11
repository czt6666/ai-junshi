<template>
  <div class="result-container">
    <h4 class="title">将要把以下内容发送给大模型，请确认:</h4>
    <div class="images" v-if="fileUrls?.length">
      <div v-for="(urlRef, index) in fileUrls" :key="index">
        <img :src="urlRef" style="max-width: 200px" />
      </div>
    </div>
    <pre class="chat-text" v-if="chatHistoryText">{{ chatHistoryText }}</pre>
    <div class="prompt">
      <span>自定义提示消息：</span>
      <input type="text" :value="userPrompt" @input="handleInput" />
    </div>
    <div class="btns">
      <button @click="router.push({ name: 'UploadImg' })">重选图片</button>
      <button @click="router.push({ name: 'InputTxt' })">重选文本</button>
      <button @click="router.push({ name: 'Result' })">提问ai军师</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onUnmounted } from 'vue'
import { useUserDataStore } from '@/stores/userData'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { getFile } from '@/utils/indexedDb'

const router = useRouter()
const userDataStore = useUserDataStore()
const { userPrompt, chatHistoryText, chatScreenshotList } = storeToRefs(userDataStore)

const fileUrls = computed(() => {
  return chatScreenshotList.value.map((id) => useFileUrl(id))
})

const handleInput = (e) => {
  console.log(e.target.value)

  userDataStore.setUserPrompt(e.target.value)
}

function useFileUrl(fileId: string) {
  const url = ref('')

  async function load() {
    const blob = await getFile(fileId)
    if (blob) {
      url.value = URL.createObjectURL(blob)
    }
  }

  onUnmounted(() => {
    if (url.value) {
      URL.revokeObjectURL(url.value)
    }
  })

  load()
  return computed(() => url.value)
}
</script>

<style lang="scss" scoped>
.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}
.title {
  margin-bottom: 12px;
}
.images {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: 320px;
  background-color: lightblue;

  img {
    max-height: 320px;
  }
}
.chat-text {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  font-size: 1.1rem;
  color: #22223b;
  white-space: pre-wrap;
  max-width: 600px;
}
.prompt {
  overflow: hidden;
  width: 100%;
  border-radius: 8px;
  background-color: lightblue;

  input {
    width: 100%;
    border: none;
    outline: none;
    padding: 12px;
  }
}
.btns {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  justify-content: center;
}
</style>
