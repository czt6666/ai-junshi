<template>
  <div class="markdown-container">
    <!-- 可编辑区域 -->
    <div ref="editableRef" class="editable-html" contenteditable="true" @input="handleInput" v-html="modelValue"></div>

    <!-- 获取编辑结果按钮 -->
    <button @click="emitContent">获取编辑结果</button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineEmits, defineProps } from 'vue'
import TurndownService from 'turndown'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'edit-done', value: string): void
}>()

const editableRef = ref<HTMLElement | null>(null)
const htmlContent = ref(props.modelValue)

// 当父组件更新值时更新内容
watch(
  () => props.modelValue,
  (newVal) => {
    htmlContent.value = newVal
  },
)

// 当输入时更新 v-model 值
const handleInput = () => {
  if (editableRef.value) {
    const html = editableRef.value.innerHTML
    emit('update:modelValue', html)
  }
}

// 获取编辑完的结果
const emitContent = () => {
  if (editableRef.value) {
    const html = editableRef.value.innerHTML
    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(html)
    emit('edit-done', markdown) // 👈 返回 Markdown
  }
}
</script>

<style scoped>
.editable-html {
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 100px;
}
</style>
