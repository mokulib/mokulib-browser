<script setup lang="ts">
import { computed, useSlots } from "vue";
import { X } from "@lucide/vue";
import { type PopupKey, usePopupStore } from "@/stores/popup.ts";

// 接收传参
const popupKey = defineModel<PopupKey>("popupKey", { required: true });
const title = defineModel<string>("title", { required: false, default: '标题' });
const confirm = defineModel<string>("confirm", { required: false, default: '确定' });
const confirmType = defineModel<'default' | 'danger'>("confirmType", { required: false, default: 'default' });
// 定义事件（向外发送）
const emit = defineEmits<{
  confirm: [];
}>();

const slots = useSlots();

const popupStore = usePopupStore();

const show = computed(() => popupStore.isOpen(popupKey.value));
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-70 flex items-end justify-center sm:items-center">
    <!-- 遮罩 -->
    <div @click="popupStore.close" class="absolute inset-0 bg-(--foreground)/40 animate-in fade-in-0"></div>
    <!-- Popup -->
    <div class="relative z-10 w-full max-w-md rounded-t-2xl border border-(--border) bg-(--popover) text-(--popover-foreground) shadow-2xl animate-in slide-in-from-bottom sm:rounded-2xl sm:zoom-in-95">
      <!-- 标题 -->
      <div class="flex items-start justify-between gap-4 border-b border-(--border) px-5 py-4">
        <div>
          <h2 class="font-serif text-lg font-semibold">{{ title }}</h2>
          <p class="mt-1 text-sm text-(--muted-foreground)">
            <slot name="content"></slot>
          </p>
        </div>
        <button type="button" @click="popupStore.close()" class="rounded-md p-1.5 text-(--muted-foreground) transition-colors hover:bg-(--accent) hover:text-(--foreground)">
          <X class="size-5"/>
        </button>
      </div>
      <!-- 表单（可选） -->
      <div :class="{ 'px-5 py-4': !!slots.default }">
        <slot></slot>
      </div>
      <!-- 按钮组 -->
      <div class="flex justify-end gap-2 px-5 py-3" :class="{ 'border-t border-(--border)': !!slots.default }">
        <button type="button" @click="popupStore.close()" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 hover:bg-(--muted) hover:text-(--foreground) aria-expanded:bg-(--muted) aria-expanded:text-(--foreground) dark:hover:bg-(--muted)/50 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
          取消
        </button>
        <button v-if="confirmType === 'default'" type="button" @click="emit('confirm')" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none
          focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50
          active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4
          bg-(--primary) text-(--primary-foreground) hover:bg-(--primary)/80
          h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
          {{ confirm }}
        </button>
        <button v-if="confirmType === 'danger'" type="button" @click="emit('confirm')" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none
          focus-visible:border-(--destructive)/40 focus-visible:ring-3 focus-visible:ring-(--destructive)/20
          active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4
          bg-(--destructive)/10 text-(--destructive) hover:bg-(--destructive)/20
          dark:bg-(--destructive)/20 dark:hover:bg-(--destructive)/30 dark:focus-visible:ring-(--destructive)/40
          h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2">
          {{ confirm }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
