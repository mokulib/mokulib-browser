<script setup lang="ts">
import Popup from "@/components/popup/Popup.vue";
import { type PopupKey, usePopupStore } from "@/stores/popup.ts";
import { ref, watch } from "vue";

const popupStore = usePopupStore();

const bookId = ref<number>(-1);

async function confirmHandler() {
}

// 监听弹窗打开
watch(() => popupStore.popups, (newValue: PopupKey | undefined) => {
  if (newValue === 'editBook')
    bookId.value = popupStore.safePayload<'uploadBookImage'>().id;
})
</script>

<template>
  <Popup popup-key="uploadBookImage" title="重新上传封面" confirm-text="保存" :confirm-handler="confirmHandler">
    <template #content>
      选择一张新的封面图片替换当前封面。
    </template>
    <template #default>
      <form class="space-y-3">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="cover-file">
          封面图片
        </label>
        <input data-slot="input" accept="image/*" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" type="file">
      </form>
    </template>
  </Popup>
</template>

<style scoped>

</style>