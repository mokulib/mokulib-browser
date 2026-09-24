<script setup lang="ts">
import { Landmark, ChevronUp, MapPin, Mail, Phone } from '@lucide/vue'
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const service = ref(false);
const address = ref(false);
const contact = ref(false);
</script>

<template>
  <div v-if="route.meta.simpleFooter !== true" class="lg:border-b border-(--border)">
    <div class="mx-auto max-w-6xl px-16 lg:px-8 pt-6 lg:pt-16 lg:pb-16 text-(--muted-foreground)">
      <div class="grid grid-cols-1 gap-3 lg:grid-cols-4 lg:gap-8">

        <!-- 品牌 -->
        <div class="hidden lg:flex items-start">
          <div class="flex items-center gap-2">
            <Landmark class="size-8 shrink-0 text-(--primary)" />
            <p class="font-serif text-2xl font-semibold text-(--foreground)">墨库</p>
          </div>
        </div>

        <!-- 服务 -->
        <div class="flex flex-col pb-3 lg:pb-0 gap-3 border-b lg:border-none border-(--border)">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-sm lg:text-lg tracking-wider text-(--foreground) uppercase">服务</p>
            <ChevronUp class="lg:hidden size-5" :class="!service ? 'rotate-180' : ''" @click="service = !service" />
          </div>
          <div :data-open="service" class="hidden data-[open=true]:flex lg:flex flex-col gap-3">
            <RouterLink :to="{ name: 'terms' }" class="text-sm transition-colors hover:text-(--primary)">用户协议</RouterLink>
            <RouterLink :to="{ name: 'privacy' }" class="text-sm transition-colors hover:text-(--primary)">隐私政策</RouterLink>
          </div>
        </div>

        <!-- 地址 -->
        <div class="flex flex-col pb-3 lg:pb-0 gap-3 border-b lg:border-none border-(--border)">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-sm lg:text-lg tracking-wider text-(--foreground) uppercase">地址</p>
            <ChevronUp class="lg:hidden size-5" :class="!address ? 'rotate-180' : ''" @click="address = !address" />
          </div>
          <div :data-open="address" class="hidden data-[open=true]:flex lg:flex items-start gap-2.5">
            <MapPin class="mt-0.5 size-4 shrink-0 text-(--primary)" />
            <address class="not-italic text-sm leading-relaxed">
              测试省测试市测试区测试路1号测试楼2层
            </address>
          </div>
        </div>

        <!-- 联系我们 -->
        <div class="flex flex-col pb-3 lg:pb-0 gap-3 border-b lg:border-none border-(--border)">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-sm lg:text-lg tracking-wider text-(--foreground) uppercase">联系我们</p>
            <ChevronUp class="lg:hidden size-5" :class="!contact ? 'rotate-180' : ''" @click="contact = !contact" />
          </div>
          <div :data-open="contact" class="hidden data-[open=true]:flex lg:flex flex-col gap-2.5 text-sm">
            <a
              href="mailto:admin@moku.com"
              class="flex items-center gap-2.5 transition-colors hover:text-(--primary)"
            >
              <Mail class="size-4 shrink-0 text-(--primary)" />
              <span>admin@moku.com</span>
            </a>
            <a
              href="tel:+8612345678901"
              class="flex items-center gap-2.5 transition-colors hover:text-(--primary)"
            >
              <Phone class="size-4 shrink-0 text-(--primary)" />
              <span>+86 12345678901</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 底部版权与链接 -->
  <div class="mx-auto max-w-6xl flex flex-col lg:flex-row items-center justify-center px-16 lg:px-8 py-12 lg:py-4 gap-2 border-(--border) text-xs text-(--muted-foreground)">
    <div class="flex items-center gap-2">
      <p>© 2026 墨库</p>
      <div class="flex items-center">
        <img src="/icp.png" class="size-4" alt="ICP备案号"/>
        <p>测公安网备 12345678901234号</p>
      </div>
    </div>
    <p>测ICP备 1234567890号</p>
  </div>
</template>