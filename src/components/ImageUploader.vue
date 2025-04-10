<template>
  <FilePond
    :name="name"
    :label-idle="label"
    :allow-multiple="allowMultiple"
    :accepted-file-types="acceptedFileTypes"
    :max-file-size="maxFileSize"
    :allow-image-preview="allowImagePreview"
    :image-preview-height="imagePreviewHeight"
    :allow-file-size-validation="allowFileSizeValidation"
    :allow-file-type-validation="allowFileTypeValidation"
    :credits="false"
    @addfile="handleFileUpload"
    v-bind="otherProps"
  />
</template>

<script lang="ts" setup>
import { useAttrs } from 'vue'
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

// 注册插件
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)

// 定义 props 并添加默认值
const props = withDefaults(
  defineProps<{
    name?: string
    label?: string
    acceptedFileTypes?: string[]
    maxFileSize?: string
    allowMultiple?: boolean
    allowImagePreview?: boolean
    allowFileSizeValidation?: boolean
    allowFileTypeValidation?: boolean
    onUpload?: (file: File) => void
  }>(),
  {
    name: 'imgFile',
    label: '拖拽或点击上传图片',
    acceptedFileTypes: () => ['image/*'], // 所有图片类型
    maxFileSize: '5MB',
    allowMultiple: false,
    allowImagePreview: true,
    allowFileSizeValidation: true,
    allowFileTypeValidation: false, // 不检验类型
  },
)

// 透传未声明的属性
const otherProps = useAttrs()

// 触发 upload 事件
const emit = defineEmits<{
  (e: 'upload', file: File): void
}>()

const handleFileUpload = (e) => {
  const file: File = e.detail.file.file
  if (file) {
    emit('upload', file)
    props.onUpload?.(file)
  }
}
</script>
