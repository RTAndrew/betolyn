import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { IApiResponse } from './types';
import { ApiError } from './api-error';
import { SafeStorage } from '../safe-storage';
import { authStore } from '@/stores/auth.store';
import { constants } from '@/constants';

const api = axios.create({
  baseURL: `http://192.168.178.76:8080`,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically add the token to each request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = SafeStorage.get(constants.session.tokenStorageKey);
    if (token) {
      const cleanToken = typeof token === 'string' ? token.replaceAll('"', '') : token;
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/** Modify the response to be easier to use within the application  */
const onSuccessfulResponseInterception = (data: AxiosResponse) => ({
  raw: data,
  ...data.data,
});

/** The error response will be the same structure as the successful one
 * because the backend returns the same structure for both successful and error responses
 */
const onRejectedResponseInterception = (error: AxiosError) => {
  const responseData = error.response ? (error.response?.data as IApiResponse) : {};

  // Force logout if the auth token is invalid
  if ('error' in responseData && 'error') {
    if ((responseData.error as Record<string, unknown>)?.code === 'INVALID_AUTH_TOKEN') {
      authStore.handleLogout();
    }
  }

  throw new ApiError(responseData, error);
};

api.interceptors.response.use(onSuccessfulResponseInterception, onRejectedResponseInterception);

type TGeneric = Record<string, never>;

export const getRequest = async <TResponse>(endpoint: string, config?: AxiosRequestConfig) => {
  return await api.get<TGeneric, IApiResponse<TResponse>>(endpoint, config);
};

export const postRequest = async <TResponse, TBody = Record<string, unknown>>(
  endpoint: string,
  data?: TBody,
  config?: AxiosRequestConfig
) => {
  return await api.post<TGeneric, IApiResponse<TResponse>>(endpoint, data, config);
};

export const putRequest = async <TResponse, TBody = Record<string, unknown>>(
  endpoint: string,
  data?: TBody,
  config?: AxiosRequestConfig
) => {
  return await api.put<TGeneric, IApiResponse<TResponse>>(endpoint, data, config);
};

export const patchRequest = async <TResponse, TBody = Record<string, unknown>>(
  endpoint: string,
  data?: TBody,
  config?: AxiosRequestConfig
) => {
  return await api.patch<TGeneric, IApiResponse<TResponse>>(endpoint, data, config);
};

export default api;
