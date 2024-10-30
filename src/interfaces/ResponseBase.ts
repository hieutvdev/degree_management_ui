export interface ResponseBase<T> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: object;
}
