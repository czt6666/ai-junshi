<template>
  <FilePond
    :name="name"
    :label-idle="label"
    :allow-multiple="allowMultiple"
    :accepted-file-types="acceptedFileTypes"
    :max-file-size="maxFileSize"
    :allow-image-preview="allowImagePreview"
    :allow-file-size-validation="allowFileSizeValidation"
    :allow-file-type-validation="allowFileTypeValidation"
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

const handleFileUpload = async (error: any, fileItem: any) => {
  if (error) return
  const rawFile = fileItem.file // 原生 File 对象
  const miniFile = await compressImage(rawFile)
  if (miniFile) {
    emit('upload', miniFile)
  }
}

// 压缩图片
const compressImage = (
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 2600,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string
      }
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height *= maxWidth / width))
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width *= maxHeight / height))
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, { type: file.type })
              resolve(compressedFile)
            } else {
              reject(new Error('图片压缩失败'))
            }
          },
          file.type,
          quality,
        )
      } else {
        reject(new Error('无法获取画布上下文'))
      }
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }

    reader.readAsDataURL(file)
  })
}
</script>
