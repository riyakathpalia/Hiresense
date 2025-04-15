import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleApiError } from '@/utils/apiErrorHandling';
import { 
    ResumesListResponse,
    ApiResponse,
    UploadResponse,
    ChatResponse,
    SummaryResponse, 
 } from '@/types/api/HireSenseApiProps';


 // Create an axios instance with default configurations
const flaskApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://3.108.190.231:8503/v1',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 3000000, // 30 min timeout
  });


// API Service for HireSense
export const HireSenseAPI = {
  // Resume operations
  uploadResumes: async (files: File[]): Promise<any> => {
    console.log('Uploading resumes: (API)', files);
    try {
      const response = await flaskApi.post('/upload/resume', { files: files });
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