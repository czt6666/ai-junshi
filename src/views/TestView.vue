<template>
  <editAbleText v-model="renderedHtml" @edit-done="handleResult" />
</template>

<script lang="ts" setup>
import MarkdownRenderer from '@/utils/MarkdownRenderer'
import { longText } from '@/utils/MarkdownRenderer/test'
import editAbleText from '@/components/editAbleText.vue'

const renderer = new MarkdownRenderer({
  breakCode: false,
  colorfulCode: true,
})

const renderedHtml = renderer.render(longText)

const handleResult = (result: string) => {
  console.log('编辑后内容:', result)
}
</script>
