<script setup lang="ts">
import { X, Mail, Calendar, BookOpen } from "@lucide/vue";
import { usePopupStore } from "@/stores/popup.ts";
import { useUserStore } from "@/stores/user.ts";
import { DateTime } from "luxon";
import { computed, onMounted, ref } from "vue";

const popupStore = usePopupStore();
const userStore = useUserStore();

const userId = ref(0);
const user = computed(() => userStore.user(userId.value).value);

onMounted(() => {
  popupStore.registerInitHook('userInfo', async ({ clone }) => {
    await userStore.preload(userId.value);
    userId.value = clone.id;
  });
});
</script>

<template>
  <div v-if="popupStore.isOpen('userInfo')" class="sm:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-(--border) bg-(--popover) pb-[env(safe-area-inset-bottom)] text-(--popover-foreground) shadow-2xl animate-in slide-in-from-bottom">
    <div class="flex items-center justify-center px-4 pt-3">
      <span class="h-1.5 w-10 rounded-full bg-(--border)"></span>
      <button @click="popupStore.close()" class="absolute right-3 top-3 rounded-md p-1.5 text-(--muted-foreground) hover:bg-(--accent)">
        <X class="size-5"/>
      </button>
    </div>
    <div class="pt-2 pb-10">
      <div v-if="user" class="px-4">
        <div class="flex items-center gap-3">
          <img :src="`/avatars/${user.id}`" :alt="user.username" class="size-12 shrink-0 rounded-full border border-(--border) object-cover">
          <div>
            <p class="font-serif text-base font-semibold">{{ user.username }}</p>
            <span class="text-xs text-(--muted-foreground)">{{ user.role === 'ADMIN' ? '管理员' : '读者' }}</span>
          </div>
        </div>
        <div class="mt-3 flex flex-col gap-1.5 border-t border-(--border) pt-3 text-sm">
          <div class="flex items-center gap-2 text-(--muted-foreground)">
            <Mail class="size-3.5"/>
            {{ user.email }}
          </div>
          <div class="flex items-center gap-2 text-(--muted-foreground)">
            <Calendar class="size-3.5"/>
            注册于 {{ DateTime.fromISO(user.create_time).toFormat('yyyy-MM-dd') }}
          </div>
          <div v-if="user.bio" class="flex items-start gap-2 text-(--muted-foreground)">
            <BookOpen class="size-3.5 mt-0.5"/>
            {{ user.bio }}
          </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center px-4 py-8 text-sm text-(--muted-foreground)">加载中...</div>
    </div>
  </div>
</template>

<style scoped>

</style>