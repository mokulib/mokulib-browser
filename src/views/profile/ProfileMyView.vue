<script setup lang="ts">
import { useUserStore } from "@/stores/user.ts";

const userStore = useUserStore();
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 pt-12 md:px-8 md:pt-16">
    <div class="flex justify-between">
      <div class="flex">
        <img :src="userStore.user_avatar" alt="avatar" class="size-16">
        <div class="flex flex-col">
          <span>{{ userStore.user_username }}</span>
          <span>{{ userStore.user_email }}</span>
        </div>
      </div>
      <button>
        编辑资料
      </button>
    </div>
    <div>
      {{ userStore.user_bio ?? '暂无简介' }}
    </div>
  </div>
</template>

<style scoped>

</style>