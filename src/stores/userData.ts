// stores/userData.ts
import { defineStore } from 'pinia'

export interface UserDataState {
  systemPrompt: string
  userPrompt: string
  chatHistoryText: string
  chatScreenshotList: string[] // 存 uuid
  modelReplyHistory: {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
  }[]
}

export const useUserDataStore = defineStore('userData', {
  state: (): UserDataState => ({
    systemPrompt: '',
    userPrompt: '',
    chatHistoryText: '',
    chatScreenshotList: [],
    modelReplyHistory: [],
  }),

  actions: {
    setUserPrompt(prompt: string) {
      this.userPrompt = prompt
    },
    setChatHistoryText(text: string) {
      this.chatHistoryText = text
    },
    addScreenshot(id: string) {
      if (!this.chatScreenshotList.includes(id)) {
        this.chatScreenshotList.push(id)
      }
    },
    addModelReply(reply: { id: string; role: 'user' | 'assistant'; content: string; timestamp: number }) {
      this.modelReplyHistory.push(reply)
    },
    clear() {
      this.systemPrompt = ''
      this.userPrompt = ''
      this.chatHistoryText = ''
      this.chatScreenshotList = []
      this.modelReplyHistory = []
    },
  },

  persist: {
    key: 'user-data',
    storage: localStorage,
    // pick: ['systemPrompt', 'userPrompt', 'chatHistoryText', 'modelReplyHistory', 'chatScreenshotList'], // 持久化 uuid
  },
})
