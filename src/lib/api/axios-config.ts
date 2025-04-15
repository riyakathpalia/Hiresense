import axios, { AxiosError, AxiosResponse } from 'axios';


// Create an axios instance with default configurations
const flaskApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://3.108.190.231:8503/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000000, // 30 min timeout
});



console.log('API URL:', process.env.NEXT_PUBLIC_API_URL),

// Response interceptor for handling responses and errors globally
flaskApi.interceptors.response.use(
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

// Type Definitions based on your Swagger file
export interface ResumeFile {
  name: string;
  file_path: string;
}

export interface JobDescriptionFile {
  name: string;
  file_path: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  [key: string]: any;
}

export interface UploadResponse extends ApiResponse {
  saved_files: ResumeFile[];
}

export interface ResumesListResponse extends ApiResponse {
  resumes: ResumeFile[];
}

export interface ChatResponse extends ApiResponse {
  reply: string;
  matched_candidates?: Array<{
    name: string;
    relevance_score: number;
  }>;
}

export interface SummaryResponse extends ApiResponse {
  summary: string;
  skills: string[];
}


// API Service for HireSense
export const HireSenseAPI = {
  // Resume operations
  uploadResumes: async (filePaths: string[]): Promise<any> => {
    console.log('Uploading resumes: (API)', filePaths);
    try {
      const response = await flaskApi.post('/upload/resume', { file_paths: filePaths });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error uploading resumes');
    }
  },
  
  listResumes: async (): Promise<ResumesListResponse> => {
    try {
      const response = await flaskApi.get('/list/resumes');
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error listing resumes');
    }
  },
  
  deleteResume: async (resumeId: string): Promise<ApiResponse> => {
    try {
      const response = await flaskApi.delete(`/delete/resume/${resumeId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error deleting resume');
    }
  },
  
  
  // Job Description operations
  uploadJobDescriptions: async (file_path: string): Promise<any> => {
    console.log('Uploading job description: (API)', file_path);
    
    try {
      const response = await flaskApi.post('/upload/jd', {file_path});

      console.log('Job description upload response: (API)', response);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error uploading job description');
    }
  },
  
  deleteJobDescription: async (jdId: string): Promise<ApiResponse> => {
    try {
      const response = await flaskApi.delete(`/delete/jd/${jdId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error deleting job description');
    }
  },
  
  // Chat operations
  sendChatMessage: async (message: string, jdSearch: boolean = true): Promise<ChatResponse> => {
    try {
      const response = await flaskApi.post('/chat', { message, jd_search: jdSearch });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error sending chat message');
    }
  },
  
  sendKeywordChat: async (keyword: string): Promise<ChatResponse> => {
    try {
      const response = await flaskApi.post('/keyword-chat', { keyword });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error processing keyword chat');
    }
  },
  
  // Summary operations
  getCVSummary: async (filePath: string): Promise<SummaryResponse> => {
    try {
      const response = await flaskApi.post('/summary', { file_path: filePath });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error generating CV summary');
    }
  },
  
  // System operations
  resetAllData: async (): Promise<ApiResponse> => {
    try {
      const response = await flaskApi.post('/reset', { check: "reset all" });
      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Error resetting data');
    }
  },
};

// Error handling helper function
const handleApiError = (error: any, defaultMessage: string = 'API Error') => {
  // If it's an axios error, extract useful information
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    
    if (axiosError.response?.data) {
      // If the API returned an error message, use that
      return {
        ...axiosError.response.data,
        status: axiosError.response.status,
        message: axiosError.response.data.error || axiosError.response.data.message || defaultMessage
      };
    }
    
    if (axiosError.request) {
      // The request was made but no response was received
      return {
        status: 0,
        message: 'Network error: No response received',
        error: 'NETWORK_ERROR'
      };
    }
  }
  
  // For any other type of error
  return {
    status: 500,
    message: defaultMessage,
    error: error?.message || 'UNKNOWN_ERROR'
  };
};

export default HireSenseAPI;