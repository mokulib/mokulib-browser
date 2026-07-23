export interface Response<T> {
  status: string;
  businessType: string;
  message: string;
  data: T;
}
