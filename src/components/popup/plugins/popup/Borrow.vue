<script setup lang="ts">
import { Loader, Search } from "@lucide/vue";
import Popup from "@/components/popup/core/Popup.vue";
import { usePopupStore } from "@/stores/popup.ts";
import { computed, onMounted, ref, watch } from "vue";
import api from "@/api";
import { type BookCopyAdmin, type User } from "@/types";

const bookCopyId = ref<any>();

const userIdOrEmailInput = ref<any>();
const isRenewedInput = ref<boolean>(false);
const user = ref<User | undefined>(undefined); // 查询结果
const delayRequest = ref<ReturnType<typeof setTimeout> | undefined>(undefined); // 需要查询（延迟请求）
const userNotFound = computed(() => !!delayRequest.value || !user.value); // 用户未找到状态，用于控制能否提交

function confirmHandler() {
  return api.post<BookCopyAdmin>(`/api/book-copies/${bookCopyId}/borrow`, { user_id: user.value?.id, is_renewed: isRenewedInput.value });
}

// 监听输入
watch(userIdOrEmailInput, (newValue) => {
  // 清除请求
  if (delayRequest) {
    clearTimeout(delayRequest.value)
    delayRequest.value = undefined
  }

  // 当前输入为空白，清除查询结果，不设置请求
  const trimmed = newValue?.trim()
  if (!trimmed) {
    user.value = undefined
    return
  }

  // 尝试解析用户 ID
  const userId = parseInt(trimmed);
  // 解析成功
  if (!isNaN(userId)) {
    // 设置定时器
    delayRequest.value = setTimeout(async () => {
      user.value = (await api.get('/api/users', { params: { id: userId } })).data;
      delayRequest.value = undefined // 清空本定时器
    }, 1000)
    // 结束解析
    return;
  }

  // 尝试解析用户邮箱
  const isEmail = trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  // 解析成功
  if (isEmail) {
    // 设置定时器
    delayRequest.value = setTimeout(async () => {
      user.value = (await api.get('/api/users', { params: { email: trimmed } })).data;
      delayRequest.value = undefined // 清空本定时器
    }, 1000)
    // 结束解析
    return;
  }

  // 解析失败，重置用户搜索结果
  user.value = undefined;
}, { immediate: false });

onMounted(() => {
  usePopupStore().registerInitHook('borrow', ({ clone }) => {
    // 刷新 payload
    bookCopyId.value = clone.id;
    // 清空输入
    userIdOrEmailInput.value = null;
  })
})
</script>

<template>
  <Popup popup-key="borrow" title="借出馆藏" confirm-text="确认借出" :confirm-disabled="userNotFound" :confirm-handler="confirmHandler">
    <div class="space-y-3">
      <div class="space-y-1.5">
        <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
          借阅人
        </label>
        <div class="flex items-stretch">
          <input v-model="userIdOrEmailInput" data-autofocus data-slot="input" placeholder="输入用户 ID 或邮箱" class="relative z-10 h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 rounded-r-none">
          <span class="inline-flex select-none items-center rounded-r-md border border-l-0 border-(--border) bg-(--muted) px-3 font-mono text-sm font-semibold tracking-widest text-(--muted-foreground)" aria-label="验证码前缀">
            <Search v-if="!delayRequest" class="size-4 items-stretch"/>
            <Loader v-else class="size-4 animate-spin"/>
          </span>
        </div>
      </div>
      <div class="flex border border-(--border) rounded-lg p-2 bg-(--secondary)">
        <img :src="'/avatars/' + (user?.id ?? 'default') + '.png'" class="size-16" alt="头像"/>
        <div class="ml-2 space-y-1.5">
          <div class="flex items-center gap-2 text-sm font-medium leading-none">
            <div>{{ user?.username ?? (userIdOrEmailInput ? '用户未找到' : '请输入用户 ID 或邮箱') }}</div>
            <div v-if="user" class="text-xs text-(--muted-foreground)">
              ID {{ user.id }}
            </div>
          </div>
          <div class="text-xs text-(--muted-foreground)">
            {{ user?.email }}
          </div>
        </div>
      </div>
      <div class="space-y-1.5">
        <label class="flex items-center gap-2 text-sm text-(--foreground)">
          <input v-model="isRenewedInput" class="size-4 rounded border-(--border) accent-(--primary)" type="checkbox">
          借出时即勾选续借（借阅两周）
        </label>
      </div>
    </div>
  </Popup>
</template>

<style scoped>
/* 复选框背景色修复 */
input[type="checkbox"] {
  /* 移除原生样式 */
  appearance: none;
  -webkit-appearance: none;

  /* 颜色渐变动画 - from tailwind css class transition-colors */
  transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  /* 设置尺寸 */
  width: 16px;
  height: 16px;
  flex-shrink: 0;

  /* 未选中时 */
  background-color: var(--background);
  border: 2px solid var(--border);
  border-radius: 4px;

  /* 勾选标记居中 */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* 辅助 after 元素定位 */
  position: relative;
}

input[type="checkbox"]:active {
  border-color: var(--primary);
}

input[type="checkbox"]:checked:active {
  background-color: var(--destructive);
  border-color: var(--destructive);
}

/* 复选框选中时的样式 */
input[type="checkbox"]:checked {
  background-color: var(--primary);
  border-color: var(--primary);
}

/* 复选框勾选标记 */
input[type="checkbox"]:checked::after {
  content: "";
  width: 12px;
  height: 12px;
  background-image: url("@/assets/circle-small.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  /* 居中 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>