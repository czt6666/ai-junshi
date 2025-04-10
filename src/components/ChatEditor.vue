<template>
  <div class="editor-container">
    {{ messages }}
    <div v-for="(item, index) in messages" :key="item.id" class="messages-container">
      <ChatBubble
        :text="item.text"
        :from="item.from"
        :canDelete="messages.length > 1"
        @update="(val) => updateMessage(index, val)"
        @delete="removeMessage(index)"
      />
    </div>

    <div class="button-row">
      <button @click="addMessage('ta')">➕ 添加 ta 的聊天</button>
      <button @click="addMessage('me')">➕ 添加 me 的回复</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ChatBubble from './ChatBubble.vue'

type Message = {
  id: number
  from: 'me' | 'ta'
  text: string
}

const messages = ref<Message[]>([{ id: Date.now(), from: 'ta', text: '' }])

const addMessage = (from: 'me' | 'ta') => {
  messages.value.push({
    id: Date.now() + Math.random(),
    from,
    text: '',
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
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.messages-container {
  display: flex;
  gap: 16px;
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
