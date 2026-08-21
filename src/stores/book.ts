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
    const responses: Book[] = (await Promise.all(requests)).map(response => response.data);
    // 处理响应
    responses.forEach(book => {
      // 找到数据对应的缓存项
      const item = items.value.find(item => item.bookId === book.id);
      // 填充数据
      if (item) {
        item.book = book;
        item.isCached = true;
      }
    });
  }

  return {
    items,
    book,
    preload,
    load,
  };
});