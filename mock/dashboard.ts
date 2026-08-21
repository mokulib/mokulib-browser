import { Dashboard } from "../src/types";

export default [
  {
    url: '/api/dashboard',
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        status: 'OK',
        businessType: '',
        message: '',
        data: {
          available_copies: 1272,
          book_types: 684,
          borrowing: 47,
          today_borrowed: 23,
          today_returned: 18,
          available_copies_change: 12,
          book_types_change: 8,
          borrowing_percentage: 3.7,
          today_borrowed_change: 5,
          today_returned_change: -2,
          borrow_trend: [12, 18, 15, 22, 19, 14, 8],
          return_trend: [8, 10, 12, 16, 14, 9, 6],
          new_book_copy_trend: [2, 3, 1, 4, 2, 0, 3],
          new_book_trend: [1, 2, 0, 3, 1, 0, 2],
          category_stats: [
            { name: '政治', count: 2 },
            { name: '历史', count: 1 },
            { name: '语言', count: 1 },
            { name: '自然科学', count: 3 },
            { name: '计算机', count: 13 },
            { name: '其他', count: 4 },
          ],
          overdue_records: [
            { id: 1, title: '挪威的森林', borrower: '张明', dueDate: '2026-08-10', days: 7 },
            { id: 2, title: '百年孤独', borrower: '李丽', dueDate: '2026-08-12', days: 5 },
            { id: 3, title: '人类简史', borrower: '王强', dueDate: '2026-08-14', days: 3 },
            { id: 4, title: '三体', borrower: '赵雪', dueDate: '2026-08-15', days: 2 },
            { id: 5, title: '活着', borrower: '陈晨', dueDate: '2026-08-16', days: 1 },
            { id: 6, title: '瓦尔登湖', borrower: '刘静', dueDate: '2026-08-17', days: 0 },
          ],
          withdrawn_count: 12,
          lost_withdrawn_count: 5,
          damaged_withdrawn_count: 4,
          other_withdrawn_count: 3,
        } as Dashboard
      }
    }
  }
]