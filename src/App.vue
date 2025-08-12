<template>
  <div class="page">
    <div class="header">
      <div class="home" @click="goHome">
        重开 <br />
        首页
      </div>
      <h1 class="title">AI军师</h1>
    </div>
    <div class="route">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserDataStore } from './stores/userData'

const router = useRouter()
const userDataStore = useUserDataStore()

function goHome() {
  router.push({ name: 'HomePage' })
  userDataStore.clear()
}
</script>
<style scoped>
.page {
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: rgb(255, 251, 230);
  flex-direction: column;
}
.header {
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: center;

  .home {
    text-align: center;
    width: 50px;
    height: 50px;
    background-color: pink;
    border-radius: 8px;
    margin-right: 20px;
  }

  .title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
  }
}
.route {
  flex: 1;
}
</style>
