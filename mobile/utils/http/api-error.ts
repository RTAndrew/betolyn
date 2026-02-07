import { AxiosError } from 'axios';
import { IApiResponse } from './types';

/**
 * Custom error class for API errors that can be easily recovered in catch blocks
 */
export class ApiError extends Error {
  public readonly status?: number;
  public readonly error?: unknown | null;
  public readonly raw: AxiosError;

  constructor(response: Partial<IApiResponse<unknown>>, axiosError: AxiosError) {
    const message =
      'message' in response && response.message
        ? response.message
        : axiosError.message || 'Unknown error';
    super(message);

    this.name = 'ApiError';

    // Preserve the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    // Assign API response properties
    if ('status' in response) this.status = response.status;
    if ('error' in response) this.error = response.error;
    this.raw = axiosError;
  }
}
