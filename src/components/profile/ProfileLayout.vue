<script setup lang="ts">
import { ChevronLeft, Loader } from "@lucide/vue";
import { useRouter } from "vue-router";

defineProps({
  isLoading: { type: Boolean, required: true },
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

    <!-- 加载中 -->
    <div v-if="isLoading" class="flex flex-col items-center py-20 sm:py-4 gap-2">
      <Loader class="size-5 text-(--secondary-foreground) opacity-0 animate-spin" :class="{ 'opacity-100': isLoading }" style="transition-duration: 500ms; animation-duration: 3000ms"/>
      <p class="tracking-wider text-sm text-(--muted-foreground)">加载中...</p>
    </div>

    <!-- 空信息 -->
    <div v-if="!isLoading && isEmpty" class="flex flex-col items-center py-20 sm:py-4 gap-2">
      <component :is="emptyIcon" class="size-8 text-(--muted-foreground)/50"/>
      <p class="text-sm text-(--muted-foreground)">{{ emptyText }}</p>
    </div>

    <template v-if="!isLoading && !isEmpty">
      <slot/>
    </template>
  </div>
</template>

<style scoped>

</style>