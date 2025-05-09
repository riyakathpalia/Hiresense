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
    // Update the extractPdf method to handle workspace
    processUrls: async (
        url: string,
        type: 'medical_documents' | 'patient_documents',
        workspaceName: string
    ): Promise<UploadResponse> => {
        console.log(`Process PDF from URL (${type}):`, url);
        try {
            const response = await nextMetProAiApi.post<UploadResponse>(
                `/extract/pdf`,
                { url, type, workspaceName }
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error, `Error extracting PDF from URL (${type})`);
        }
    },

    processMedicalUrls: async (url: string, workspaceName: string): Promise<UploadResponse> => {
        return MetProAiNextAPI.processUrls(url, 'medical_documents', workspaceName);
    },

    processPatientUrls: async (url: string, workspaceName: string): Promise<UploadResponse> => {
        return MetProAiNextAPI.processUrls(url, 'patient_documents', workspaceName);
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