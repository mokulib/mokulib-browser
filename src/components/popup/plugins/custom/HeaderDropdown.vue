<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.ts";
import { usePopupStore } from "@/stores/popup.ts";
import { computed, onMounted, type Reactive, ref } from "vue";
import HeaderContent from "@/components/popup/HeaderContent.vue";

const authStore = useAuthStore();
const popupStore = usePopupStore();

let payload = ref<Reactive<{ top: number; right: number; height: number; }> | undefined>();
let right = computed(() => !payload.value ? 0 : document.documentElement.clientWidth - payload.value.right); // document.documentElement.clientWidth 相比 window.innerWidth，减去了滚动条宽度
let top = computed(() => !payload.value ? 0 : payload.value.top + payload.value.height);

onMounted(() => {
  popupStore.registerInitHook('header', ({ raw }) => payload.value = raw )
})
</script>

<template>
  <div v-if="popupStore.isOpen('header')" class="hidden sm:block absolute z-50 mt-2 w-72 origin-top-right rounded-xl border border-(--border) bg-(--popover) text-(--popover-foreground) shadow-lg animate-in fade-in-0 zoom-in-95"
       :class="{ 'w-90': !authStore.isAuthed, 'w-72': authStore.isAuthed }"
       :style="{ top: top + 'px', right: right + 'px' }">
    <HeaderContent/>
  </div>
</template>

<style scoped>

</style>