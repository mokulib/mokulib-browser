<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import PageHeader from "@/components/PageHeader.vue";
import PageFooter from "@/components/PageFooter.vue";
import { computed } from "vue";
import HeaderBottomSheet from "@/components/popup/variants/HeaderBottomSheet.vue";
import { usePopupStore } from "@/stores/popup.ts";
import HeaderDropdown from "@/components/popup/variants/HeaderDropdown.vue";

const route = useRoute();
const popupStore = usePopupStore();

const hideHeader = computed(() => route.meta.hideHeader ?? false);
const hideFooter = computed(() => route.meta.hideFooter ?? false);

const popupComponents = Object.values(import.meta.glob('./components/popup/presets/*.vue', { eager: true }))
  .map((mod: any) => mod.default);
</script>

<template>
  <div class="min-h-screen bg-(--background) text-(--foreground) flex flex-col">
    <header v-if="!hideHeader" class="sticky top-0 z-40 border-b border-(--border) bg-(--background)/85 backdrop-blur-md">
      <PageHeader/>
    </header>

    <RouterView/>

    <footer v-if="!hideFooter" class="border-t border-(--border)">
      <PageFooter/>
    </footer>
  </div>

  <div v-show="popupStore.isOpen()" @click.self="popupStore.close()" class="fixed inset-0 z-50 bg-(--foreground)/40 animate-in fade-in-0 flex items-end justify-center sm:items-center" :class="{ 'sm:bg-transparent': popupStore.isOpen('header') }">
    <!-- 自动挂载预设 Popup 弹窗 -->
    <component v-for="(component, index) in popupComponents" :key="index" :is="component"/>
    <!-- 手动挂载变种弹窗 -->
    <HeaderDropdown/>
    <HeaderBottomSheet/>
  </div>
</template>

<style scoped>

</style>
