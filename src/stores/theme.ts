import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

/**
 * <h3>Theme Store</h3>
 *
 * <ul>
 *   <li>管理主题信息</li>
 *   <li>提供主题切换接口</li>
 * </ul>
 */
export const useThemeStore = defineStore('theme', () => {

  // 从系统偏好初始化主题
  let isDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches);

  const isSun = computed(() => !isDark.value);

  const setSun = () => {
    isDark.value = false;
  }
  const setMoon = () => {
    isDark.value = true;
  }
  const toggle = () => {
    isDark.value = !isDark.value;
  }

  watch(isDark, (newValue) => {
    if (newValue)
      document.body.classList.add('dark')
    else
      document.body.classList.remove('dark')
  }, { immediate: true });

  return {
    isSun: isSun,
    isMoon: isDark,
    setSun,
    setMoon,
    toggle
  };

})
