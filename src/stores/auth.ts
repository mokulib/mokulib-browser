import { defineStore } from "pinia";
import { computed, watch } from "vue";
import type { Response } from "@/types";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.ts";
import { useLocalStorage } from "@vueuse/core";
import api from "@/api";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { usePopupStore } from "@/stores/popup.ts";

export const useAuthStore = defineStore('auth', () => {

  const route = useRoute();
  const router = useRouter();

  /////////////////////////////////////////////
  // 认证状态管理
  /////////////////////////////////////////////

  // 从 localStorage 初始化。初始化后，不得为 null 或 undefined
  const jwt = useLocalStorage('mk-jwt', '');
  // 对外暴露，缓存当前登录状态
  const isLoggedIn = computed(() => !!jwt.value);

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
    if (isLoggedIn.value)
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
  // 监听
  /////////////////////////////////////////////

  watch(jwt, (newJwt) => {
    useUserStore().updateUserInfo(newJwt);
  }, { immediate: true });

  return {
    jwt,
    isLoggedIn,
    login,
    logout,
    syncJwtFromResponse,
    syncJwtToRequest,
    ping,
  };

})