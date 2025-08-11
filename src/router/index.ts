import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TestView from '../views/TestView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomeView,
    },
    {
      path: '/upload-img',
      name: 'UploadImg',
      component: () => import('@/views/UploadImg.vue'),
    },
    {
      path: '/input-txt',
      name: 'InputTxt',
      component: () => import('@/views/InputTxt.vue'),
    },
    {
      path: '/confirm',
      name: 'Confirm',
      component: () => import('@/views/Confirm.vue'),
    },
    {
      path: '/result',
      name: 'Result',
      component: () => import('@/views/ResultPage.vue'),
    },
    {
      path: '/test',
      name: 'Test',
      component: TestView,
    },
  ],
})

export default router
