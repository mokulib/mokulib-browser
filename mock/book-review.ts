import type { MockMethod } from "vite-plugin-mock";
import { BookReview } from "../src/types";

export default [
  {
    url: '/api/book-review/1',
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        status: 'OK',
        businessType: '',
        message: '',
        data: [
          {
            id: 1,
            book_id: 1,
            user_id: 3,
            user_name: 'Mr_Wang',
            score: 4,
            content: '视角宏大，观点犀利，部分论断略显武断，但不失为一部启发思考的好书。',
            create_time: '2023-05-05T10:13:23'
          },
          {
            id: 2,
            book_id: 1,
            user_id: 2,
            user_name: 'Mr_Zhang',
            score: 5,
            content: '读完对“我们为什么是现在的样子”有了全新的理解，值得反复咀嚼。',
            create_time: '2023-05-05T10:13:23'
          },
          {
            id: 3,
            book_id: 1,
            user_id: 6,
            user_name: '栗子',
            score: 3,
            content: '有点枯燥，非常硬核。',
            create_time: '2023-05-05T10:13:23'
          }
        ] as BookReview[]
      }
    }
  }
]