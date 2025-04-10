<template>
  <div class="time-message">
    <p>{{ time }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  time: String, // Accepting time as a string prop
})
</script>

<style scoped>
.time-message {
  padding: 8px;
  background-color: #e0f7fa;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #00796b;
}
</style>
