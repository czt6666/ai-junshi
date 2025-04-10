<template>
  <!-- 标题 -->
  <h1 class="text-3xl font-bold text-center">AI军师</h1>

  <!-- 上传区域 -->
  <div class="a">
    <ImageUploader
      name="chat-image"
      :acceptedFileTypes="['image/png', 'image/jpeg']"
      label="拖拽或点击上传聊天截图"
      maxFileSize="5MB"
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
import AutoTextarea from '@/components/AutoTextarea.vue'
import { ref } from 'vue'

const message = ref('')
const handleUploadedFile = (file: File) => {
  console.log('收到上传的文件:', file)
  // 后续处理，如 OCR、上传至服务器等
}
</script>

<style lang="scss" scoped>
.b {
  width: 100%;
  background-color: pink;
}
</style>
