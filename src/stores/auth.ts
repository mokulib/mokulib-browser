import { defineStore } from "pinia";
import { computed, watch } from "vue";
import type { Response } from "@/types";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.ts";
import { useLocalStorage } from "@vueuse/core";
import api from "@/api";

/**
 * <h3>Auth Store</h3>
 *
 * <ul>
 *   <li>管理用户的 JWT</li>
 *   <li>基于 JWT 提供当前是否登录的状态</li>
 *   <li>提供登录、登出、验证等功能</li>
 *   <li>监听 JWT 变化，更新用户信息</li>
 * </ul>
 */
export const useAuthStore = defineStore('auth', () => {

  /////////////////////////////////////////////
  // JWT 管理
  /////////////////////////////////////////////

  // 从 localStorage 初始化。初始化后，不得为 null 或 undefined
  const jwt = useLocalStorage('mk-jwt', '');
  // 用于构造 Authorization Header
  const authorizationHeader = computed(() => `Bearer ${jwt.value}`);
  // 对外暴露，缓存当前登录状态
  const isLoggedIn = computed(() => !!jwt.value);

  function getJwt(): string {
    return jwt.value;
  }

  function setJwt(token: string) {
    jwt.value = token;
  }

  function clearJwt() {
    setJwt("");
  }

  const route = useRoute();
  const router = useRouter();

  function logout() {
    // 技术登出
    clearJwt();
    // 跳转到首页
    if (route.meta.redirectToHomeOnLogout)
      router.push({ name: 'home' });
  }

  /////////////////////////////////////////////
  // 用户认证相关方法
  /////////////////////////////////////////////

  // 登录
  async function login(params: {}): Promise<Response<any>> {
    const data = await api.post("/api/auth/login", null, { params: params });
    if (data.status !== 'OK')
      clearJwt();
    return data;
  }

  // 验证 JWT 是否有效
  async function ping(): Promise<boolean> {
    if (!jwt.value) // 如果 JWT 为空，无需验证，直接返回
      return false;

    // 发送请求
    const isValid = (await api.get('/api/auth/ping')).status === 'OK';

    // 验证失败清除保存的 JWT
    if (!isValid)
      clearJwt();

    // 返回结果
    return isValid;
  }

  // 验证 JWT 是否有效，如果无效则跳转到登录页面
  async function pingOrRedirect() {
    if (await ping())
      return true

    // 如果无效则跳转到登录页面
    await router.push({ name: 'login' });
    return false;
  }

  /////////////////////////////////////////////
  // 监听
  /////////////////////////////////////////////

  watch(jwt, (newJwt) => {
    useUserStore().updateUserInfo(newJwt);
  }, { immediate: true });

  return {
    jwt,
    authorizationHeader,
    isLoggedIn,
    getJwt,
    setJwt,
    clearJwt,
    login,
    logout,
    ping,
    pingOrRedirect
  };

})