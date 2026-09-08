<script setup lang="ts">
import { usePopupStore } from "@/stores/popup.ts";
import { computed, onMounted, ref, type Reactive } from "vue";
import { useElementBounding } from "@vueuse/core";
import UserInfoContent from "@/components/popup/UserInfoContent.vue";

const popupStore = usePopupStore();

// 修改 payload 类型，包含鼠标位置 x, y
let payload = ref<Reactive<{ x: number; y: number; id: number }> | undefined>();

// 弹窗元素的引用
const popupEl = ref<HTMLElement>();
// 获取弹窗的实际宽高
const { width: popupWidth, height: popupHeight } = useElementBounding(popupEl);
// 偏移量
const OFFSET = 8;

// 计算弹窗的 left 位置
const left = computed(() => {
  if (!payload.value) return 0;

  const mouseX = payload.value.x;
  const windowWidth = document.documentElement.clientWidth;
  const actualWidth = popupWidth.value || 320; // 如果还没测量到，使用默认值

  // 优先在鼠标右侧显示
  let popupLeft = mouseX + OFFSET;

  // 如果右侧空间不够，向左平移
  if (mouseX + actualWidth > windowWidth) {
    popupLeft = Math.max(0, windowWidth - actualWidth);
  }

  return popupLeft;
});

// 计算弹窗的 top 位置
const top = computed(() => {
  if (!payload.value) return 0;

  const mouseY = payload.value.y;
  const windowHeight = document.documentElement.clientHeight;
  const actualHeight = popupHeight.value || 200; // 如果还没测量到，使用默认值

  // 优先在鼠标下方显示
  let popupTop = mouseY + OFFSET;

  // 如果下方空间不够，向上平移
  if (mouseY + actualHeight > windowHeight) {
    popupTop = Math.max(0, windowHeight - actualHeight);
  }

  return popupTop;
});

const userId = computed(() => payload.value?.id ?? 0);

onMounted(() => {
  popupStore.registerInitHook('userInfo', ({ raw }) => {
    payload.value = raw;
  });
});
</script>

<template>
  <div v-if="popupStore.isOpen('userInfo')"
       ref="popupEl"
       class="hidden sm:block fixed z-50 w-80 origin-top-left rounded-xl border border-(--border) bg-(--popover) text-(--popover-foreground) shadow-lg animate-in fade-in-0 zoom-in-95"
       :style="{ top: top + 'px', left: left + 'px' }">
    <div class="p-4">
      <UserInfoContent :user-id="userId"/>
    </div>
  </div>
</template>

<style scoped>

</style>