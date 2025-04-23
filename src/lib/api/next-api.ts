import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleApiError } from '@/utils/apiErrorHandling';
import { Workspace } from '@/context/WorkspaceContext';

interface UploadFile {
    url: string; // Use string type for URL
    type: string; // Use string type for file type
    size: number; // Use number type for file size
    originalname: string; // Use string type for original filename
    savedAs: string;
}

interface UploadResponse {
    message: string;
    processedFiles: number;
    files: UploadFile[];
}

interface ExtractPDFResponse { // Define a type for the response from /extract/pdf
    message: string;
    filename: string; // Or whatever properties the actual response has
}

// Create an Axios instance for the Next.js backend (MetProAi)
const nextMetProAiApi = axios.create({
    baseURL: '/api',
    timeout: 30000,
});

// Response interceptor for handling responses and errors globally
nextMetProAiApi.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Log errors for debugging
        console.error('MetProAi API Error:', error);

        // Handle specific HTTP errors
        if (error.response) {
            const { status } = error.response;

            switch (status) {
                case 400:
                    console.error('MetProAi Bad Request:', error.response.data);
                    break;
                case 404:
                    console.error('MetProAi Resource Not Found:', error.response.data);
                    break;
                case 500:
                    console.error('MetProAi Server Error:', error.response.data);
                    break;
                default:
                    console.error(`MetProAi Error with status code ${status}:`, error.response.data);
            }
        } else if (error.request) {
            console.error('MetProAi Network Error: No response received', error.request);
        } else {
            console.error('MetProAi Error setting up request:', error.message);
        }

        return Promise.reject(error);
    }
);

export const MetProAiNextAPI = {
    uploadMedicalDocumentFiles: async (files: File[], workspaceName: string): Promise<UploadResponse> => {
        console.log('Uploading medical documents: (API)', files);

        try {
            const formData = new FormData();
            formData.append('workspaceName', workspaceName);

            files.forEach((file) => {
                formData.append('file', file);
            });

            const response = await nextMetProAiApi.post<UploadResponse>('/upload/medical', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Medical documents upload response: (API)', response);
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error uploading medical documents');
        }
    },

    uploadPatientDocumentFiles: async (files: File[], workspaceName: string): Promise<UploadResponse> => {
        console.log('Uploading patient documents: (API)', files);

        try {
            const formData = new FormData();
            formData.append('workspaceName', workspaceName);

            files.forEach((file) => {
                formData.append('file', file);
            });

            const response = await nextMetProAiApi.post<UploadResponse>('/upload/patient', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error uploading patient documents');
        }
    },
    extractPdf: async (url: string, type: 'medical' | 'patient'): Promise<ExtractPDFResponse> => {
        console.log(`Extracting PDF from URL (${type}):`, url);
        try {
            const response = await nextMetProAiApi.post<ExtractPDFResponse>(`/extract/pdf?url=${encodeURIComponent(url)}&type=${type}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error, `Error extracting PDF from URL (${type})`);
        }
    },

    extractMedicalPDF: async (url: string): Promise<ExtractPDFResponse> => {
        return MetProAiNextAPI.extractPdf(url, 'medical');
    },

    extractPatientPDF: async (url: string): Promise<ExtractPDFResponse> => {
        return MetProAiNextAPI.extractPdf(url, 'patient');
    },

    getWorkspaces: async (): Promise<Workspace[]> => {
        try {
            const response = await nextMetProAiApi.get<{ workspace: Workspace[] }>('/workspace');
            return response.data.workspace;
        } catch (error) {
            throw handleApiError(error, 'Error fetching MetProAi workspaces');
        }
    },

    createNewWorkspace: async (workspaceName: string): Promise<Workspace> => {
        try {
            const response = await nextMetProAiApi.post<Workspace>(`/workspace/${workspaceName}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error creating MetProAi workspace');
        }
    },

    createDefaultWorkspace: async (): Promise<Workspace> => {
        try {
            const response = await nextMetProAiApi.post<Workspace>('/workspace/default');
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error creating default MetProAi workspace');
        }
    },
};

export default MetProAiNextAPI;
