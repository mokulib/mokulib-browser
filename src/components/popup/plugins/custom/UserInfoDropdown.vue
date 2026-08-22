<script setup lang="ts">
import { Mail, Calendar, BookOpen } from "@lucide/vue";
import { usePopupStore } from "@/stores/popup.ts";
import { useUserStore } from "@/stores/user.ts";
import { DateTime } from "luxon";
import { computed, onMounted, ref, type Reactive } from "vue";
import { useElementBounding } from "@vueuse/core";

const popupStore = usePopupStore();
const userCache = useUserStore();

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
const userInfo = computed(() => userCache.user(userId.value).value);

onMounted(() => {
  popupStore.registerInitHook('userInfo', ({ raw }) => {
    payload.value = raw;
    if (userId.value) {
      userCache.preload(userId.value);
    }
  });
});
</script>

<template>
  <div v-if="popupStore.isOpen('userInfo')"
       ref="popupEl"
       class="hidden sm:block fixed z-50 w-80 origin-top-left rounded-xl border border-(--border) bg-(--popover) text-(--popover-foreground) shadow-lg animate-in fade-in-0 zoom-in-95"
       :style="{ top: top + 'px', left: left + 'px' }">
    <div v-if="userInfo" class="px-4 py-4">
      <!-- 用户基本信息 -->
      <div class="flex items-center gap-3">
        <img :src="`/avatars/${userInfo.id}`" :alt="userInfo.username"
             class="size-12 shrink-0 rounded-full border border-(--border) object-cover">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate font-serif text-base font-semibold text-(--foreground)">
              {{ userInfo.username }}
            </p>
            <span class="shrink-0 rounded-full bg-(--primary)/10 px-2 py-0.5 text-[11px] font-medium text-(--primary)">
              {{ userInfo.role === 'ADMIN' ? '管理员' : '读者' }}
            </span>
          </div>
          <p class="truncate text-xs text-(--muted-foreground)">{{ userInfo.email }}</p>
        </div>
      </div>

      <!-- 详细信息 -->
      <div class="mt-3 flex flex-col gap-2 border-t border-(--border) pt-3 text-sm">
        <div class="flex items-center gap-2 text-(--muted-foreground)">
          <Mail class="size-4 shrink-0"/>
          <span class="truncate">{{ userInfo.email }}</span>
        </div>
        <div class="flex items-center gap-2 text-(--muted-foreground)">
          <Calendar class="size-4 shrink-0"/>
          注册于 {{ DateTime.fromISO(userInfo.create_time).toFormat('yyyy-MM-dd') }}
        </div>
        <div v-if="userInfo.bio" class="flex items-start gap-2 text-(--muted-foreground)">
          <BookOpen class="size-4 mt-0.5 shrink-0"/>
          <span class="wrap-break-word">{{ userInfo.bio }}</span>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center px-4 py-8 text-sm text-(--muted-foreground)">
      加载中...
    </div>
  </div>
</template>

<style scoped>

</style>