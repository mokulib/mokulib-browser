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
  let isDark = ref(false);
  const isSun = computed(() => !isDark.value);

  const setSun = () => {
    isDark.value = false;
  }
  const setMoon = () => {
    isDark.value = true;
  }

  watch(isDark, (newValue) => {
    if (newValue)
      document.documentElement.classList.add('dark')
    else
      document.documentElement.classList.remove('dark')
  })

  return {
    isSun: isSun,
    isMoon: isDark,
    setSun,
    setMoon,
  };
})
