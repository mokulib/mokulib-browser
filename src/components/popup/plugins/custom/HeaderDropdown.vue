<script setup lang="ts">
import { ArrowRight, ShieldKeyhole, BookPlus, LayoutDashboard, LogOut, Moon, Sun, SunMoon, User } from "@lucide/vue";
import { useAuthStore } from "@/stores/auth.ts";
import { useUserStore } from "@/stores/user.ts";
import { usePopupStore } from "@/stores/popup.ts";
import { useThemeStore } from "@/stores/theme.ts";
import { computed, onMounted, type Reactive, ref } from "vue";
import type { Response } from "@/types";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();
const popupStore = usePopupStore();
const themeStore = useThemeStore();

let payload = ref<Reactive<{ top: number; right: number; height: number; }> | undefined>();
let right = computed(() => !payload.value ? 0 : document.documentElement.clientWidth - payload.value.right); // document.documentElement.clientWidth 相比 window.innerWidth，减去了滚动条宽度
let top = computed(() => !payload.value ? 0 : payload.value.top + payload.value.height);

function switchTheme() {
  themeStore.toggle();
  popupStore.close();
}

/////////////////////////////////////////////
// 弹窗回调
/////////////////////////////////////////////

async function addBookCallback(data: Response<number>) {
  if (data.status === 'OK') {
    ElMessage.success(data.message);
    router.push({ name: 'book', params: { id: data.data } });
  } else {
    ElMessage.error(data.message);
  }
}

/////////////////////////////////////////////
// 监听
/////////////////////////////////////////////

onMounted(() => {
  popupStore.registerInitHook('header', ({ raw }) => payload.value = raw )
})
</script>

<template>
  <div v-if="popupStore.isOpen('header')" class="hidden sm:block absolute z-50 mt-2 w-72 origin-top-right rounded-xl border border-(--border) bg-(--popover) text-(--popover-foreground) shadow-lg animate-in fade-in-0 zoom-in-95"
       :style="{ top: top + 'px', right: right + 'px' }">
    <!-- 信息 -->
    <div class="flex items-center gap-3 px-4 py-4">
      <img :src="userStore.user_avatar" :alt="userStore.user_username + '的头像'" class="size-11 shrink-0 rounded-full border border-(--border) object-cover">
      <div class="min-w-0 self-stretch flex flex-col justify-between">
        <div class="flex items-center gap-2">
          <p class="truncate font-serif text-base font-semibold text-(--foreground)">{{ userStore.user_username }}</p>
          <span class="shrink-0 rounded-full bg-(--primary)/10 px-2 py-0.5 text-[11px] font-medium text-(--primary)">{{ userStore.user_role_name }}</span>
        </div>
        <p class="truncate text-xs text-(--muted-foreground)">{{ userStore.user_email }}</p>
      </div>
    </div>
    <div class="mb-1 border-t border-(--border)"></div>
    <!-- 个人中心 -->
    <div class="px-2 py-1">
      <RouterLink :to="{ name: 'profile' }" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
        <div class="flex items-center gap-2.5 py-2 text-sm">
          <User class="size-4"/>
          个人中心
        </div>
        <ArrowRight class="size-4"/>
      </RouterLink>
    </div>
    <!-- 账号与安全 -->
    <div class="px-2 py-1">
      <RouterLink :to="{ name: 'security' }" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
        <div class="flex items-center gap-2.5 py-2 text-sm">
          <ShieldKeyhole class="size-4"/>
          账号与安全
        </div>
        <ArrowRight class="size-4"/>
      </RouterLink>
    </div>
    <div v-if="userStore.user_is_admin" class="my-1 border-t border-(--border)"></div>
    <!-- 录入新书 -->
    <div v-if="userStore.user_is_admin" class="px-2 py-1">
      <a href="/" @click.prevent="popupStore.open('addBook', undefined, addBookCallback)" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
        <div class="flex items-center gap-2.5 py-2 text-sm">
          <BookPlus class="size-4"/>
          录入新书
        </div>
      </a>
    </div>
    <!-- 数据概览 -->
    <div v-if="userStore.user_is_admin" class="px-2 py-1">
      <RouterLink :to="{ name: 'dashboard' }" @click="popupStore.close" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
        <div class="flex items-center gap-2.5 py-2 text-sm">
          <LayoutDashboard class="size-4"/>
          数据概览
        </div>
        <ArrowRight class="size-4"/>
      </RouterLink>
    </div>
    <div class="my-1 border-t border-(--border)"></div>
    <!-- 主题切换 -->
    <div class="px-2 py-1">
      <a href="/" @click.prevent="switchTheme()" class="flex items-center justify-between rounded-md px-2 text-(--foreground) hover:bg-(--accent) hover:text-(--accent-foreground) transition-colors">
        <div class="flex items-center gap-2.5 py-2 text-sm">
          <SunMoon class="size-4"/>
          主题切换
        </div>
        <Sun v-if="themeStore.isSun" class="size-4"/>
        <Moon v-if="themeStore.isMoon" class="size-4"/>
      </a>
    </div>
    <div class="my-1 border-t border-(--border)"></div>
    <!-- 退出登录 -->
    <div class="px-2 pb-2 pt-1">
      <a href="/" @click.prevent="authStore.logout" class="flex items-center rounded-md px-2 text-(--destructive) hover:bg-(--destructive)/10 transition-colors">
        <div class="flex items-center gap-2.5 py-2 text-sm">
          <LogOut class="size-4"/>
          退出登录
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>

</style>