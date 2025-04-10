<template>
  <div
    :class="['chat-bubble', from === 'me' ? 'from-me' : 'from-ta', isSolid ? 'solid' : 'dashed']"
  >
    <AutoTextarea
      v-model="localText"
      class="chat-textarea"
      :placeholder="from === 'me' ? '我说点什么...' : 'ta说了点什么...'"
      :rows="2"
      :max-scroll-height="999"
      @input="handleInput"
    />
    <button v-if="canDelete" class="delete-button" @click="$emit('delete')">✕</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import AutoTextarea from './AutoTextarea.vue' // 👈 根据实际路径调整

const props = defineProps<{
  text: string
  from: 'me' | 'ta'
  canDelete: boolean
}>()

const emit = defineEmits<{
  (e: 'update', newText: string): void
  (e: 'delete'): void
}>()

const localText = ref(props.text)

watch(
  () => props.text,
  (val) => {
    localText.value = val
  },
)

const isSolid = computed(() => localText.value.trim() !== '')

const handleInput = () => {
  emit('update', localText.value)
}
</script>

<style scoped>
.chat-bubble {
  display: flex;
  align-items: start;
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  word-break: break-word;
  position: relative;
}

.chat-textarea {
  flex: 1;
  width: 100%;
  font-size: 16px;
  background-color: transparent;
}

.from-ta {
  align-self: flex-start;
  background-color: #ffffff;
  color: #000;
}

.from-me {
  align-self: flex-end;
  background-color: #95ec69;
  color: #000;
  margin-left: auto;
  flex-direction: row-reverse;
}

.solid {
  padding: 9px 13px;
  border: 1px solid #888;
}

.dashed {
  border: 2px dashed #bbb;
}

.delete-button {
  background: none;
  border: none;
  color: #888;
  font-size: 16px;
  margin: 0 8px;
  cursor: pointer;
}
</style>
