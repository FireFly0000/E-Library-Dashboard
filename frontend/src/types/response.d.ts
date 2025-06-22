export type Response<T> = {
  status_code: number;
  success: boolean;
  message: string;
  data?: T;
};
