import { AxiosError } from 'axios';
import { IApiResponse } from './types';

interface IApiError {
  code: string;
  message: string;
  details: unknown[];
}

/**
 * Custom error class for API errors that can be easily recovered in catch blocks
 */
export class ApiError extends Error {
  public readonly status?: number;
  public readonly error: IApiError;
  public readonly raw: AxiosError;

  constructor(response: Partial<IApiResponse<unknown>>, axiosError: AxiosError) {
    const message =
      'message' in response && response.message
        ? response.message
        : axiosError.message || 'Unknown error';
    super(message);
    this.error = response?.error as IApiError;

    this.name = 'ApiError';

    // Preserve the stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    // Assign API response properties
    if ('status' in response) this.status = response.status;
    if ('error' in response) this.error = response.error as IApiError;
    this.raw = axiosError;
  }

  /**
   * Type guard that works across module boundaries (avoids instanceof failures
   * when bundling produces multiple copies of the same class).
   */
  static isApiError(error: unknown): error is ApiError {
    return (
      error != null &&
      typeof error === 'object' &&
      (error as ApiError).name === 'ApiError' &&
      'raw' in error
    );
  }
}
