<template>
  <div class="home-container">
    <h2 class="title">请选择操作方式</h2>
    <p class="desc">您希望通过哪种方式进行？</p>
    <div class="btn-group">
      <button class="select-btn" @click="goTo('UploadImg')">分析聊天截图</button>
      <button class="select-btn" @click="goTo('InputTxt')">输入聊天记录</button>
      <button class="select-btn" @click="goTo('Confirm')">直接提问AI</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goTo(name: string) {
  router.push({ name })
}
</script>

<style lang="scss" scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #22223b;
}

.desc {
  font-size: 1.1rem;
  color: #4a4e69;
  margin-bottom: 32px;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.select-btn {
  padding: 12px 32px;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #5f6dff 0%, #7c83fd 100%);
  color: #fff;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(95, 109, 255, 0.08);

  &:hover {
    background: linear-gradient(90deg, #7c83fd 0%, #5f6dff 100%);
    transform: translateY(-2px) scale(1.04);
  }
}
</style>
