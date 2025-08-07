<template>
  <div class="chat-area">
    <ChatEditor @confirm="handleConfirm" />
  </div>
</template>

<script lang="ts" setup name="Result">
import { ref, reactive } from 'vue'
import ChatEditor from '@/components/ChatEditor.vue'
import { useRouter } from 'vue-router'
import { useUserDataStore } from '@/stores/userData'

const router = useRouter()
const userDataStore = useUserDataStore()

const handleConfirm = (messages: any) => {
  console.log('Confirmed messages:', messages)
  userDataStore.setData('text', messages)
  router.push({ name: 'Confirm' })
}
</script>

<style lang="scss" scoped>
.chat-area {
  width: 100%;
  padding: 0 24px;
}
</style>
