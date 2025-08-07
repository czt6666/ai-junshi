<template>
  <div class="img-upload">
    <ImageUploader
      name="chat-image"
      label="点击上传截图 或 拖入聊天记录 📤"
      maxFileSize="5MB"
      stylePanelAspectRatio="9:16"
      @upload="handleUploadedFile"
    />
  </div>
  <div class="confirm-button">
    <button @click="router.push({ name: 'HomePage' })">返回</button>
    <button @click="confirmImage">确认</button>
  </div>
</template>
<script lang="ts" setup name="Result">
import { ref, reactive } from 'vue'
import ImageUploader from '@/components/ImageUploader.vue'
import { useUserDataStore } from '@/stores/userData'
import { useRouter } from 'vue-router'

const router = useRouter()
const userDataStore = useUserDataStore()

const handleUploadedFile = (file: File) => {
  console.log('收到上传的文件:', file)
  userDataStore.setData('image', file)
}

const confirmImage = () => {
  router.push({ name: 'Confirm' })
}
</script>
<style lang="scss" scoped>
.img-upload {
  overflow: hidden;
  padding: 0 25%;
  width: 100%;
  height: 70vh;

  v-deep .filepond--root .filepond--drop-label {
    height: 100%;
  }
}

.confirm-button {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 16px;

  button {
    width: 160px;
    background-color: #4caf50;
    color: white;
    border: none;
  }
}
</style>
