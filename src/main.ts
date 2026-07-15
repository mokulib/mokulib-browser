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

axios.defaults.baseURL = 'http://192.168.1.110:8080'
axios.defaults.timeout = 5000

// 全局响应拦截器
axios.interceptors.response.use(
  // onFulfilled
  (response) => {

    // 检查响应是否包含 JWT（即使为空字符串）
    if (response.data?.data?.jwt !== undefined) {
      const authStore = useAuthStore();
      authStore.setJwt(response.data.data.jwt); // 更新 JWT
    }

    return response;
  },
  // onRejected
  (error) => {
    return Promise.reject(error);
  }
);

//////////////////////////////////////////////////////////////
// 配置结束
//////////////////////////////////////////////////////////////

app.mount('#app')