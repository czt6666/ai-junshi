<template>
  <div class="img-upload">
    <ImageUploader
      name="chat-image"
      label="点击上传截图 或 拖入聊天记录 📤"
      maxFileSize="5MB"
      allowMultiple="true"
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
import { v4 as uuidv4 } from 'uuid'
import { saveFile } from '@/utils/indexedDb'
import ImageUploader from '@/components/ImageUploader.vue'
import { useUserDataStore } from '@/stores/userData'
import { useRouter } from 'vue-router'

const router = useRouter()
const userDataStore = useUserDataStore()

const handleUploadedFile = async (file: File) => {
  console.log('收到上传的文件:', file)

  const id = uuidv4()
  await saveFile(id, file)
  userDataStore.setUserPrompt(id)
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
  max-height: 60vh;

  :deep(.filepond--wrapper) {
    .filepond--drop-label {
      height: 100%;
    }
    .filepond--credits {
      display: none;
    }
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
