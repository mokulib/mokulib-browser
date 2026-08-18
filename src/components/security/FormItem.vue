<script setup lang="ts">
defineProps({
  label: { type: String, required: true },
  description: { type: String, required: false },
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-[88px_auto] gap-2">
    <div class="flex items-center justify-start">
      <p>{{ label }}：</p>
    </div>
    <div class="flex items-center">
      <slot/>
    </div>
    <div class="hidden sm:block"/>
    <p v-if="description" class="text-sm text-(--muted-foreground)">{{ description }} </p>
  </div>
</template>

<style scoped>

</style>