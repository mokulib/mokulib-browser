<script setup lang="ts">

import { Library, BookOpenCheck, Sparkles, ArrowRight, Target, CalendarClock } from "@lucide/vue";
</script>

<template>
  <main>
    <section class="mx-auto max-w-6xl px-4 pb-4 pt-12 md:px-8 md:pt-16">
      <p class="text-sm tracking-[0.2em] text-(--muted-foreground)">
        晚上好，读者
      </p>
      <h1 class="mt-3 max-w-2xl text-balance font-serif text-4xl font-medium leading-tight md:text-6xl">
        欢迎来到我的
        <br>
        个人图书馆
      </h1>
      <p class="mt-4 max-w-lg text-pretty leading-relaxed text-(--muted-foreground)">
        今天想读点什么？从你正在读的书继续，或从书架上寻一本素未谋面的新友。
      </p>

      <dl class="mt-10 grid grid-cols-3 gap-4 border-t border-(--border) pt-8">
        <div class="flex flex-col gap-2">
          <Library class="size-5 text-(--primary)"/>
          <dd class="font-serif text-3xl font-medium md:text-4xl">342</dd>
          <dt class="text-xs uppercase tracking-wider text-(--muted-foreground)">藏书总数</dt>
        </div>
        <div class="flex flex-col gap-2">
          <BookOpenCheck class="size-5 text-(--primary)"/>
          <dd class="font-serif text-3xl font-medium md:text-4xl">168</dd>
          <dt class="text-xs uppercase tracking-wider text-(--muted-foreground)">已读完</dt>
        </div>
        <div class="flex flex-col gap-2">
          <Sparkles class="size-5 text-(--primary)"/>
          <dd class="font-serif text-3xl font-medium md:text-4xl">37/52</dd>
          <dt class="text-xs uppercase tracking-wider text-(--muted-foreground)">今年目标</dt>
        </div>
      </dl>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 md:px-8">

      <div class="mb-6 flex items-end justify-between">
        <div>
          <h2 class="font-serif text-2xl font-medium md:text-3xl">继续阅读</h2>
          <p class="mt-1 text-sm text-(--muted-foreground)">你手边正翻开的 <!-- -->3<!-- --> 本书</p>
        </div>
        <a href="#" class="hidden items-center gap-1 text-sm text-(--muted-foreground) transition-colors hover:text-(--primary) sm:flex">
          查看全部
          <ArrowRight class="size-4" aria-hidden="true"/>
        </a>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <article class="group flex gap-4 rounded-lg border border-(--border) bg-(--card) p-4 transition-colors hover:border-(--primary)/40">
          <div class="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-sm shadow-sm">
            <img alt="《百年孤独》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-1.png">
          </div>
          <div class="flex min-w-0 flex-1 flex-col">
            <span class="text-xs uppercase tracking-wider text-(--primary)">文学小说</span>
            <h3 class="mt-1 truncate font-serif text-lg font-medium">百年孤独</h3>
            <p class="truncate text-sm text-(--muted-foreground)">加西亚·马尔克斯</p>
            <div class="mt-auto pt-4">
              <div class="mb-1.5 flex items-center justify-between text-xs">
                <span class="flex items-center gap-1 text-(--muted-foreground)">
                  <CalendarClock class="size-3.5"/>
                  应还 <!-- -->7月18日
                </span>
                <span class="font-medium text-(--foreground)">剩 <!-- -->5<!-- --> 天</span>
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-(--muted)" role="progressbar" aria-valuenow="29" aria-valuemin="0" aria-valuemax="100" aria-label="《百年孤独》归还进度">
                <div class="h-full rounded-full bg-(--primary)" style="width:29%"></div>
              </div>
            </div>
          </div>
        </article>
        <article class="group flex gap-4 rounded-lg border border-(--border) bg-(--card) p-4 transition-colors hover:border-(--primary)/40">
          <div class="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-sm shadow-sm">
            <img alt="《人类简史》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-4.png"></div>
          <div class="flex min-w-0 flex-1 flex-col">
            <span class="text-xs uppercase tracking-wider text-(--primary)">历史</span>
            <h3 class="mt-1 truncate font-serif text-lg font-medium">人类简史</h3>
            <p class="truncate text-sm text-(--muted-foreground)">尤瓦尔·赫拉利</p>
            <div class="mt-auto pt-4">
              <div class="mb-1.5 flex items-center justify-between text-xs">
                <span class="flex items-center gap-1 text-(--muted-foreground)">
                  <CalendarClock class="size-3.5"/>
                  应还 <!-- -->7月14日
                </span>
                <span class="font-medium text-(--foreground)">剩 <!-- -->3<!-- --> 天</span>
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-(--muted)" role="progressbar" aria-valuenow="29" aria-valuemin="0" aria-valuemax="100" aria-label="《百年孤独》归还进度">
                <div class="h-full rounded-full bg-(--primary)" style="width:29%"></div>
              </div>
            </div>
          </div>
        </article>
        <article class="group flex gap-4 rounded-lg border border-(--border) bg-(--card) p-4 transition-colors hover:border-(--primary)/40">
          <div class="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-sm shadow-sm">
            <img alt="《被讨厌的勇气》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-6.png">
          </div>
          <div class="flex min-w-0 flex-1 flex-col">
            <span class="text-xs uppercase tracking-wider text-(--primary)">哲学</span>
            <h3 class="mt-1 truncate font-serif text-lg font-medium">被讨厌的勇气</h3>
            <p class="truncate text-sm text-(--muted-foreground)">岸见一郎</p>
            <div class="mt-auto pt-4">
              <div class="mb-1.5 flex items-center justify-between text-xs">
                <span class="flex items-center gap-1 text-(--muted-foreground)">
                  <CalendarClock class="size-3.5"/>
                  应还 <!-- -->7月12日
                </span>
                <span class="font-medium text-(--destructive)">剩 <!-- -->1<!-- --> 天</span>
              </div>
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-(--muted)" role="progressbar" aria-valuenow="29" aria-valuemin="0" aria-valuemax="100" aria-label="《百年孤独》归还进度">
                <div class="h-full rounded-full bg-(--destructive)" style="width:29%"></div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <div class="flex flex-col gap-16">
        <div>
          <div class="mb-6 flex items-end justify-between border-b border-(--border) pb-4">
            <div>
              <h2 class="font-serif text-2xl font-medium md:text-3xl">文学与小说</h2>
              <p class="mt-1 text-sm text-(--muted-foreground)">那些让人辗转反侧的故事</p>
            </div>
            <a href="#" class="hidden items-center gap-1 text-sm text-(--muted-foreground) transition-colors hover:text-(--primary) sm:flex">
              查看全部
              <ArrowRight class="size-4"/>
            </a>
          </div>
          <div class="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            <article class="group">
              <div class="relative aspect-2/3 overflow-hidden rounded-md shadow-sm ring-1 ring-(--border) transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <img alt="《挪威的森林》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-1.png">
              </div>
              <h3 class="mt-3 truncate font-serif text-base font-medium">挪威的森林</h3>
              <p class="truncate text-sm text-(--muted-foreground)">村上春树</p>
            </article>
            <article class="group">
              <div class="relative aspect-2/3 overflow-hidden rounded-md shadow-sm ring-1 ring-(--border) transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <img alt="《小径分岔的花园》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-2.png">
              </div>
              <h3 class="mt-3 truncate font-serif text-base font-medium">小径分岔的花园</h3>
              <p class="truncate text-sm text-(--muted-foreground)">博尔赫斯</p>
            </article>
            <article class="group">
              <div class="relative aspect-2/3 overflow-hidden rounded-md shadow-sm ring-1 ring-(--border) transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <img alt="《岛上书店》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-5.png">
              </div>
              <h3 class="mt-3 truncate font-serif text-base font-medium">岛上书店</h3>
              <p class="truncate text-sm text-(--muted-foreground)">加·泽文</p>
            </article>
            <article class="group">
              <div class="relative aspect-2/3 overflow-hidden rounded-md shadow-sm ring-1 ring-(--border) transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <img alt="《献给阿尔吉侬的花束》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-3.png">
              </div>
              <h3 class="mt-3 truncate font-serif text-base font-medium">献给阿尔吉侬的花束</h3>
              <p class="truncate text-sm text-(--muted-foreground)">丹尼尔·凯斯</p>
            </article>
          </div>
        </div>
        <div>
          <div class="mb-6 flex items-end justify-between border-b border-(--border) pb-4">
            <div>
              <h2 class="font-serif text-2xl font-medium md:text-3xl">思想与哲学</h2>
              <p class="mt-1 text-sm text-(--muted-foreground)">在纸页之间叩问世界</p>
            </div>
            <a href="#" class="hidden items-center gap-1 text-sm text-(--muted-foreground) transition-colors hover:text-(--primary) sm:flex">
              查看全部
              <ArrowRight class="size-4"/>
            </a>
          </div>
          <div class="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            <article class="group">
              <div class="relative aspect-2/3 overflow-hidden rounded-md shadow-sm ring-1 ring-(--border) transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <img alt="《沉思录》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-6.png">
              </div>
              <h3 class="mt-3 truncate font-serif text-base font-medium">沉思录</h3>
              <p class="truncate text-sm text-(--muted-foreground)">马可·奥勒留</p>
            </article>
            <article class="group">
              <div class="relative aspect-2/3 overflow-hidden rounded-md shadow-sm ring-1 ring-(--border) transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <img alt="《西方哲学史》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-4.png">
              </div>
              <h3 class="mt-3 truncate font-serif text-base font-medium">西方哲学史</h3>
              <p class="truncate text-sm text-(--muted-foreground)">罗素</p>
            </article>
            <article class="group">
              <div class="relative aspect-2/3 overflow-hidden rounded-md shadow-sm ring-1 ring-(--border) transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <img alt="《存在与虚无》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-2.png">
              </div>
              <h3 class="mt-3 truncate font-serif text-base font-medium">存在与虚无</h3>
              <p class="truncate text-sm text-(--muted-foreground)">萨特</p>
            </article>
            <article class="group">
              <div class="relative aspect-2/3 overflow-hidden rounded-md shadow-sm ring-1 ring-(--border) transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <img alt="《瓦尔登湖》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-3.png">
              </div>
              <h3 class="mt-3 truncate font-serif text-base font-medium">瓦尔登湖</h3>
              <p class="truncate text-sm text-(--muted-foreground)">梭罗</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto grid max-w-6xl gap-12 px-4 py-12 md:grid-cols-5 md:px-8">
      <div class="md:col-span-3">
        <h2 class="mb-6 font-serif text-2xl font-medium md:text-3xl">心愿单</h2>
        <ul class="flex flex-col divide-y divide-(--border)">
          <li class="flex items-center gap-4 py-4">
            <div class="relative aspect-2/3 w-12 shrink-0 overflow-hidden rounded-sm ring-1 ring-(--border)">
              <img alt="《夜晚的潜水艇》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-3.png">
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="truncate font-serif text-(--base) font-medium">夜晚的潜水艇</h3>
              <p class="truncate text-sm text-(--muted-foreground)">陈春成</p>
            </div>
            <span class="rounded-full bg-(--secondary) px-3 py-1 text-xs text-(--secondary-foreground)">文学小说</span>
          </li>
          <li class="flex items-center gap-4 py-4">
            <div class="relative aspect-2/3 w-12 shrink-0 overflow-hidden rounded-sm ring-1 ring-(--border)">
              <img alt="《枪炮、病菌与钢铁》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-4.png">
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="truncate font-serif text-(--base) font-medium">枪炮、病菌与钢铁</h3>
              <p class="truncate text-sm text-(--muted-foreground)">贾雷德·戴蒙德</p>
            </div>
            <span class="rounded-full bg-(--secondary) px-3 py-1 text-xs text-(--secondary-foreground)">历史</span>
          </li>
          <li class="flex items-center gap-4 py-4">
            <div class="relative aspect-2/3 w-12 shrink-0 overflow-hidden rounded-sm ring-1 ring-(--border)">
              <img alt="《诗的八堂课》封面" loading="lazy" decoding="async" data-nimg="fill" class="object-cover" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" src="@/assets/cover-3.png">
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="truncate font-serif text-(--base) font-medium">诗的八堂课</h3>
              <p class="truncate text-sm text-(--muted-foreground)">江弱水</p>
            </div>
            <span class="rounded-full bg-(--secondary) px-3 py-1 text-xs text-(--secondary-foreground)">诗歌</span>
          </li>
        </ul>
      </div>
      <div class="md:col-span-2">
        <div class="rounded-lg border border-(--border) bg-(--card) p-6">
          <div class="flex items-center gap-2 text-(--primary)">
            <Target class="size-5" aria-hidden="true"/>
            <h2 class="font-serif text-xl font-medium">2026<!-- --> 年阅读挑战</h2>
          </div>
          <p class="mt-4 font-serif text-5xl font-medium">
            37
            <span class="text-2xl text-(--muted-foreground)"> / <!-- -->52<!-- --> 本</span>
          </p>
          <div class="mt-5 h-2 w-full overflow-hidden rounded-full bg-(--muted)" role="progressbar" aria-valuenow="71" aria-valuemin="0" aria-valuemax="100" aria-label="年度阅读挑战进度">
            <div class="h-full rounded-full bg-(--primary)" style="width:71%"></div>
          </div>
          <p class="mt-4 text-sm leading-relaxed text-(--muted-foreground)">
            已完成年度目标的 <!-- -->71<!-- -->%，保持这个节奏，你会在年底前轻松达成。再读 <!-- -->15<!-- --> 本即可。
          </p>
        </div>
      </div>
    </section>
  </main>
</template>
