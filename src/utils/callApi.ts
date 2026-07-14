import axios, { type AxiosRequestConfig } from "axios";
import type { Response } from "@/types";

export async function callApi(config: AxiosRequestConfig): Promise<Response> {
  try {
    const response = await axios(config);
    return response.data
  } catch (error: any) {
    if (error.response?.status === 401)
      return error.response?.data
    return {
      status: "NETWORK_ERROR",
      businessType: "",
      message: "网络错误",
      data: null
    };
  }
}