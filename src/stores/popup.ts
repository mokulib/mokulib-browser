import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * <h3>Popup Store</h3>
 *
 * <ul>
 *   <li>保存弹窗状态</li>
 *   <li>提供判断弹窗是否打开的方法</li>
 *   <li>提供弹窗打开、关闭、切换状态的方法</li>
 *   <li>提供弹窗名称的常量</li>
 * </ul>
 */
export const usePopupStore = defineStore('popup', () => {
  const popups = ref<PopupKey | undefined>(undefined);
  const payload = ref<any>(undefined);

  /**
   * 判断弹窗是否打开，如果没有指定弹窗名称，则判断是否有任一弹窗正处于打开状态
   * @param key 弹窗名称
   */
  function isOpen(key?: PopupKey): boolean {
    if (key === undefined)
      return popups.value !== undefined
    else
      return popups.value === key;
  }

  /**
   * 打开弹窗，并关闭所有其他弹窗
   * @param key 弹窗名称
   * @param data 弹窗数据
   */
  function open(key: PopupKey, data?: any) {
    popups.value = key;
    payload.value = data;
  }

  /**
   * 关闭弹窗
   */
  function close() {
    popups.value = undefined;
  }

  /**
   * 切换弹窗状态
   * @param key 弹窗名称
   * @param data 弹窗数据
   */
  function toggle(key: PopupKey, data?: any) {
    if (isOpen(key))
      close();
    else
      open(key, data);
  }

  return {
    popups,
    payload,
    isOpen,
    open,
    close,
    toggle
  };
});

export type PopupKey =
  "header" |
  "deleteBookReviewConfirm" |
  ;
