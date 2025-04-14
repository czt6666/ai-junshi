<template>
  <SelectAbleText :renderedHtml="renderedHtml" />
</template>

<script lang="ts" setup>
import MarkdownRenderer from '@/utils/MarkdownRenderer'
import { longText } from '@/utils/MarkdownRenderer/test'
import SelectAbleText from '@/components/SelectAbleText.vue'

const renderer = new MarkdownRenderer({
  breakCode: false,
  colorfulCode: true,
})

const renderedHtml = renderer.render(longText)
</script>
