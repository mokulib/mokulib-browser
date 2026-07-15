import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * <h3>Header Store</h3>
 *
 * <ul>
 *   <li>管理头部信息</li>
 *   <li>提供头部状态</li>
 * </ul>
 */
export const useHeaderStore = defineStore('header', () => {
  let isExpanded = ref(false);

  function openMenu() {
    isExpanded.value = true;
  }

  function closeMenu() {
    isExpanded.value = false;
  }

  function toggleExpanded() {
    isExpanded.value = !isExpanded.value;
  }

  return {
    isExpanded,
    openMenu,
    closeMenu,
    toggleExpanded
  };
});