// src/utils/apiErrorHandling.ts
import axios, { AxiosError } from 'axios';

export const handleApiError = (error: unknown, defaultMessage: string = 'API Error') => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    if (axiosError.response?.data) {
      // Server responded with an error
      return new Error(
        `${defaultMessage}: ${axiosError.response.data.error || axiosError.response.data.message || axiosError.message}`
      );
    } else if (axiosError.request) {
      // Request was made but no response received
      return new Error(`${defaultMessage} (No response received)`);
    }
  }
  
  // For non-Axios errors or other cases
  return new Error(`${defaultMessage}: ${error instanceof Error ? error.message : 'Unknown error'}`);
};