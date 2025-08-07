<template>{{ renderedHtml }}</template>

<script lang="ts" setup>
import MarkdownRenderer from '@/utils/MarkdownRenderer'
import { longText } from '@/utils/MarkdownRenderer/test'

const renderer = new MarkdownRenderer({
  breakCode: false,
  colorfulCode: true,
})

const renderedHtml = renderer.render(longText)

const handleResult = (result: string) => {
  console.log('编辑后内容:', result)
}
</script>
