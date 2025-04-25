import axios, { AxiosError, AxiosResponse } from 'axios';

// Create an axios instance with default configurations for MetProAi
const metProAiApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 3000000, // 30 min timeout
});

// Response interceptor for handling responses and errors globally
metProAiApi.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Log errors for debugging
        console.error('CazeMetProAI API Error:', error);

        // Handle specific HTTP errors
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 400:
                    console.error('CazeMetProAI Bad Request:', error.response.data);
                    break;
                default:
                    console.error(`CazeMetProAI Error with status code ${status}:`, error.response.data);
            }
        } else if (error.request) {
            console.error('CazeMetProAI Network Error: No response received', error.request);
        } else {
            console.error('CazeMetProAI Error setting up request:', error.message);
        }

        return Promise.reject(error);
    }
);

// Type Definitions based on your OpenAPI specification
export interface UploadMedicalDocumentsBody {
    file_paths: string[];
}

export interface UploadResponse {
    message?: string;
    saved_files?: Array<{
        name?: string;
        file_path?: string;
    }>;
}

export interface UploadError {
    error?: string;
    failed_files?: string[];
}

export interface ExtractSavePdfBody {
    urls: string | string[];
}

export interface ExtractSavePdfResponse {
    status?: string;
    message?: string;
}

export interface ApiResponse {
    message?: string;
    error?: string;
    status?: string;
    [key: string]: unknown;
}

// API Service for MetProAi
export const MetProAiAPI = {
    // Medical Document Upload
    uploadMedicalDocuments: async (filePaths: string[]): Promise<UploadResponse> => {
        try {
            const response = await metProAiApi.post('/upload/medical_documents', { filePaths });
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error uploading medical documents');
        }
    },

    // Patient Document Upload
    uploadPatientDocuments: async (filePaths: string[]): Promise<UploadResponse> => {
        try {
            const response = await metProAiApi.post('/upload/patient_documents', { filePaths });
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error uploading patient documents');
        }
    },

    // Delete Medical File
    deleteMedicalFile: async (fileName: string): Promise<ApiResponse> => {
        try {
            const response = await metProAiApi.delete(`/delete/medical_file/${fileName}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error deleting medical file');
        }
    },

    // Delete Patient File
    deletePatientFile: async (fileName: string): Promise<ApiResponse> => {
        try {
            const response = await metProAiApi.delete(`/delete/patient_file/${fileName}`);
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error deleting patient file');
        }
    },

    // Extract and Save PDF (Medical) - Assuming this is your URL upload mechanism
    extractSavePdfMedical: async (urls: string | string[]): Promise<ExtractSavePdfResponse> => {
        try {
            const response = await metProAiApi.post('/extract/save_pdf_medical', { urls });
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error extracting and saving medical PDF from URL');
        }
    },

    // Extract and Save PDF (Patient) - Assuming this is your URL upload mechanism
    extractSavePdfPatient: async (urls: string | string[]): Promise<ExtractSavePdfResponse> => {
        try {
            const response = await metProAiApi.post('/extract/save_pdf_patient', { urls });
            return response.data;
        } catch (error) {
            throw handleApiError(error, 'Error extracting and saving patient PDF from URL');
        }
    },

    // List Medical Documents
    listMedicalDocuments: async (): Promise<{ documents: Document[] }> => {
        try {
            const response = await metProAiApi.get('/medical_documents');
            return response.data as { documents: Document[] };
        } catch (error) {
            throw handleApiError(error, 'Error fetching medical documents');
        }
    },

    // List Patient Documents
    listPatientDocuments: async (): Promise<{ documents: Document[] }> => {
        try {
            const response = await metProAiApi.get('/patient_documents');
            return response.data as { documents: Document[] };
        } catch (error) {
            throw handleApiError(error, 'Error fetching patient documents');
        }
    },
};

// Error handling helper function
const handleApiError = (error: unknown, defaultMessage: string = 'API Error') => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.data) {
            return {
                ...axiosError.response.data,
                status: axiosError.response.status,
                message: axiosError.response.data.error || axiosError.response.data.message || defaultMessage,
            };
        }
        if (axiosError.request) {
            return {
                status: 0,
                message: 'Network error: No response received',
                error: 'NETWORK_ERROR',
            };
        }
    }
    return {
        status: 500,
        message: defaultMessage,
        error: error || 'UNKNOWN_ERROR',
    };
};

export default MetProAiAPI;