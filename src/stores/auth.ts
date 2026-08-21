import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { JwtUser, Response } from "@/types";
import { useRoute, useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import api from "@/api";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { usePopupStore } from "@/stores/popup.ts";
import { Base64 } from "js-base64";

export const useAuthStore = defineStore('auth', () => {

  const route = useRoute();
  const router = useRouter();

  /////////////////////////////////////////////
  // 认证状态管理
  /////////////////////////////////////////////

  // 从 localStorage 初始化。初始化后，不得为 null 或 undefined
  const jwt = useLocalStorage('mk-jwt', '');
  // 对外暴露，缓存当前登录状态
  const isAuthed = computed(() => !!jwt.value);

  /////////////////////////////////////////////
  // 认证相关方法
  /////////////////////////////////////////////

  async function login(params: {}): Promise<Response<any>> {
    const data = await api.post("/api/auth/login", null, { params: params });
    if (data.status !== 'OK')
      jwt.value = "";
    return data;
  }

  async function logout() {
    // 技术登出
    jwt.value = "";
    // 关闭弹窗
    usePopupStore().close();
    // 根据路由配置决定是否跳转到首页
    if (route.meta.redirectToHomeOnLogout)
      await router.push({ name: 'home' });
  }

  async function syncJwtFromResponse(response: AxiosResponse) {
    // 检查响应是否包含 JWT（即使为空字符串）
    if (response.data?.data?.jwt !== undefined) {
      // 更新 JWT
      jwt.value = response.data.data.jwt;
      // 若新 JWT 为空字符串，则表示用户已登出
      if (jwt.value === "")
        await logout();
    }
  }

  function syncJwtToRequest(config: InternalAxiosRequestConfig) {
    // 如果已登录，自动附加 Authorization 头
    if (isAuthed.value)
      config.headers.Authorization = `Bearer ${jwt.value}`;
  }

  async function ping(): Promise<boolean> {
    // 如果 JWT 为空，无需验证，直接返回
    if (!jwt.value)
      return false;
    // 发送请求
    const isValid = (await api.get('/api/auth/ping')).status === 'OK';
    // 验证失败清除保存的 JWT
    if (!isValid)
      jwt.value = "";
    // 返回结果
    return isValid;
  }

  /////////////////////////////////////////////
  // 用户信息管理
  /////////////////////////////////////////////

  let id = ref<number>(-1);
  let email = ref<string>('');
  let role = ref<string>('');
  let username = ref<string>('');
  let bio = ref<string>('');
  let createTime = ref<string>('');
  // 常用状态
  let isUser = computed(() => role.value === 'USER');
  let isAdmin = computed(() => role.value === 'ADMIN');
  let roleName = computed(() => {
    switch (role.value) {
      case 'USER':
        return '读者';
      case 'ADMIN':
        return '管理员';
      default:
        return '游客';
    }
  });
  // 头像
  let avatarTimestamp = ref(Date.now()) // 用于强制刷新头像
  let avatar = computed(() => {
    return `/avatars/${id.value}?timestamp=${avatarTimestamp.value}`
  })

  /////////////////////////////////////////////
  // 监听
  /////////////////////////////////////////////

  watch(jwt, (token) => {
    if (token) {
      const encodePayload = token.split('.')[1] as string;
      const decodePayload = Base64.decode(encodePayload);
      const payload = JSON.parse(decodePayload);
      const user = JSON.parse(payload.user) as JwtUser;
      id.value = user.id
      email.value = user.email
      role.value = user.role
      username.value = user.username
      bio.value = user.bio
      createTime.value = user.create_time
    } else {
      id.value = -1;
      email.value = '';
      role.value = '';
      username.value = '';
      bio.value = '';
      createTime.value = '';
    }
  }, { immediate: true });

  return {
    jwt,
    isAuthed,
    login,
    logout,
    syncJwtFromResponse,
    syncJwtToRequest,
    ping,

    id,
    email,
    role,
    isUser,
    isAdmin,
    roleName,
    username,
    bio,
    createTime,
    avatarTimestamp,
    avatar,
  };

})