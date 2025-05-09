import {
    ApiResponse,
    ChatResponse,
    ListDocumentsResponse,
    UploadResponse,
} from '@/types/api/MetProAiApiProps';
import { handleApiError } from '@/utils/apiErrorHandling';
import axios, { AxiosResponse } from 'axios';



interface ProcessUrlResponse {
    processed_urls: { url: string; status: string; /* other properties */ }[]; // Adjust based on API response
}

// Create an axios instance with default configurations for MetProAi (Flask backend)
const metProAiApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json', // Default content type.  Will be overridden where necessary.
    },
    timeout: 3000000, // 30 min timeout
});

function getCookieValue(cookieName: string): string | null {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((row) => row.startsWith(`${cookieName}=`));
    return cookie ? cookie.split('=')[1] : null;
}

// API Service for MetProAi
export const MetProAiAPI = {
    // Upload Medical Documents
    uploadMedicalDocuments: async (filePaths: string[], workspaceName: string): Promise<UploadResponse> => {
        console.log('Uploading medical documents: (API - Flask)', filePaths);
        const guestId = getCookieValue('guestId');
        console.log("guestID : ", guestId);
        try {
            const response: AxiosResponse<UploadResponse> = await metProAiApi.post('/process/medical_documents', { file_paths: filePaths }); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error uploading medical documents');
        }
    },

    // Upload Patient Documents
    uploadPatientDocuments: async (filePaths: string[], workspaceName: string): Promise<UploadResponse> => {
        console.log('Uploading patient documents: (API - Flask)', filePaths);
        const guestId = getCookieValue('guestId');
        console.log("guestID : ", guestId);
        try {
            const response: AxiosResponse<UploadResponse> = await metProAiApi.post('/process/patient_documents', { file_paths: filePaths }); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error uploading patient documents');
        }
    },

    // List Medical Documents    -  Requires implementation in Flask and OpenAPI
    listMedicalDocuments: async (): Promise<ListDocumentsResponse> => {
        try {
            const response = await metProAiApi.get('/list/resumes');
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error listing resumes');
        }
    },

    // List Patient Documents - Requires implementation in Flask and OpenAPI
    listPatientDocuments: async (): Promise<ListDocumentsResponse> => {

        try {
            const response: AxiosResponse<ListDocumentsResponse> = await metProAiApi.get('/list/patient_documents'); // endpoint. You might need to create this.
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error listing patient documents');
        }
    },

    // Delete Medical Document
    deleteMedicalDocument: async (fileName: string): Promise<ApiResponse> => {
        try {
            // Corrected to match API spec
            const response: AxiosResponse<ApiResponse> = await metProAiApi.post('/delete/delete_medical_file', {
                file_name: fileName
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error deleting medical document');
        }
    },

    // Delete Patient Document
    deletePatientDocument: async (fileName: string): Promise<ApiResponse> => {
        try {
            // Corrected to match API spec
            const response: AxiosResponse<ApiResponse> = await metProAiApi.post('/delete/delete_patient_file', {
                file_name: fileName
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error deleting patient document');
        }
    },

    // Delete Medical URL
    deleteMedicalUrl: async (url: string): Promise<ApiResponse> => {
        try {
            // Added missing function from API spec
            const response: AxiosResponse<ApiResponse> = await metProAiApi.post('/delete/delete_medical_url', {
                url: url
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error deleting medical URL');
        }
    },

    // Delete Patient URL
    deletePatientUrl: async (url: string): Promise<ApiResponse> => {
        try {
            // Added missing function from API spec
            const response: AxiosResponse<ApiResponse> = await metProAiApi.post('/delete/delete_patient_url', {
                url: url
            });
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error deleting patient URL');
        }
    },
    // Process Medical URLs
    processMedicalUrls: async (urls: string, workspaceName: string): Promise<ProcessUrlResponse> => {
        console.log('Uploading medical url: (API - Flask)', urls);
        try {
            // Corrected to match API spec
            const payload = { urls };
            const response: AxiosResponse<ProcessUrlResponse> = await metProAiApi.post(
                '/process/medical_url',
                payload
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error processing medical URLs');
        }
    },

    // Process Patient URLs
    processPatientUrls: async (urls: string | string[]): Promise<ProcessUrlResponse> => {
        try {
            // Corrected to match API spec
            const payload = { urls };
            const response: AxiosResponse<ProcessUrlResponse> = await metProAiApi.post(
                '/process/patient_url',
                payload
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error processing patient URLs');
        }
    },
    
    // Chat with Medical Data
    sendChatMessage: async (message: string, medicalSearch: boolean = true,workspace_name:string): Promise<string> => {
        try {
            // Corrected to match API spec
            const response: AxiosResponse<ChatResponse> = await metProAiApi.post('/chat', { message });
            return response.data.reply; // Updated to match the expected response structure
        } catch (error) {
            throw handleApiError(error, 'Error sending chat message');
        }
    },

    // Reset All Data
    resetAllData: async (): Promise<ApiResponse> => {
        try {
            const response: AxiosResponse<ApiResponse> = await metProAiApi.post('/reset', { check: 'reset all' }); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error resetting data');
        }
    },
};

