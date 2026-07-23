import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import axios from "axios";
import { useAuthStore } from "@/stores/auth.ts";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

//////////////////////////////////////////////////////////////
// Axios 配置
//////////////////////////////////////////////////////////////

axios.defaults.timeout = 5000

// 全局请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 获取 authStore
    const authStore = useAuthStore();
    // 如果已登录，自动附加 Authorization 头
    if (authStore.isLoggedIn) {
      // 添加 Authorization 头
      config.headers.Authorization = authStore.authorizationHeader;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// 全局响应拦截器
axios.interceptors.response.use(
  // onFulfilled
  (response) => {
    // 检查响应是否包含 JWT（即使为空字符串）
    if (response.data?.data?.jwt !== undefined) {
      const authStore = useAuthStore();
      authStore.setJwt(response.data.data.jwt); // 更新 JWT
    }
    // 返回响应
    return response;
  },
  // onRejected
  async (error) => {
    // 认证失败：通常由用户凭证已过期或越权访问产生。
    if (error.response?.status === 401) {
      // 重新认证
      const authStore = useAuthStore();
      // 越权访问在正常的设计流程中不应触发，因此在正常情况下，必然是由凭证过期引起，则必然跳转
      await authStore.pingOrRedirect();
      // 越权访问静默返回，而不是继续抛出
      return error.response;
    }
    // 网络错误
    error.response.data = {
      status: "NETWORK_ERROR",
      businessType: "",
      message: "网络错误",
      data: null
    };
    // 返回
    return error.response;
  }
);

//////////////////////////////////////////////////////////////
// 配置结束
//////////////////////////////////////////////////////////////

app.mount('#app')