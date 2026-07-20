<script setup lang="ts">
import { onMounted, ref } from "vue";
import { usePopupStore } from "@/stores/popup.ts";
import Popup from "@/components/popup/Popup.vue";

const popupStore = usePopupStore();

const tags = ref<string[]>();

onMounted(() => {
  tags.value = ['长篇小说', '人性', '孤独', '家族史诗', '畅销', '值得重读', '译本佳作', '精装'];
})
</script>

<template>
  <Popup popup-key="addTag" title="添加标签" confirm="添加" @confirm="popupStore.close">
    <template #content>
      从标签库中选择，或自定义一个新标签。
    </template>
    <template #default>
      <div class="space-y-4">
        <div>
          <label data-slot="label" class="items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 mb-2 block">从标签库选择</label>
          <div class="flex flex-wrap gap-2">
            <template v-for="tag in tags">
              <button type="button" class="rounded-full border border-(--border) px-2.5 py-0.5 text-xs text-(--foreground) transition-colors hover:border-(--primary) hover:text-(--primary)">
                {{ tag }}
              </button>
            </template>
          </div>
        </div>
        <div class="space-y-1.5">
          <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="custom-tag">
            自定义标签
          </label>
          <input id="custom-tag" data-slot="input" placeholder="输入新标签名" class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" value="">
        </div>
      </div>
    </template>
  </Popup>
</template>

<style scoped>

</style>