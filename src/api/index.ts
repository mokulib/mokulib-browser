import axios from 'axios';
import type { Response } from '@/types';

const index = {
  post: async <T = any>(url: string, data?: any, config?: any): Promise<Response<T>> => {
    const response = await axios.post(url, data, config);
    return response.data as Response<T>;
  },

  delete: async <T = any>(url: string, config?: any): Promise<Response<T>> => {
    const response = await axios.delete(url, config);
    return response.data as Response<T>;
  },

  put: async <T = any>(url: string, data?: any, config?: any): Promise<Response<T>> => {
    const response = await axios.put(url, data, config);
    return response.data as Response<T>;
  },

  get: async <T = any>(url: string, config?: any): Promise<Response<T>> => {
    const response = await axios.get(url, config);
    return response.data as Response<T>;
  },
};

export default index;