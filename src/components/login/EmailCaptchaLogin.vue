<script setup lang="ts">

import { ArrowLeft, RefreshCw } from "@lucide/vue";
</script>

<template>
  <form v-if="true" class="flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="email">邮箱</label>
      <input id="email" data-slot="input" placeholder="you@example.com" autocomplete="email" required class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40" type="email"></div>
    <div class="flex flex-col gap-2">
      <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="captcha">验证码</label>
      <div class="flex items-center gap-3">
        <input id="captcha" data-slot="input" inputmode="text" placeholder="请输入验证码" autocomplete="off" required class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 flex-1" type="text">
        <button type="button" aria-label="验证码 NPVY，点击刷新" title="点击刷新验证码" class="group relative shrink-0 overflow-hidden rounded-md border border-(--border) transition-opacity hover:opacity-90">
          <canvas width="120" height="30" class="block h-[30px] w-[120px]"></canvas>
        </button>
      </div>
      <button type="button" class="flex w-fit items-center gap-1 text-xs text-(--muted-foreground) transition-colors hover:text-(--primary)">
        <RefreshCw class="size-3"/>看不清？点击图片刷新
      </button>
    </div>
    <button type="submit" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 mt-1 w-full">下一步</button>
  </form>

  <form v-if="false" class="flex flex-col gap-5">
    <button type="button" class="flex w-fit items-center gap-1 text-sm text-(--muted-foreground) transition-colors hover:text-(--primary)">
      <ArrowLeft class="size-4"/>返回上一步
    </button>
    <div class="flex flex-col gap-2">
      <label data-slot="label" class="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" for="email-code">邮箱验证码</label>
      <div class="flex items-stretch">
        <span class="inline-flex select-none items-center rounded-l-md border border-r-0 border-(--border) bg-(--muted) px-3 font-mono text-sm font-semibold tracking-widest text-(--muted-foreground)" aria-label="验证码前缀 XB">XB</span>
        <input id="email-code" data-slot="input" inputmode="numeric" placeholder="请输入邮件中的验证码" autocomplete="one-time-code" required class="h-8 w-full min-w-0 rounded-lg border border-(--input) bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-(--foreground) placeholder:text-(--muted-foreground) focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-(--input)/50 disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 md:text-sm dark:bg-(--input)/30 dark:disabled:bg-(--input)/80 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 rounded-l-none" type="text">
      </div>
    </div>
    <button type="submit" tabindex="0" data-slot="button" class="group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-(--ring) focus-visible:ring-3 focus-visible:ring-(--ring)/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-(--destructive) aria-invalid:ring-3 aria-invalid:ring-(--destructive)/20 dark:aria-invalid:border-(--destructive)/50 dark:aria-invalid:ring-(--destructive)/40 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 bg-(--primary) text-(--primary-foreground) [a]:hover:bg-(--primary)/80 h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 mt-1 w-full">登录</button>
  </form>
</template>

<style scoped>

</style>