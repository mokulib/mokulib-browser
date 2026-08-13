<script setup lang="ts">
import { ChevronLeft } from "@lucide/vue";
import { useRouter } from "vue-router";

defineProps({
  isEmpty: { type: Boolean, required: true },
  emptyText: { type: String, required: true },
  emptyIcon: { type: [ Object, Function ], required: true },
})

const router = useRouter();
</script>

<template>
  <div class="flex flex-col sm:gap-8">
    <!-- 标题 -->
    <div class="flex items-center px-4 sm:px-0 pt-4 sm:pt-0 sm:pb-4 gap-4 sm:border-b sm:border-(--border)">
      <ChevronLeft @click="router.back()" class="block sm:hidden ml-2 size-5 cursor-pointer"/>
      <slot name="title"/>
    </div>

    <!-- 空信息 -->
    <div v-if="isEmpty" class="flex flex-col items-center py-20 sm:py-4 gap-2">
      <component :is="emptyIcon" class="size-8 text-(--muted-foreground)/50"/>
      <p class="text-sm text-(--muted-foreground)">{{ emptyText }}</p>
    </div>

    <template v-if="!isEmpty">
      <slot/>
    </template>
  </div>
</template>

<style scoped>

</style>