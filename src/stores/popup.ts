import { defineStore } from "pinia";
import { type Ref, ref } from "vue";
import type { Book, BookCopyAdmin, Category, Response, Tag } from "@/types";

/**
 * ### PopupMap
 *
 * 定义弹窗的键、负载类型，以及返回数据类型。
 *
 * #### 类型设计说明（响应式兼容）
 *
 * Vue 3 的响应式系统会自动处理含响应式类型的对象：
 * 1. 当 `payload.value` 被赋值一个普通对象 `{ ... }` 时，Vue 内部会调用 `reactive()` 转换该对象
 * 2. `reactive()` 会自动将内部的 `ref` 类型属性解包
 *
 * 这导致同一个 payload 在**传入前后**类型不一致：
 * - **传入时**（payloadIn）：如果需要传递响应式参数，可能传递 `{ Ref<number> }`
 * - **取出时**（payloadOut）：`payload.value` 已被转换为 `Reactive` 类型，其内部属性已被解包为 `number`
 *
 * 需要注意的是，`reactive()` 不会将内部嵌套的 `Ref` 类型的属性解包：`{ x: { Ref<number> } }` 其中的 `Ref` 不会被解包。
 */
export interface PopupMap {
  uploadBookCover: {
    payload: { id: number; };
    response: Response<any>;
  };
  editCategory: {
    payload: { book: Book; category: Category; };
    response: Response<Book>;
  };
  editBook: {
    payload: { book: Book; };
    response: Response<Book>;
  };
  addTag: {
    payload: { id: number; tags: Tag[]; };
    response: Response<undefined>;
  };
  addBookCopy: {
    payload: { id: number; };
    response: Response<BookCopyAdmin>;
  };
  editBookCopy: {
    payload: { bookCopyId: number; purchasePrice: number; purchaseDate: string; source: string; };
    response: Response<BookCopyAdmin>;
  };
  borrow: {
    payload: { id: number; };
    response: Response<BookCopyAdmin>;
  };
  withdrawn: {
    payload: { id: number; };
    response: Response<BookCopyAdmin>;
  }
  returnBook: {
    payload: { id: number; };
    response: Response<BookCopyAdmin>;
  };
  relist: {
    payload: { id: number; };
    response: Response<BookCopyAdmin>;
  }
  deleteBookReviewConfirm: {
    payload: { user_name: string; };
    response: void;
  };
  header: {
    payload: { top: Ref<number>; right: Ref<number>; height: Ref<number>; };
    response: void;
  };
}

// 提取 PopupKey 类型
export type PopupKey = keyof PopupMap;

// 入参类型：根据 PopupKey 获取对应的 payloadIn 类型
export type PopupPayloadIn<K extends PopupKey> = PopupMap[K]['payload'];

// 工具类型：解包响应式
type UnwrapRef<T> = T extends Ref<infer V> ? V : T extends object ? { [K in keyof T]: UnwrapRef<T[K]> } : T;

// 出参类型：根据 PopupKey 以及 UnwarpRef 计算对应的 payloadOut 类型
export type PopupPayloadOut<K extends PopupKey> = UnwrapRef<PopupPayloadIn<K>>

// 响应类型：根据 PopupKey 获取对应的 response 类型
export type PopupResponse<K extends PopupKey> = PopupMap[K]['response'];

/**
 * ### Popup Store
 * - 提供完整的类型定义
 * - 保存弹窗状态
 * - 提供判断弹窗是否打开的方法
 * - 提供弹窗打开、关闭、切换状态的方法
 * - 提供获取经过深拷贝的 safePayload 工具方法
 */
export const usePopupStore = defineStore('popup', () => {
  // 存储当前打开的弹窗 Key，若没有弹窗处于打开状态，存储 undefined
  const popups = ref<PopupKey | undefined>(undefined);
  // 存储调用者发给弹窗的负载
  const payload = ref<any>(undefined);
  // 存储初始化函数映射
  const initHooks = new Map<PopupKey, ((payload: any) => void)[]>();
  // 存储回调函数
  // 注意，推荐的 confirm 处理流程是：
  // 在弹窗中点击 confirm 后，如果需要提交表单，应在弹窗组件中进行处理，不要把表单数据通过此回调函数发回调用者让调用者处理，在弹窗组件中处理完毕后，可以通过此回调函数向调用者发回表单提交结果，进行更进一步处理
  const callback = ref<((response: any) => void) | undefined>();

  /**
   * 注册弹窗初始化函数
   *
   * @param key 弹窗名称
   * @param hook 初始化函数
   */
  function registerInitHook<K extends PopupKey>(key: K, hook: (payload: { raw: PopupPayloadOut<K>; clone: PopupPayloadOut<K> }) => void) {
    // 获取 hooks 列表
    const hooks = initHooks.get(key);
    // 列表存在，则添加
    if (hooks) hooks.push(hook);
    // 列表不存在，则创建并添加
    else       initHooks.set(key, [hook]);
  }

  /**
   * 注销弹窗初始化函数
   *
   * @param key 弹窗名称
   * @param hook 要注销的初始化函数，如果不传则移除该 key 下的所有 hook
   */
  function unregisterInitHook<K extends PopupKey>(key: K, hook?: (payload: { raw: PopupPayloadOut<K>; clone: PopupPayloadOut<K> }) => void) {
    // 不传 hook，移除该 key 下的所有 hook
    if (!hook) {
      initHooks.delete(key);
      return;
    }

    // 获取 hooks 列表
    const hooks = initHooks.get(key);
    // hooks 列表不存在，则返回
    if (!hooks)
      return;

    // 获取 hook 的索引
    const index = hooks.indexOf(hook as (payload: { raw: any; clone: any }) => void);
    // hook 索引存在，删除该 hook
    if (index > -1)
      hooks.splice(index, 1);
  }

  /**
   * 判断弹窗是否打开，如果没有指定弹窗名称，则判断是否有任一弹窗正处于打开状态
   *
   * @param key 弹窗名称
   */
  function isOpen(key?: PopupKey): boolean {
    if (key === undefined)
      return popups.value !== undefined
    else
      return popups.value === key;
  }

  /**
   * ### 打开弹窗，并关闭所有其他弹窗
   *
   * @param key 弹窗名称
   * @param args 弹窗数据
   */
  function open<K extends PopupKey>(
    key: K,
    ...args: PopupPayloadIn<K> extends undefined
      ? [payload_?: undefined, callback_?: (response: PopupResponse<K>) => void]
      : [payload_: PopupPayloadIn<K>, callback_?: (response: PopupResponse<K>) => void]
  ): void {
    const [payload_, callback_] = args;
    popups.value = key;
    payload.value = payload_;
    callback.value = callback_;

    // 调用该 key 下的所有 initHook
    const hooks = initHooks.get(key);
    if (hooks) {
      const raw = rawPayload<K>();
      const clone = clonePayload<K>();
      hooks.forEach(hook => hook({ raw, clone }));
    }
  }

  /**
   * ### 关闭弹窗
   *
   * 用于用户点击取消、X 按钮或点击遮罩层等场景
   */
  function close() {
    popups.value = undefined;
  }

  /**
   * ### 确认并关闭弹窗
   *
   * 用于用户点击确认/提交按钮后，将结果返回给调用者
   *
   * @param key 弹窗名称，用于校验当前弹窗是否匹配
   * @param response 弹窗的返回数据
   */
  function confirm<K extends PopupKey>(key: K, response: PopupResponse<K>) {
    if (key !== popups.value)
      return;

    popups.value = undefined;
    // 如果回调函数存在（基本要求），则调用。通常用于用户点击弹窗内的 confirm 按钮
    if (callback.value)
      callback.value(response);
  }

  /**
   * 切换弹窗状态
   *
   * @param key 弹窗名称
   * @param args 弹窗数据
   */
  function toggle<K extends PopupKey>(
    key: K,
    ...args: PopupPayloadIn<K> extends undefined ? [] : [payload_: PopupPayloadIn<K>]
  ): void {
    if (isOpen(key))
      close();
    else {
      const [payload_] = args;
      open(key, payload_ as any);
    }
  }

  /**
   * ### 获取 payload 的原始引用（响应式对象）
   *
   * 注意：返回的是响应式对象的直接引用，修改属性会影响原始数据。
   * 仅在确认不会意外修改数据时使用，否则请使用 {@link clonePayload}。
   *
   * @returns 响应式的 payload 对象
   */
  function rawPayload<K extends PopupKey>(): PopupPayloadOut<K> {
    return payload.value as PopupPayloadOut<K>;
  }

  /**
   * ### 获取 payload 的深拷贝（普通对象）
   *
   * 返回一个完全独立的副本，修改属性不会影响原始数据。
   * 适用于需要修改或传递 payload 数据的场景。
   *
   * @returns payload 的深拷贝
   */
  function clonePayload<K extends PopupKey>(): PopupPayloadOut<K> {
    if (payload.value === undefined)
      return undefined as PopupPayloadOut<K>;
    return JSON.parse(JSON.stringify(payload.value)) as PopupPayloadOut<K>;
  }

  return {
    registerInitHook,
    unregisterInitHook,
    isOpen,
    open,
    close,
    confirm,
    toggle,
  };
});
