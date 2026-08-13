<script setup lang="ts">
import { Send, LockKeyhole, UserRoundX } from "@lucide/vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/user.ts";
import { DateTime } from "luxon";
import SecurityCard from "@/components/security/SecurityCard.vue";

const userStore = useUserStore();

const resetPasswordInput = ref('')
</script>

<template>
  <main class="flex-1">
    <div class="mx-auto max-w-6xl flex flex-col px-4 md:px-8">
      <!-- 基础信息卡片 -->
      <SecurityCard title="您的基础信息">
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center">
            <p class="w-24">账号 ID</p>
            <p class="w-40">{{ userStore.user_id }}</p>
          </div>
          <div class="flex items-center">
            <p class="w-24">注册邮箱</p>
            <p class="w-40">{{ userStore.user_email }}</p>
          </div>
          <div class="flex items-center">
            <p class="w-24">注册时间</p>
            <p class="w-40">{{ DateTime.fromISO(userStore.user_create_time).toFormat("yyyy-MM-dd HH:mm:ss") }}</p>
          </div>
        </div>
      </SecurityCard>

      <!-- 重置密码卡片 -->
      <SecurityCard title="重置密码">
        <div class="w-full flex flex-col gap-4">
          <div class="flex flex-col px-4 py-2 gap-2 rounded text-(--muted-foreground) border border-(--border)">
            <p>重置密码后，您需要使用新密码重新登录。</p>
            <p>验证码将发送至您的注册邮箱（{{ userStore.user_email }}）。</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center py-1 border border-(--border) rounded text-sm">
              <p class="shrink-0 px-4">--</p>
              <p class="shrink-0 px-2 border-x border-(--border)">-</p>
              <input v-model="resetPasswordInput" type="text" placeholder="请输入验证码" class="w-full px-4 outline-none"/>
            </div>
            <button class="shrink-0 flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm bg-(--background) hover:bg-(--muted) transition-colors">
              <Send class="size-3"/>
              发送验证码
            </button>
          </div>
          <div>
            <button class="flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm bg-(--background) hover:bg-(--muted) transition-colors">
              <LockKeyhole class="size-3"/>
              重置密码
            </button>
          </div>
        </div>
      </SecurityCard>

      <!-- 注销账号卡片 -->
      <SecurityCard title="注销账号">
        <div class="w-full flex flex-col gap-4">
          <div class="flex flex-col px-4 py-2 gap-2 rounded text-(--destructive) border border-(--destructive)">
            <p>为保证账号安全，你提交的注销申请生效前需满足以下条件。</p>
            <ul class="list-decimal pl-8">
              <li>通过账号安全验证</li>
              <li>账号交易已完成</li>
            </ul>
            <p>注销账号后，您的所有个人数据（包括头像、昵称、个性签名等）将被永久删除，且无法恢复。</p>
            <p>此操作不可逆，请谨慎操作。</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center py-1 border border-(--border) rounded text-sm">
              <p class="shrink-0 px-4">--</p>
              <p class="shrink-0 px-2 border-x border-(--border)">-</p>
              <input v-model="resetPasswordInput" type="text" placeholder="请输入验证码" class="w-full px-4 outline-none"/>
            </div>
            <button class="shrink-0 flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm bg-(--background) hover:bg-(--muted) transition-colors">
              <Send class="size-3"/>
              发送验证码
            </button>
          </div>
          <div>
            <button class="flex items-center px-4 py-1 gap-2 border border-(--border) rounded text-sm text-(--destructive) bg-(--background) hover:bg-(--muted) transition-colors">
              <UserRoundX class="size-3"/>
              注销账号
            </button>
          </div>
        </div>
      </SecurityCard>
    </div>
  </main>
</template>

<style scoped>

</style>