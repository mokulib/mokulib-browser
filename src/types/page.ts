export interface Page<T> {
  /**
   * 当前页码
   */
  current: number;

  /**
   * 总页数
   */
  pages: number;

  /**
   * 结果
   */
  records: T[];

  /**
   * 每页大小
   */
  size: number;

  /**
   * 总记录数
   */
  total: number;
}
