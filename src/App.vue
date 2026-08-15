<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import PageHeader from "@/components/PageHeader.vue";
import PageFooter from "@/components/PageFooter.vue";
import { computed, nextTick, ref, watch } from "vue";
import { usePopupStore } from "@/stores/popup.ts";

const route = useRoute();
const popupStore = usePopupStore();

const hideHeader = computed(() => route.meta.hideHeader ?? false);
const hideFooter = computed(() => route.meta.hideFooter ?? false);
const popupRef = ref<HTMLElement>();
const popupPlugins = Object.values(import.meta.glob('./components/popup/plugins/**/*.vue', { eager: true })).map((mod: any) => mod.default);

watch(() => popupStore.isOpen(), (newValue) => {
  if (newValue) {
    nextTick(() => {
      // 在 popupRef 范围内查找标记了 data-autofocus 的元素
      const autofocusEl = popupRef.value?.querySelector('[data-autofocus]') as HTMLElement | null;
      // 优先聚焦标记了 data-autofocus 的元素
      if (autofocusEl) autofocusEl.focus();
      // 否则聚焦整个弹窗
      else             popupRef.value?.focus();
    });
  }
})
</script>

<template>
  <div class="min-h-screen bg-(--background) text-(--foreground) flex flex-col">
    <header v-if="!hideHeader" class="sticky top-0 z-40 border-b border-(--border) bg-[radial-gradient(transparent_1px,var(--background)_1px)] bg-size-[4px_4px] backdrop-saturate-50 backdrop-blur-xs">
      <PageHeader/>
    </header>

    <RouterView/>

    <footer v-if="!hideFooter" class="border-t border-(--border)">
      <PageFooter/>
    </footer>
  </div>

  <!-- 弹窗遮罩 -->
  <div ref="popupRef" v-show="popupStore.isOpen()" @click.self="popupStore.close()" @keydown.esc="popupStore.close()" tabindex="-1" class="fixed inset-0 z-50 bg-black/66 animate-in fade-in-0 flex items-end justify-center sm:items-center" :class="{ 'sm:bg-transparent': popupStore.isOpen('header') }">
    <!-- 自动挂载预设 Popup 弹窗 -->
    <component v-for="(plugin, index) in popupPlugins" :key="index" :is="plugin"/>
  </div>
</template>

<style scoped>

</style>
