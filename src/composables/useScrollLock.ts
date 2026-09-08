import { type Ref } from 'vue'

/**
 * 滚动锁 Composable
 * 用于阻止弹窗/模态框中的滚动事件传播到背景页面
 *
 * @param containerRef - Vue 3 的 ref 对象，指向容器元素（遮罩层）
 * @returns 包含事件处理函数的对象
 */
export function useScrollLock(containerRef: Ref<HTMLElement | null>) {
  /**
   * 检查一个 DOM 元素是否可滚动
   * 判断标准：元素的 overflow 样式允许滚动，且内容实际超出了容器大小
   *
   * @param element - 要检查的 DOM 元素
   * @returns 如果元素可以滚动返回 true，否则返回 false
   */
  const isScrollable = (element: HTMLElement | null): boolean => {
    // 排除无效元素、document 根元素和 body 元素，这些元素不需要特殊处理，它们的滚动由浏览器管理
    if (!element || element === document.documentElement || element === document.body)
      return false;

    // 获取元素的计算样式（最终样式）
    const style = window.getComputedStyle(element);

    // 获取垂直和水平方向的 overflow 设置
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;

    // 检查垂直方向是否可滚动
    // 1. overflow-y 设置为 auto/scroll/overlay（允许滚动）
    // 2. 内容的实际高度(scrollHeight)大于可见高度(clientHeight)
    const canScrollY = (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') && element.scrollHeight > element.clientHeight;

    // 检查水平方向是否可滚动
    // 1. overflow-x 设置为 auto/scroll/overlay（允许滚动）
    // 2. 内容的实际宽度(scrollWidth)大于可见宽度(clientWidth)
    const canScrollX = (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') && element.scrollWidth > element.clientWidth;

    // 垂直或水平任意一个方向可滚动即可
    return canScrollY || canScrollX;
  }

  /**
   * 检查可滚动元素是否已经到达滚动边界（顶部或底部）
   * 这个函数用于判断是否应该阻止滚动事件继续传播
   *
   * @param element - 可滚动的 DOM 元素
   * @param deltaY - 滚轮的滚动方向和距离（正值向下，负值向上）
   * @returns 如果到达边界返回 true，否则返回 false
   */
  const isAtScrollBoundary = (element: HTMLElement | null, deltaY: number): boolean => {
    // 元素无效时返回 false
    if (!element) return false

    // 解构获取元素的滚动位置和尺寸信息
    const { scrollTop, scrollHeight, clientHeight } = element

    // 判断向下滚动的边界
    if (deltaY > 0) {
      // 向下滚动时，检查是否已经到达底部
      // scrollTop（当前滚动位置）+ clientHeight（可见高度）>= scrollHeight（总内容高度）
      // 减去 1 是为了容错处理浮点数精度问题
      return scrollTop + clientHeight >= scrollHeight - 1
    }

    // 判断向上滚动的边界
    if (deltaY < 0) {
      // 向上滚动时，检查是否已经到达顶部
      // scrollTop 为 0 表示已经在最顶部
      return scrollTop <= 0
    }

    // deltaY 为 0 时（没有实际滚动），返回 false
    return false
  }

  /**
   * wheel 事件处理函数
   *
   * @param event - 滚轮事件对象
   */
  const wheelHandler = (event: WheelEvent): void => {
    // 获取触发事件的具体元素（鼠标实际所在的元素）
    const target = event.target as HTMLElement

    // 获取容器元素（遮罩层）
    const container = containerRef.value

    // 情况 1：事件直接发生在遮罩层上
    if (target === container) {
      // 阻止事件传播
      event.preventDefault()
      return
    }

    // 情况 2：事件发生在弹窗内容上，从目标元素开始，向上遍历 DOM 树查找可滚动元素
    let element: HTMLElement | null = target

    // 循环条件：
    // - element 存在（没有到 DOM 树顶端）
    // - element 还没到遮罩层
    // - element 不是 body（还没到页面主体）
    while (element && element !== container && element !== document.body) {
      // 检查当前元素是否可滚动
      if (isScrollable(element)) {
        // 检查是否在滚动边界（顶部或底部）
        if (isAtScrollBoundary(element, event.deltaY)) {
          // 阻止事件传播
          event.preventDefault()
        }
        // 滚动元素处理后直接返回
        return
      }
      // 当前元素不可滚动，继续向上查找父元素
      element = element.parentElement
    }

    // 情况 3：没有找到可滚动元素，直接阻止事件传播
    event.preventDefault()
  }

  return {
    wheelHandler
  }
}
