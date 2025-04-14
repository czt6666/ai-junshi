<template>
  <div class="markdown-container" @mouseup="handleSelection">
    <div v-html="renderedHtml" class="markdown-content"></div>

    <!-- 浮动按钮 -->
    <button
      v-if="showButton"
      class="floating-button"
      :style="{ top: `${buttonPos.y}px`, left: `${buttonPos.x}px` }"
      @click="handleAction"
    >
      💡操作
    </button>
  </div>
</template>

<script lang="ts">
import { getAnnotations, saveAnnotation } from '@/utils/db'
import { handleSelection, handleAction, restoreAnnotation } from '@/utils/selectText'

export default {
  props: {
    renderedHtml: String,
  },
  data() {
    return {
      showButton: false,
      buttonPos: { x: 0, y: 0 },
      selectionInfo: {
        text: '',
        startOffset: 0,
        endOffset: 0,
        containerPath: '',
      },
    }
  },
  mounted() {
    // setTimeout(async () => {
    //   const annotations = await getAnnotations()
    //   annotations.forEach((ann) => {
    //     this.restoreAnnotation({ ...ann, type: 'underline' })
    //   })
    // }, 100) // 等渲染完毕
  },
  methods: {
    handleSelection,
    // handleSelection() {
    //   ()
    // },
    async handleAction() {
      this.showButton = false
    },
    restoreAnnotation() {},
  },
}
</script>

<style scoped>
.markdown-container {
  position: relative;
}

.floating-button {
  position: absolute;
  z-index: 1000;
  padding: 4px 8px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
.highlight {
  background-color: yellow;
}

.underline {
  text-decoration: underline;
  text-decoration-color: red;
  text-decoration-thickness: 2px;
}
</style>
