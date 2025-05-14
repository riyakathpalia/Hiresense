import axios from 'axios';

/**
 * Checks if a file path is valid for resumes
 * @param filePath The file path
 * @returns True if the file path is valid, false otherwise
 */
export const isValidResumeFilePath = (filePath: string): boolean => {
  if (!filePath || typeof filePath !== 'string') {
    return false;
  }

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
export const formatErrorMessage = (error: unknown, fallback: string = 'An unknown error occurred'): string => {
  if (!error) {
    return fallback;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'error' in error) {
    const errorObj = error as { error: unknown };
    if (typeof errorObj.error === 'string') {
      return errorObj.error;
    }
  }

  return fallback;
};

// src/utils/errorUtils.ts

import { ApiResponse } from '@/types/api/MetProAiApiProps';
import { AxiosError } from 'axios';

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

/**
 * Function to handle file input for medical and patient documents
 * @param files The files to process
 * @param callback The callback function to handle the files
 * @param workspaceName The name of the workspace
 * @returns The response from the callback
 */
export const handleFileInputChange = async (
  files: File[],
  callback: (files: File[], workspaceName: string) => Promise<unknown>, 
  workspaceName: string
) => {
  if (!files || files.length === 0) return;
  console.log('Files Length :', files.length);
  // Convert FileList to array of file paths
  const filePaths = Array.from(files).map((file) => file.name);

  // Convert FileList to array of Files
  const filesArray = Array.from(files);

  // Call the upload function
  console.log(filePaths);
  const response = await callback(filesArray, workspaceName);
  return response;
};

/**
 * Function to handle URL input for medical and patient documents
 * @param urls The URLs to process (can be a single URL string or an array of URLs)
 * @param callback The callback function to handle the URLs
 * @param workspaceName The name of the workspace
 * @returns The response from the callback
 */
export const handleUrlInputChange = async (
  urls: string,
  callback: (urls: string, workspaceName: string) => Promise<unknown>, 
  workspaceName: string
) => {
  if (!urls?.trim()) return;
  //if (!urls || (Array.isArray(urls) && urls.length === 0)) return;
  
  //console.log('URLs to process:', Array.isArray(urls) ? urls.length : 1);
  
  // Convert to array if it's a single URL
  //const urlsArray = Array.isArray(urls) ? urls : [urls];
  
  // Log the URLs
  //console.log(urlsArray);
  
  // Call the upload function
  try {
    const response = await callback(urls, workspaceName);
    console.log('Response from URL upload: (handleUrlInputChange)', response);
    return response;
  } catch (error) {
    console.error('Error during URL upload:', error);
    throw error;
  }
};