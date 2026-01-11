import { AxiosResponse } from 'axios';

export interface IPagination {
  current_page: number;
  total_records: number;
  total_pages: number;
}

export interface IPaginationResponse<T> {
  data: T[];
  pagination: IPagination;
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
}

export interface IApiResponse<T = unknown> {
  data: T;
  message: string;
  status: number;
  /** The raw Axios response */
  raw: AxiosResponse;
  errors: unknown | null;
}
