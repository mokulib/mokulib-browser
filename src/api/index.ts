import axios, { type AxiosRequestConfig } from 'axios';
import type { Response } from '@/types';

const index = {
  post: async <T = any, D = any>(url: string, data?: any, config?: AxiosRequestConfig<D>): Promise<Response<T>> => {
    const response = await axios.post(url, data, config);
    return response.data as Response<T>;
  },

  delete: async <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<Response<T>> => {
    const response = await axios.delete(url, config);
    return response.data as Response<T>;
  },

  put: async <T = any, D = any>(url: string, data?: any, config?: AxiosRequestConfig<D>): Promise<Response<T>> => {
    const response = await axios.put(url, data, config);
    return response.data as Response<T>;
  },

  get: async <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<Response<T>> => {
    const response = await axios.get(url, config);
    return response.data as Response<T>;
  },
};

export default index;