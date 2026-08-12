<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  route: { type: String, required: true },
  icon: { type: [ Object, Function ], required: true },
});
</script>

<template>
  <RouterLink :to="{ name: route }" class="flex flex-col items-center gap-1 text-(--foreground)">
    <component :is="icon" class="size-6"/>
    <p class="text-sm">{{ title }}</p>
  </RouterLink>
</template>

<style scoped>

</style>