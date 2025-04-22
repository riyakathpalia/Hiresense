import { ApiResponse } from '@/lib/api/axios-config';
import axios, { AxiosError } from 'axios';

// Error handling helper function
export const handleApiError = (error: unknown, defaultMessage: string = 'API Error') => {
  // If it's an axios error, extract useful information
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;

    if (axiosError.response?.data) {
      // If the API returned an error message, use that
      return {
        ...axiosError.response.data,
        status: axiosError.response.status,
        message: axiosError.response.data.error || axiosError.response.data.message || defaultMessage,
      };
    }

    if (axiosError.request) {
      // The request was made but no response was received
      return {
        status: 0,
        message: 'Network error: No response received',
        error: 'NETWORK_ERROR',
      };
    }
  }

  // For any other type of error
  return {
    status: 500,
    message: defaultMessage,
    error: (error as Error)?.message || 'UNKNOWN_ERROR',
  };
};