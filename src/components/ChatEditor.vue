<template>
  <div class="editor-container">
    <div v-for="(item, index) in messages" :key="item.id">
      <!-- Render different components based on message type -->
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

    <div class="button-row">
      <button @click="addMessage('ta')">➕ 添加 ta 的聊天</button>
      <button @click="addMessage('me')">➕ 添加 me 的回复</button>
      <!-- <button @click="addMessage('system')">➕ 添加 system 的消息</button>
      <button @click="addMessage('time')">➕ 添加 time 的消息</button> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ChatBubble from './ChatBubble.vue'
import TimeMessage from './TimeMessage.vue'
import SystemMessage from './SystemMessage.vue'

type Message = {
  id: number
  from: 'me' | 'ta' | 'system' | 'time'
  text: string | object // Use string for regular messages, object for complex data like system or time
}

const messages = ref<Message[]>([{ id: Date.now(), from: 'ta', text: '' }])

const addMessage = (from: 'me' | 'ta' | 'system' | 'time') => {
  let text: string | object = ''
  if (from === 'system') {
    text = { type: 'info', content: 'This is a system message' } // Example system message object
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
</script>

<style scoped>
.editor-container {
  background: #fefae0;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.button-row {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

button {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #fff;
  cursor: pointer;
}
</style>
