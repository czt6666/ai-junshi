<template>
  <!-- 输入框 -->
  <div class="textarea_container">
    <label for="textarea" class="hidden">输入内容：</label>
    <textarea
      ref="textarea"
      v-model="inputValue"
      :disabled="disabled"
      :readonly="readonly"
      :autofocus="autofocus"
      :placeholder="placeholder"
      :rows="rows"
      class="textarea"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="isFocused = true"
      @blur="isFocused = false"
    ></textarea>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  autofocus?: boolean
  maxScrollHeight?: number
  rows?: number // 👈 支持初始行数
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

const inputValue = ref(props.modelValue)
const isFocused = ref(false)
const textarea = ref<HTMLTextAreaElement | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    inputValue.value = val
  },
)

watch(inputValue, (val) => {
  emit('update:modelValue', val)
  autoAdjustHeight()
})

const autoAdjustHeight = () => {
  nextTick(() => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'

      const lineHeight = 20 // 你可以根据 font-size 调整
      const minHeight = (props.rows || 1) * lineHeight

      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.value.scrollHeight, props.maxScrollHeight || 140),
      )

      textarea.value.style.height = newHeight + 'px'
    }
  })
}

const handleInput = () => {
  emit('update:modelValue', inputValue.value)
}

const insertNewline = () => {
  const el = textarea.value
  if (!el) return

  const start = el.selectionStart
  const end = el.selectionEnd

  inputValue.value = inputValue.value.slice(0, start) + '\n' + inputValue.value.slice(end)

  nextTick(() => {
    el.selectionStart = el.selectionEnd = start + 1
    autoAdjustHeight()
  })
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    insertNewline()
  }
}

onMounted(autoAdjustHeight)
</script>

<style lang="scss" scoped>
.textarea_container {
  display: flex;
  align-items: center;
  min-height: 44px;
  flex: 1 1 0;

  .textarea {
    width: 100%;
    height: 16px;
    max-height: 140px;
    border: none;
    outline: none;
    resize: none;
    font-size: 14px;
    overflow-y: auto;
    padding-left: 8px;
    background-color: transparent;

    &:focus {
      outline: none;
      border: none;
    }
  }
}

.hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
}
</style>
