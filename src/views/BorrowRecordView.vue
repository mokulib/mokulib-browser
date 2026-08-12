<script setup lang="ts">
import { toRef } from "vue";

const props = defineProps({ id: { type: String, required: true } });
const id = toRef(props, "id");
</script>

<template>
  <main class="flex-1">
    <div class="mx-auto max-w-6xl flex px-4 md:px-8">
      馆藏编号：{{ id }}
    </div>
  </main>
</template>

<style scoped>

</style>