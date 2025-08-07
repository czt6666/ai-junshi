import { defineStore } from 'pinia'

export const useUserDataStore = defineStore('userData', {
  state: () => ({
    type: '', // 'image' 或 'text'
    content: null as string | File | null, // 文本内容或原生 File 对象
  }),
  actions: {
    setData(type: string, content: string | File) {
      this.type = type
      this.content = content
    },
    clear() {
      this.type = ''
      this.content = null
    },
  },
})
