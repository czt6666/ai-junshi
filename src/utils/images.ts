// 压缩图片
export async function compressImgFiles(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 2600,
  quality: number = 0.8,
): Promise<File> {
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
