import axios, { type AxiosRequestConfig } from 'axios';
import type { Response } from '@/types';
import { Message } from "@/components/message";

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

/**
 * 处理简单响应
 * @param data 响应数据
 * @param onSuccess 成功回调
 */
export async function simpleResponseHandler<T>(data: Response<T>, onSuccess?: (data: T) => void | Promise<void>) {
  if (data.status === 'OK') {
    Message.success(data.message);
    if (onSuccess)
      await onSuccess(data.data);
  } else
    Message.error(data.message);
}
