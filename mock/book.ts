import type { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: '/api/book/1',
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        status: 'OK',
        businessType: '',
        message: '',
        data: {
          id: 2,
          isbn: '978-7-5086-7357-1',
          title: '人类简史',
          subtitle: '从动物到上帝',
          author: '尤瓦尔·赫拉利',
          publisher: '中信出版社',
          publishDate: '2014-11-01',
          edition: '第 1 版',
          pageCount: 440,
          language: '中文（简体）',
          description: '《人类简史》纵观人类从石器时代至今的整个历史进程，讲述了认知革命、农业革命、科学革命如何深刻改变了人类社会，是一部横跨历史学、人类学与生物学的恢弘之作。',
          price: 68.00,
        }
      }
    }
  },
] as MockMethod[];
