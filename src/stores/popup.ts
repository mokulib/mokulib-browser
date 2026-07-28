import { defineStore } from "pinia";
import { ref } from "vue";
import type { Book, Category, Response, Tag } from "@/types";

/**
 * 定义弹窗的 Key 和 payload 类型
 */
export interface PopupMap {
  uploadBookImage:         { id: number; };
  editCategory:            { book: Book; category: Category; };
  editBook:                { book: Book; };
  addTag:                  { id: number; tags: Tag[]; };
  addBookCopy:             { id: number; };
  editBookCopy:            { bookCopyId: number; purchasePrice: number; purchaseDate: string; source: string };
  borrow:                  { id: number; };
  returnBook:              { id: number; };
  deleteBookReviewConfirm: { user_name: string; };
  header:                  undefined;
}

// 自动提取 PopupKey 类型
export type PopupKey = keyof PopupMap;

// 工具类型：根据 PopupKey 获取对应的 payload 类型
export type PopupPayload<K extends PopupKey> = PopupMap[K];

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
  // 存储当前打开的弹窗名称，若没有弹窗处于打开状态，存储 undefined
  const popups = ref<PopupKey | undefined>(undefined);
  // 存储调用者发给弹窗的附加数据
  const payload = ref<any>(undefined);
  // 存储回调函数
  // 注意，推荐的 confirm 处理流程是：
  // 在弹窗中点击 confirm 后，如果需要提交表单，应在弹窗组件中进行处理，不要把表单数据通过此回调函数发回调用者让调用者处理，在弹窗组件中处理完毕后，可以通过此回调函数向调用者发回表单提交结果，进行更进一步处理
  const callback = ref<((data: Response<any>) => void) | undefined>();

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
   * @param args 弹窗数据
   */
  function open<K extends PopupKey>(
    key: K,
    ...args: PopupPayload<K> extends undefined
      ? [payload_?: undefined, callback_?: (data: Response<any>) => void]
      : [payload_: PopupPayload<K>, callback_?: (data: Response<any>) => void]
  ): void {
    const [payload_, callback_] = args;
    popups.value = key;
    payload.value = payload_;
    callback.value = callback_;
  }

  /**
   * 关闭弹窗
   */
  function close(data?: Response<any>) {
    popups.value = undefined;
    // 如果回调函数存在（基本要求），且返回数据存在（返回数据不存在，代表调用者无需关心，通常意味着用户点击弹窗内的取消或者 X 按钮；返回数据存在，代表调用者需要处理，通常意味着用户点击弹窗内的 confirm 按钮），则调用
    if (callback.value && data)
      callback.value(data);
  }

  /**
   * 切换弹窗状态
   * @param key 弹窗名称
   * @param args 弹窗数据
   */
  function toggle<K extends PopupKey>(
    key: K,
    ...args: PopupPayload<K> extends undefined ? [] : [payload_: PopupPayload<K>]
  ): void {
    if (isOpen(key))
      close();
    else {
      const [payload_] = args;
      open(key, payload_ as any);
    }
  }

  /**
   * 获取经过深拷贝的 payload，类型安全
   */
  function safePayload<K extends PopupKey>(): PopupPayload<K> {
    return JSON.parse(JSON.stringify(payload.value)) as PopupPayload<K>;
  }

  return {
    popups,
    payload,
    isOpen,
    open,
    close,
    toggle,
    safePayload,
  };
});
