export interface ResponseBase<T> {
  isSuccess?: boolean;
  message?: string;
  data?: T;
  error?: object;
}
