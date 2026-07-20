import type { MockMethod } from "vite-plugin-mock";

export default [
  {
    url: '/api/wishlist/1',
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        status: 'OK',
        businessType: '',
        message: '',
        data: false
      }
    }
  },
] as MockMethod[];