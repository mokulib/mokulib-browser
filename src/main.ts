import './assets/main.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import axios from "axios";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')

//////////////////////////////////////////////////////////////
// Axios 配置
//////////////////////////////////////////////////////////////

axios.defaults.baseURL = 'http://192.168.1.110:8080'
axios.defaults.timeout = 5000
