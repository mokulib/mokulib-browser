<script setup lang="ts">
import InformationCard from "@/components/security/InformationCard.vue";
import ResetPasswordCard from "@/components/security/ResetPasswordCard.vue";
import CloseAccountCard from "@/components/security/CloseAccountCard.vue";
</script>

<template>
  <main class="flex-1">
    <div class="mx-auto max-w-6xl flex flex-col px-4 md:px-8">
      <!-- 基础信息卡片 -->
      <InformationCard/>
      <!-- 重置密码卡片 -->
      <ResetPasswordCard/>
      <!-- 注销账号卡片 -->
      <CloseAccountCard/>
    </div>
  </main>
</template>

<style scoped>

</style>