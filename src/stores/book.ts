import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Book } from "@/types";
import api from "@/api";

export const useBookStore = defineStore('book', () => {
  // 数据
  const items = ref<{ bookId: number; isCached: boolean; book: Book | undefined }[]>([]);

  /**
   * 判断 bookId 是否已缓存
   * @param bookId bookId
   */
  function _isCached(bookId: number) {
    return items.value.some(item => item.bookId === bookId && item.isCached);
  }

  /**
   * 根据 bookId 获取 book
   * @param bookId bookId
   */
  function book(bookId: number) {
    // 返回数据
    return computed<Book | undefined>(() => items.value.find(item => item.bookId === bookId)?.book);
  }

  /**
   * 更新书籍信息
   * @param book 新的书籍信息
   */
  async function update(book: Book) {
    // 请求更新
    const response = await api.put<Book>(`/api/books/${book.id}`, book);
    // 如果更新成功
    if (response.status === 'OK') {
      // 如果 items 中不存在该 bookId
      if (!items.value.some(item => item.bookId === book.id))
        items.value.push({ bookId: book.id, isCached: false, book: response.data });
      // 更新数据
      else
        items.value.find(item => item.bookId === book.id)!.book = response.data;
    }
    // 返回响应
    return response;
  }

  /**
   * 预加载指定 bookIds 的数据
   * @param bookIds bookIds
   */
  async function preload(...bookIds: number[]) {
    // 收集未缓存的 bookId
    const uncachedBookIds: number[] = bookIds.filter(bookId => !_isCached(bookId));
    // 请求并设置数据
    await load(...uncachedBookIds);
  }

  /**
   * 重新请求 bookIds 的数据，无论是否已经缓存
   * @param bookIds bookIds
   */
  async function load(...bookIds: number[]) {
    // 去重
    const uniqueIds = [...new Set(bookIds)];
    // 如果 items 中不存在某 bookId，则添加新项
    uniqueIds.forEach(bookId => {
      if (!items.value.some(item => item.bookId === bookId))
        items.value.push({ bookId, isCached: false, book: undefined });
    });
    // 构造批量请求
    const requests = uniqueIds.map(bookId => api.get<Book>(`/api/books/${bookId}`));
    // 发送查询请求
    const responses: Book[] = (await Promise.all(requests)).filter(response => response.status === 'OK').map(response => response.data);
    // 处理响应
    uniqueIds.forEach(bookId => {
      // 找到 id 对应的缓存项
      const item = items.value.find(item => item.bookId === bookId)!;
      // 找到 id 对应的结果（可能不存在）
      const response = responses.find(response => response.id === bookId);
      // 填充状态
      item.isCached = true;
      // 填充结果
      item.book = response;
    });
  }

  return {
    items,
    book,
    update,
    preload,
    load,
  };
});