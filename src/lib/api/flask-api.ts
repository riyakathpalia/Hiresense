import axios, { AxiosError, AxiosResponse } from 'axios';

// Define types for MetProAi API responses (adjust based on your Flask API)
interface ApiResponse {
    message: string;
    error?: string; // Include error property for consistency
}

interface UploadResponse {
    message: string;
    saved_files: { file_path: string; name: string }[]; // Changed to match the OpenAPI spec
}

interface ListDocumentsResponse {
    documents: { id: string; name: string; /* other properties */ }[]; // adjust
}

interface ChatResponse {
    response: string;
    // define other properties
}

interface SummaryResponse {
    summary: string;
    // define
}

// Create an axios instance with default configurations for MetProAi (Flask backend)
const metProAiApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json', // Default content type.  Will be overridden where necessary.
    },
    timeout: 3000000, // 30 min timeout
});

// error handling function (adjust as needed for MetProAi - check Flask error responses)
const handleApiError = (error: unknown, message: string): Error => {
    if (axios.isAxiosError(error)) {
        // detailed error handling
        let errorMessage = message;
        if (error.response) {
            errorMessage += ` (Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)})`;
        } else if (error.request) {
            errorMessage += ' (No response received)';
        } else {
            errorMessage += ` (Error setting up request: ${error.message})`;
        }
        console.error(errorMessage);
        return new Error(errorMessage);
    } else {
        // for non-Axios errors
        console.error(message, error);
        return new Error(message);
    }
};

// API Service for MetProAi
export const MetProAiAPI = {
    // Upload Medical Documents
    uploadMedicalDocuments: async (data: { file_paths: string[] }): Promise<UploadResponse> => { // Changed input type
        console.log('Uploading medical documents: (API - Flask)', data);
        try {
            const response: AxiosResponse<UploadResponse> = await metProAiApi.post('/upload/medical_documents', data); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error uploading medical documents');
        }
    },

    // Upload Patient Documents
    uploadPatientDocuments: async (data: { file_paths: string[] }): Promise<UploadResponse> => { // Changed input type
        console.log('Uploading patient documents: (API - Flask)', data);
        try {
            const response: AxiosResponse<UploadResponse> = await metProAiApi.post('/upload/patient_documents', data); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error uploading patient documents');
        }
    },

    // List Medical Documents  -  Requires implementation in Flask and OpenAPI
    listMedicalDocuments: async (): Promise<ListDocumentsResponse> => {
        try {
            const response: AxiosResponse<ListDocumentsResponse> = await metProAiApi.get('/list/medical_documents'); // endpoint.  You might need to create this.
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error listing medical documents');
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
    deleteMedicalFile: async (fileName: string): Promise<ApiResponse> => { // Changed parameter name to fileName
        try {
            const response: AxiosResponse<ApiResponse> = await metProAiApi.delete(`/delete/medical_file/${fileName}`); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error deleting medical document');
        }
    },

    // Delete Patient Document
    deletePatientFile: async (fileName: string): Promise<ApiResponse> => {  // Changed parameter name to fileName
        try {
            const response: AxiosResponse<ApiResponse> = await metProAiApi.delete(`/delete/patient_file/${fileName}`); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error deleting patient document');
        }
    },

    // Extract and Save Medical PDF
    extractMedicalPDF: async (urls: string | string[]): Promise<SummaryResponse> => {
        try {
            const response: AxiosResponse<SummaryResponse> = await metProAiApi.post('/extract/save_pdf_medical', { urls }); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error extracting medical PDF');
        }
    },

    // Extract and Save Patient PDF
    extractPatientPDF: async (urls: string | string[]): Promise<SummaryResponse> => {
        try {
            const response: AxiosResponse<SummaryResponse> = await metProAiApi.post('/extract/save_pdf_patient', { urls }); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error extracting patient PDF');
        }
    },
    // Chat with Medical Data
    sendMedicalChatMessage: async (message: string): Promise<ChatResponse> => {
        try {
            const response: AxiosResponse<ChatResponse> = await metProAiApi.post('/chat', { message }); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error sending medical chat message');
        }
    },

    // Chat with Patient Data
    sendPatientChatMessage: async (message: string): Promise<ChatResponse> => {
        try {
            const response: AxiosResponse<ChatResponse> = await metProAiApi.post('/chat', { message }); // endpoint
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error sending patient chat message');
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
