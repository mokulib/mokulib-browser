# MokuLib Browser Setup

## Environment

- Node.js 24.15.0
- Pnpm 11.10.0

## Setup

创建 vue 项目：`pnpm create vue@latest`

```text
T  Vue.js - The Progressive JavaScript Framework
|
o  请输入项目名称：
|  mokulib-browser
|
o  是否使用 TypeScript 语法？
|  Yes
|
o  请选择要包含的功能： (↑/↓ 切换，空格选择，a 全选，回车确认)
|  Router（单页面应用开发）, Pinia（状态管理）
|
o  选择要包含的试验特性： (↑/↓ 切换，空格选择，a 全选，回车确认)
|  none
|
o  跳过所有示例代码，创建一个空白的 Vue 项目？
|  No

正在初始化项目 F:\Long\自考\毕业设计\mokulib\mokulib-browser...
|
—  项目初始化完成，可执行以下命令：

   cd mokulib-browser
   pnpm install
   pnpm dev

| 可选：使用以下命令在项目目录中初始化 Git：

   git init && git add -A && git commit -m "initial commit"
```

安装包：`pnpm install`

```test
Progress: resolved 229, reused 0, downloaded 204, added 198, done

dependencies:
+ pinia 3.0.4
+ vue 3.5.39
+ vue-router 5.1.0

devDependencies:
+ @tsconfig/node24 24.0.4
+ @types/node 24.13.3 (26.1.1 is available)
+ @vitejs/plugin-vue 6.0.7
+ @vue/tsconfig 0.9.1
+ npm-run-all2 9.0.2
+ typescript 6.0.3 (7.0.2 is available)
+ vite 8.1.3 (8.1.4 is available)
+ vite-plugin-vue-devtools 8.1.5
+ vue-tsc 3.3.7

Done in 57.9s using pnpm v11.10.0
```

运行开发服务器：`pnpm dev`

## Configure

项目初次创建完成后，默认 package.json 如下。

```json
{
  "name": "mokulib-browser",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check \"build-only {@}\" --",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --build"
  },
  "dependencies": {
    "pinia": "^3.0.4",
    "vue": "^3.5.38",
    "vue-router": "^5.1.0"
  },
  "devDependencies": {
    "@tsconfig/node24": "^24.0.4",
    "@types/node": "^24.13.2",
    "@vitejs/plugin-vue": "^6.0.7",
    "@vue/tsconfig": "^0.9.1",
    "npm-run-all2": "^9.0.2",
    "typescript": "~6.0.0",
    "vite": "^8.0.16",
    "vite-plugin-vue-devtools": "^8.1.2",
    "vue-tsc": "^3.3.5"
  },
  "engines": {
    "node": "^22.18.0 || >=24.12.0"
  }
}
```

以下是需要额外安装的库/包。

- [ ] `pnpm add @element-plus/icons-vue`
- [ ] `pnpm add @vueuse/core`
- [x] `pnpm add axios`
- [x] `pnpm add element-plus`
- [x] `pnpm add js-base64`
- [x] `pnpm install tailwindcss @tailwindcss/vite`