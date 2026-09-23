import { type ComponentPublicInstance, type Ref, nextTick, onMounted, onUnmounted, ref, watch, } from 'vue';

/**
 * 计算热搜词容器中能完整显示多少个热搜词
 *
 * @param hotSearches 热搜词列表（响应式）
 * @param hotSearchContainer 热搜词容器（响应式）
 */
export function useHotSearchVisibleCount(
  hotSearches: Ref<string[]>,
  hotSearchContainer: Ref<HTMLElement | null>,
) {
  const hotSearchItems = ref<HTMLElement[]>([]);
  const visibleCount = ref(0);

  function setHotSearchRef(el: Element | ComponentPublicInstance | null, index: number) {
    if (el instanceof HTMLElement) hotSearchItems.value[index] = el;
  }

  function calcVisibleHotCount() {
    let count = 0;

    if (hotSearchContainer.value) {
      const firstLeft = hotSearchItems.value[0]?.offsetLeft ?? 0;

      for (let i = 0; i < hotSearchItems.value.length; i++) {
        const el = hotSearchItems.value[i];
        if (!el) break;

        // offsetLeft 是相对于屏幕的绝对定位，因此需要减去首项
        const right = (el.offsetLeft - firstLeft) + el.offsetWidth;

        if (right <= hotSearchContainer.value.clientWidth) count++;
        else break; // 顺序排列，放不下就中断
      }
    }

    // 更新可见的热搜数量
    visibleCount.value = count;
    // 根据计算结果设置元素的 visibility 样式
    hotSearchItems.value.forEach((el, index) => {
      if (el)
        el.style.visibility = index < count ? '' : 'hidden';
    });
  }

  watch(hotSearches, async () => {
    await nextTick();
    calcVisibleHotCount();
  });

  onMounted(() => window.addEventListener('resize', calcVisibleHotCount));
  onUnmounted(() => window.removeEventListener('resize', calcVisibleHotCount));

  // noinspection JSUnusedGlobalSymbols
  return {
    /** 给每个热搜词绑定 :ref，模板里 :ref="(el) => setHotSearchRef(el, index)" */
    setHotSearchRef,
    /** 实际可见的热搜数量 */
    visibleCount,
    /** 重新计算可见的热搜数量 */
    calcVisibleHotCount,
  };
}