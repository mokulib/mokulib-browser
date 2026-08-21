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
            { book_copy_id: 1, book_id: 1, user_id: 2, dueTime: '2026-08-10' },
            { book_copy_id: 2, book_id: 2, user_id: 3, dueTime: '2026-08-12' },
            { book_copy_id: 3, book_id: 3, user_id: 5, dueTime: '2026-08-14' },
            { book_copy_id: 4, book_id: 4, user_id: 7, dueTime: '2026-08-15' },
            { book_copy_id: 5, book_id: 5, user_id: 5, dueTime: '2026-08-16' },
            { book_copy_id: 6, book_id: 6, user_id: 3, dueTime: '2026-08-20' },
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