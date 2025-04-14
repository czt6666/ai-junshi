import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: '',
      name: '',
      email: '',
    },
  }),
  actions: {
    setUserInfo(info) {
      this.userInfo = { ...this.userInfo, ...info }
    },
    clearUserInfo() {
      this.userInfo = { id: '', name: '', email: '' }
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ['userInfo'],
  },
})
