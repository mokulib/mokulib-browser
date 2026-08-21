<script setup lang="ts">

import Popup from "@/components/popup/core/Popup.vue";
import { onMounted, ref } from "vue";
import api from "@/api";
import { usePopupStore } from "@/stores/popup.ts";
import { useAuthStore } from "@/stores/auth.ts";

const authStore = useAuthStore();

const input = ref("");

function confirmHandler () {
  return api.post('/api/users/username', { username: input.value });
}

onMounted(() => {
  usePopupStore().registerInitHook('editUsername', () => input.value = authStore.username);
})
</script>

<template>
  <Popup popup-key="editUsername" title="修改昵称" confirm-text="保存" :confirm-handler="confirmHandler">
    <div class="space-y-1.5">
      <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
        新昵称
      </label>
      <input v-model="input" data-autofocus data-slot="input" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40">
    </div>
  </Popup>
</template>

<style scoped>

</style>