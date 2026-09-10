<script setup lang="ts">
import { Mail, Calendar, BookOpen } from "@lucide/vue";
import { useUserStore } from "@/stores/user.ts";
import { computed, watch } from "vue";
import { DateTime } from "luxon";

const props = defineProps({
  userId: { type: Number, required: true },
})

const userStore = useUserStore();

const user = computed(() => userStore.user(props.userId).value);

watch(() => props.userId, () => {
  userStore.preload(props.userId);
});
</script>

<template>
  <template v-if="user">
    <!-- 用户基本信息 -->
    <div class="flex items-stretch gap-3">
      <img :src="`/avatars/${user.id}`" :alt="user.username" class="size-12 shrink-0 rounded-full border border-(--border) object-cover">
      <div class="min-w-0 flex-1 flex flex-col justify-center gap-1">
        <p class="truncate font-serif text-base font-semibold">{{ user.username }}</p>
        <div class="flex gap-2 text-xs text-(--muted-foreground)">
          <span>{{ user.role === 'ADMIN' ? '管理员' : '读者' }} #{{ user.id }}</span>
        </div>
      </div>
    </div>

    <!-- 详细信息 -->
    <div class="mt-3 flex flex-col gap-1.5 border-t border-(--border) pt-3 font-serif text-sm tracking-wide">
      <div class="flex items-center gap-2 text-(--muted-foreground)">
        <Mail class="size-3.5 shrink-0"/>
        <span class="truncate">{{ user.email }}</span>
      </div>
      <div class="flex items-center gap-2 text-(--muted-foreground)">
        <Calendar class="size-3.5 shrink-0"/>
        注册于 {{ DateTime.fromISO(user.create_time).toFormat('yyyy-MM-dd') }}
      </div>
      <div v-if="user.bio" class="flex items-start gap-2 text-(--muted-foreground)">
        <BookOpen class="size-3.5 mt-0.5 shrink-0"/>
        <span class="wrap-break-word">{{ user.bio }}</span>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="flex items-center justify-center py-8 text-sm text-(--muted-foreground)">加载中...</div>
  </template>
</template>

<style scoped>

</style>