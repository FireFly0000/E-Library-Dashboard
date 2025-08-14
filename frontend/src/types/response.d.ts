export type Response<T> = {
  status_code: number;
  success: boolean;
  message: string;
  data?: T;
};

export type ResponsePagination<T> = {
  status_code: number;
  success: boolean;
  message: string;
  data?: T;
  total_records: number;
  total_pages: number;
  page: number;
  limit: number;
};

type RtkResponseError = {
  message: string;
  success?: boolean;
};
