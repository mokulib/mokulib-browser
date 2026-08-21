// 分类统计
export interface CategoryStat {
  name: string;
  count: number;
}

// 逾期记录
export interface OverdueRecord {
  book_copy_id: number;
  book_id: number;
  user_id: number;
  dueTime: string;
}

// 仪表盘数据
export interface Dashboard {
  available_copies: number;
  book_types: number;
  borrowing: number;
  today_borrowed: number;
  today_returned: number;
  available_copies_change: number;
  book_types_change: number;
  borrowing_percentage: number;
  today_borrowed_change: number;
  today_returned_change: number;
  borrow_trend: number[];
  return_trend: number[];
  new_book_copy_trend: number[];
  new_book_trend: number[];
  category_stats: CategoryStat[];
  overdue_records: OverdueRecord[];
  withdrawn_count: number;
  lost_withdrawn_count: number;
  damaged_withdrawn_count: number;
  other_withdrawn_count: number;
}