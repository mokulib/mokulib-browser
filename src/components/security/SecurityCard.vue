<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <div class="flex flex-col py-4 md:py-8 gap-4 border-b border-(--border) last:border-b-0">
    <p class="font-semibold">{{ title }}</p>
    <div class="flex flex-col px-4 md:px-8 gap-4">
      <slot/>
    </div>
  </div>
</template>

<style scoped>

</style>