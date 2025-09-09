import axios, { AxiosRequestConfig } from 'axios';



const api = axios.create({
  baseURL: `http://192.168.178.58:8000/api/`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/** Modify the response to be easier to use within the application  */
// const onSuccessfulResponseInterception = (data: AxiosResponse) => ({
//   raw: data,
//   ...data.data,
// });

//   // TODO: make the error interface the same as the Response
/** The error response will be the same structure as the successful one*/
// const onRejectedResponseInterception = (error: AxiosError) => ({
//   ...(error.response ? (error.response?.data as IApiResponse) : {}),
//   raw: error,
// });

// api.interceptors.response.use(onSuccessfulResponseInterception);

type TGeneric = Record<string, never>;

export const getRequest = async <TResponse>(endpoint: string, config?: AxiosRequestConfig) => {
  return await api.get<TGeneric, TResponse>(endpoint, config);
};

export const postRequest = async <TResponse, TBody = Record<string, unknown>>(
  endpoint: string,
  data?: TBody,
  config?: AxiosRequestConfig
) => {
  return await api.post<TGeneric, TResponse>(endpoint, data, config);
};

export const putRequest = async <TResponse, TBody = Record<string, unknown>>(
  endpoint: string,
  data?: TBody,
  config?: AxiosRequestConfig
) => {
  return await api.put<TGeneric, TResponse>(endpoint, data, config);
};

export default api;
