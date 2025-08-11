import { defineStore } from 'pinia'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    screenWidth: window.innerWidth, // 用于宽度判断
  }),

  getters: {
    // 复杂判断设备类型（使用 UA 和平台特征）
    deviceType: (state) => {
      const ua = navigator.userAgent
      const platform = navigator.platform || ''
      const maxTouchPoints = navigator.maxTouchPoints || 0
      console.log(ua, platform, maxTouchPoints)

      // 判断顺序：大屏 -> PC -> Pad -> Mobile
      if (/TV|SmartTV|HbbTV|NetCast|AppleTV|GoogleTV|DTV/i.test(ua)) {
        return 'tv'
      }

      if (/Windows|Macintosh|Linux/.test(platform) && maxTouchPoints === 0) {
        return 'pc'
      }

      if (/iPad|Tablet|PlayBook|Nexus 7|Nexus 10|KFAPWI/i.test(ua)) {
        return 'pad'
      }

      if (/Android/i.test(ua) && !/Mobile/i.test(ua)) {
        return 'pad'
      }

      if (/iPhone|Android.*Mobile|Windows Phone|BlackBerry|Opera Mini/i.test(ua)) {
        return 'mobile'
      }

      return 'unknown'
    },

    // 简单判断是否为移动端（通过屏幕宽度）
    isMobileByWidth: (state) => state.screenWidth <= 768,
  },

  actions: {
    updateScreenWidth() {
      this.screenWidth = window.innerWidth
    },
  },

  persist: {
    storage: sessionStorage,
  },
})
