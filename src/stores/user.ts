import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "@/api";
import type { User } from "@/types";

export const useUserStore = defineStore('user', () => {
  // 数据
  const items = ref<{ userId: number; isCached: boolean; user: User | undefined }[]>([]);

  /**
   * 判断 userId 是否已缓存
   * @param userId userId
   */
  function _isCached(userId: number) {
    return items.value.some(item => item.userId === userId && item.isCached);
  }

  /**
   * 根据 userId 获取 user
   * @param userId userId
   */
  function user(userId: number) {
    // 返回数据
    return computed<User | undefined>(() => items.value.find(item => item.userId === userId)?.user);
  }

  /**
   * 预加载指定 userIds 的数据
   * @param userIds userIds
   */
  async function preload(...userIds: number[]) {
    // 收集未缓存的 userId
    const uncachedUserIds: number[] = userIds.filter(userId => !_isCached(userId));
    // 请求并设置数据
    await load(...uncachedUserIds);
  }

  /**
   * 重新请求 userIds 的数据，无论是否已经缓存
   * @param userIds userIds
   */
  async function load(...userIds: number[]) {
    // 去重
    const uniqueIds = [...new Set(userIds)];
    // 如果 items 中不存在某 userId，则添加新项
    uniqueIds.forEach(userId => {
      if (!items.value.some(item => item.userId === userId))
        items.value.push({ userId, isCached: false, user: undefined });
    });
    // 发送查询请求
    const responses: User[] = (await api.get<User[]>(`/api/users/list`, { params: { ids: uniqueIds.join(',') } })).data;
    // 处理响应
    responses.forEach(user => {
      // 找到数据对应的缓存项
      const item = items.value.find(item => item.userId === user.id);
      // 填充数据
      if (item) {
        item.user = user;
        item.isCached = true;
      }
    });
  }

  return {
    items,
    user,
    preload,
    load,
  };
});