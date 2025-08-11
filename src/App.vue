<template>
  <div class="page">
    <h1 class="title">AI军师</h1>
    <div class="route">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.page {
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
}
.title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 1rem auto;
}
.route {
  flex: 1;
  background-color: pink;
}
</style>
