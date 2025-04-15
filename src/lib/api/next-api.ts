import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleApiError } from '@/utils/apiErrorHandling';

// Create an Axios instance for the Next.js backend
const nextApi = axios.create({
  baseURL: '/api', // Assuming Next.js API routes are under `/api`
  timeout: 30000, // 30 seconds timeout
});


// Response interceptor for handling responses and errors globally
nextApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Log errors for debugging
    console.error('API Error:', error);

    // Handle specific HTTP errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status } = error.response;

      switch (status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 404:
          console.error('Resource Not Found:', error.response.data);
          break;
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        default:
          console.error(`Error with status code ${status}:`, error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error: No response received', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

export const HireSenseNextAPI = {
  // Upload Job Description Files into the Server
  uploadJobDescriptionFiles: async (files: File[], workspaceName: string): Promise<any> => {
    console.log('Uploading job description: (API)', files);

    try {
      
      // Create a FormData object
      const formData = new FormData();
      // Append the workspace name
      formData.append('workspaceName', workspaceName);

      files.forEach((file, index) => {
        formData.append(`file`, file); // Append each file to the form data
      });

      console.dir(formData, { depth: null }); // Log the FormData object for debugging
      console.log('FormData:', formData.entries()); // Log the entries of FormData for debugging

      // Make the POST request with the FormData
      const response = await nextApi.post('/upload/jd', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type
        },
      });

      // Extract the `savedAs` data into an array called `file_paths`
      const file_paths = response.data.files.map((file: { savedAs: string }) => file.savedAs);

      return file_paths;
    } catch (error) {
      throw handleApiError(error, 'Error uploading job description');
    }
  },

   // Resume operations
 uploadResumeFiles: async (files: File[], workspaceName:string): Promise<any> => {
  console.log('Uploading resumes: (API)', files);
  try {
    // Create a FormData object
    const formData = new FormData();
    // Append the workspace name
    formData.append('workspaceName', workspaceName);

    files.forEach((file, index) => {
      formData.append(`file`, file); // Append each file to the form data
    });

    console.dir(formData, { depth: null }); // Log the FormData object for debugging
    console.log('FormData:', formData.entries()); // Log the entries of FormData for debugging

    // Make the POST request with the FormData
    const response = await nextApi.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type
      },
    });

    // Extract the `savedAs` data into an array called `file_paths`
    const file_paths = response.data.files.map((file: { savedAs: string }) => file.savedAs);

    return file_paths;
  } catch (error) {
    throw handleApiError(error, 'Error uploading resumes');
  }
},

}


