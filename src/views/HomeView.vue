<template>
  <!-- 标题 -->
  <h1 class="text-3xl font-bold text-center">AI军师</h1>

  <!-- 上传区域 -->
  <div class="a">
    <ImageUploader
      name="chat-image"
      :acceptedFileTypes="['image/png', 'image/jpeg']"
      label="点击上传截图 或 拖入聊天记录 📤"
      maxFileSize="5MB"
      stylePanelAspectRatio="9:16"
      @upload="handleUploadedFile"
    />
  </div>

  <div class="b">
    <ChatEditor />
  </div>
</template>

<script lang="ts" setup>
import ImageUploader from '@/components/ImageUploader.vue'
import ChatEditor from '@/components/ChatEditor.vue'
import { ref } from 'vue'
import { useDeviceStore } from '@/stores/device'
// import '@/utils/doubBaoRequest'
import '@/utils/gptRequest'
const store = useDeviceStore()

const handleUploadedFile = (file: File) => {
  console.log('收到上传的文件:', file)
  // 后续处理，如 OCR、上传至服务器等
}

// console.log(store.getters.deviceType)
</script>

<style lang="scss" scoped>
.a {
  overflow: hidden;
  padding: 0 25%;
  width: 100%;
  height: 300px;

  v-deep .filepond--root .filepond--drop-label {
    height: 100%;
  }
}
.b {
  width: 100%;
  background-color: pink;
}
</style>
