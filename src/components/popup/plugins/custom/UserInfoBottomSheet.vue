<script setup lang="ts">
import { X } from "@lucide/vue";
import { usePopupStore } from "@/stores/popup.ts";
import { onMounted, ref } from "vue";
import UserInfoContent from "@/components/popup/UserInfoContent.vue";

const popupStore = usePopupStore();

const userId = ref(0);

onMounted(() => {
  popupStore.registerInitHook('userInfo', async ({ clone }) => {
    userId.value = clone.id;
  });
});
</script>

<template>
  <div v-if="popupStore.isOpen('userInfo')" class="sm:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-(--border) bg-(--popover) pb-[env(safe-area-inset-bottom)] text-(--popover-foreground) shadow-2xl animate-in slide-in-from-bottom">
    <div class="flex items-center justify-center px-4 pt-3">
      <span class="h-1.5 w-10 rounded-full bg-(--border)"></span>
      <button @click="popupStore.close()" class="absolute right-3 top-3 rounded-md p-1.5 text-(--muted-foreground) hover:bg-(--accent)">
        <X class="size-5"/>
      </button>
    </div>
    <div class="px-4 pt-2 pb-10">
      <UserInfoContent :user-id="userId"/>
    </div>
  </div>
</template>

<style scoped>

</style>