import axios from 'axios';


export const isValidResumeFilePath = (filePath: string): boolean => {
    // Check if the file path is a string and not empty
    if (!filePath || typeof filePath !== 'string') {
      return false;
    }
  
    // Check if the file has a valid extension for resumes
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    
    return validExtensions.includes(extension);
  };
  
  /**
   * Extracts the filename from a file path
   * @param filePath The file path
   * @returns The filename
   */
  export const getFileNameFromPath = (filePath: string): string => {
    return filePath.substring(filePath.lastIndexOf('/') + 1);
  };
  
  /**
   * Formats an error message for display
   * @param error The error object or message
   * @param fallback A fallback message if the error is undefined
   * @returns Formatted error message
   */
  export const formatErrorMessage = (error: any, fallback: string = 'An unknown error occurred'): string => {
    if (!error) {
      return fallback;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.message) {
      return error.message;
    }
    
    if (error.error) {
      return error.error;
    }
    
    return fallback;
  };
  
  // src/utils/errorUtils.ts
  
  import { AxiosError } from 'axios';
  import { ApiResponse } from '@/lib/api/axios-config';
import { uploadFilesViaSSH } from '@/lib/api/upload';
  
  /**
   * Creates a toast-friendly error message from an API error
   * @param error The error from the API call
   * @param defaultMessage A default message if the error doesn't have a specific message
   * @returns A user-friendly error message
   */
  export const createErrorMessage = (error: unknown, defaultMessage: string = 'An error occurred'): string => {
    // If it's an Axios error, try to get the error message from the response
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;
      
      if (axiosError.response?.data?.error) {
        return axiosError.response.data.error;
      }
      
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
      
      // Handle network errors
      if (axiosError.code === 'ECONNABORTED') {
        return 'Request timed out. Please try again.';
      }
      
      if (!axiosError.response) {
        return 'Network error. Please check your connection.';
      }
      
      // Handle HTTP errors
      switch (axiosError.response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication required. Please log in.';
        case 403:
          return 'Access denied. You do not have permission to perform this action.';
        case 404:
          return 'Resource not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Error (${axiosError.response.status}): ${defaultMessage}`;
      }
    }
    
    // If it's a regular Error object
    if (error instanceof Error) {
      return error.message;
    }
    
    // If it's a string
    if (typeof error === 'string') {
      return error;
    }
    
    // Default case
    return defaultMessage;
  };
  
  // Function to handle file input for resumes and job descriptions
  export const handleFileInputChange = async (
    files:File[],
    callback: (files: File[],workspaceName: string,)=>Promise<any>,
    workspaceName:string
  ) => {
    
    if (!files || files.length === 0) return;
    
    // Convert FileList to array of file paths
    // Note: In a real browser environment, this would need to use the File API
    // This is a simplified example for local file system paths
    const filePaths = Array.from(files).map(file => {
      // In a real implementation, you would handle this differently
      // This is just an example of how you might simulate file paths
      return `${file.name}`;
    });

    // Convert FileList to array of Files
    const filesArray = Array.from(files);
    // Call the upload function
    //uploadFilesViaSSH(filesArray, callback);
    console.log(filePaths)
    const response = await callback(filesArray, workspaceName);
    return response;
  };