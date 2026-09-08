<script setup lang="ts">
import { X } from "@lucide/vue";
import { usePopupStore } from "@/stores/popup.ts";
import HeaderContent from "@/components/popup/HeaderContent.vue";

const popupStore = usePopupStore();
</script>

<template>
  <div v-if="popupStore.isOpen('header')" class="absolute block sm:hidden z-50 inset-x-0 bottom-0 rounded-t-2xl border-t border-(--border) bg-(--popover) pb-[env(safe-area-inset-bottom)] text-(--popover-foreground) shadow-2xl animate-in slide-in-from-bottom">
    <!-- 辅助元素 -->
    <div class="flex items-center justify-center px-4 pt-3">
      <span class="h-1.5 w-10 rounded-full bg-(--border)"></span>
      <button type="button" @click="() => popupStore.close()" aria-label="关闭" class="absolute right-3 top-3 rounded-md p-1.5 text-(--muted-foreground) hover:bg-(--accent)">
        <X class="size-5"/>
      </button>
    </div>
    <!-- 主体 -->
    <div class="pt-2 pb-8">
      <HeaderContent/>
    </div>
  </div>
</template>

<style scoped>

</style>