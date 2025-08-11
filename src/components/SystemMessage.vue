<template>
  <div class="system-message">
    <p>{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  message: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.system-message {
  padding: 8px;
  background-color: #ffccbc;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #d32f2f;
}
</style>
