<template>
  <div class="editor-container">
    <div class="message-container">
      <div v-for="(item, index) in messages" :key="item.id">
        <ChatBubble
          v-if="item.from === 'me' || item.from === 'ta'"
          :text="item.text"
          :from="item.from"
          :canDelete="messages.length > 1"
          @update="(val) => updateMessage(index, val)"
          @delete="removeMessage(index)"
        />
        <TimeMessage v-if="item.from === 'time'" :time="item.text" />
        <SystemMessage v-if="item.from === 'system'" :message="item.text" />
      </div>
    </div>

    <div class="button-row">
      <button @click="addMessage('ta')">➕ 添加 ta 的聊天</button>
      <button @click="addMessage('me')">➕ 添加 me 的回复</button>
    </div>
    <!-- 确认按钮，emit -->
    <div class="confirm-button">
      <button @click="router.push({ name: 'HomePage' })">返回</button>
      <button @click="confirmMessages">确认</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue'
import ChatBubble from './ChatBubble.vue'
import TimeMessage from './TimeMessage.vue'
import SystemMessage from './SystemMessage.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
type Message = {
  id: number
  from: 'me' | 'ta' | 'system' | 'time'
  text: string
}

const emit = defineEmits(['confirm'])

const messages = ref<Message[]>([
  { id: Date.now(), from: 'ta', text: '' },
  { id: Date.now(), from: 'me', text: '' },
  { id: Date.now(), from: 'ta', text: '' },
])

const addMessage = (from: 'me' | 'ta' | 'system' | 'time') => {
  let text: string | object = ''
  if (from === 'system') {
    text = 'This is a system message'
  } else if (from === 'time') {
    text = new Date().toLocaleTimeString() // Current time as a string
  }

  messages.value.push({
    id: Date.now() + Math.random(),
    from,
    text,
  })
}

const removeMessage = (index: number) => {
  if (messages.value.length > 1) {
    messages.value.splice(index, 1)
  }
}

const updateMessage = (index: number, newText: string) => {
  messages.value[index].text = newText
}

const confirmMessages = () => {
  const textContent = getTextContent(messages.value)
  emit('confirm', textContent)
}

function getTextContent(messages: Message[]): string {
  console.log('messages', messages)

  return messages
    .filter((item) => item.text && item.text.trim() !== '')
    .map((item) => {
      if (item.from === 'ta') {
        return `她说：${item.text}`
      } else if (item.from === 'me') {
        return `我说：${item.text}`
      }
      return ''
    })
    .filter(Boolean)
    .join('\n')
}
</script>

<style lang="scss" scoped>
.editor-container {
  /* background: #fefae0; */
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 60vh;
  overflow-y: auto;
  padding-right: 8px;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  align-items: center;
  justify-content: center;
}

.confirm-button {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 16px;

  button {
    width: 100px;
    background-color: #4caf50;
    color: white;
    border: none;
  }
}
</style>
