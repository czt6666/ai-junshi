<template>
  <div class="result-container">
    <div class="img-cfm" v-if="type === 'image' && isFile(content)">
      <img :src="fileUrl" alt="用户上传的图片" class="result-img" />
      <div class="btns">
        <button @click="router.push({ name: 'UploadImg' })">重选图片</button>
        <button @click="router.push({ name: 'Result' })">确认图片</button>
      </div>
    </div>
    <div class="txt-cfm" v-else-if="type === 'text'">
      <pre class="result-text">{{ content }}</pre>
      <div class="btns">
        <button @click="router.push({ name: 'InputTxt' })">重选文本</button>
        <button @click="router.push({ name: 'Result' })">确认文本</button>
      </div>
    </div>
    <p v-else>暂无数据</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onUnmounted } from 'vue'
import { useUserDataStore } from '@/stores/userData'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter()
const userDataStore = useUserDataStore()
const { type, content } = storeToRefs(userDataStore)
console.log('当前类型:', type.value, '内容:', content.value)

// 判断是否为 File 类型
function isFile(obj: unknown): obj is File {
  return obj instanceof File
}

// 生成图片的 URL
const fileUrl = computed(() => {
  if (type.value === 'image' && isFile(content.value)) {
    return URL.createObjectURL(content.value)
  }
  return ''
})

// 页面卸载时释放 URL
onUnmounted(() => {
  if (fileUrl.value) {
    URL.revokeObjectURL(fileUrl.value)
  }
})
</script>

<style lang="scss" scoped>
.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
}
.result-img {
  max-width: 320px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.result-text {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  font-size: 1.1rem;
  color: #22223b;
  white-space: pre-wrap;
  max-width: 600px;
}
.btns {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  justify-content: center;
}
</style>
