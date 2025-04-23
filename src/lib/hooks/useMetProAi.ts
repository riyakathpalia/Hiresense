import { MetProAiAPI } from '@/lib/api/flask-api'; // Assuming your Flask API service
import axios from 'axios';
import { useCallback, useState } from 'react';
import { MetProAiNextAPI } from '../api/next-api';
import { MedicalDocument } from "@/types/medicalDocument";
import { PatientDocument } from "@/types/patientDocument";


export const useMetProAi = () => {
    const [medicalDocumentsData, setMedicalDocumentsData] = useState<MedicalDocument[]>([]);
    const [medicalDocumentsLoading, setMedicalDocumentsLoading] = useState(false);
    const [medicalDocumentsError, setMedicalDocumentsError] = useState<string | null>(null);

    const [patientDocumentsData, setPatientDocumentsData] = useState<PatientDocument[]>([]);
    const [patientDocumentsLoading, setPatientDocumentsLoading] = useState(false);
    const [patientDocumentsError, setPatientDocumentsError] = useState<string | null>(null);

    // Corrected fetchMedicalDocuments -  No direct equivalent in OpenAPI,  Needs implementation
    const fetchMedicalDocuments = useCallback(async () => {
        setMedicalDocumentsLoading(true);
        setMedicalDocumentsError(null);
        try {
            //  This needs to be implemented on the backend and added to OpenAPI
            const response = await MetProAiAPI.listMedicalDocuments();
            setMedicalDocumentsData(response.documents || []);
            return response;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setMedicalDocumentsError(err.response?.data?.error || 'Failed to fetch medical documents');
            } else {
                setMedicalDocumentsError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setMedicalDocumentsLoading(false);
        }
    }, []);

    // Corrected uploadMedicalDocuments
    const uploadMedicalDocuments = useCallback(
        async (files: File[], workspaceName: string) => {
            setMedicalDocumentsLoading(true);
            setMedicalDocumentsError(null);
            console.log('Uploading medical documents:', files);

            try {
                // 1. Upload via Next.js API (for handling file storage)
                const nextApiResponse = await MetProAiNextAPI.uploadMedicalDocumentFiles(files, workspaceName);
                console.log('Medical documents uploaded (Next API):', nextApiResponse);

                // 2.  Prepare file paths for the Flask API (adjust as needed based on your Next.js API response)
                const filePaths = nextApiResponse.files.map((file) => file.savedAs);
                console.log("File paths : (upload Medical  Doc Hook) ", filePaths)

                // 3.  Call Flask API to process the uploaded files.  Adapt this to match your Flask API.
                //    The OpenAPI spec defines this endpoint to receive an array of file *paths*, not File objects.
                const flaskResponse = await MetProAiAPI.uploadMedicalDocuments({
                    file_paths: filePaths,
                });
                console.log("Flask API response", flaskResponse)

                return flaskResponse; // Or return relevant data from flaskResponse if needed
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setMedicalDocumentsError(err.response?.data?.error || 'Failed to upload medical documents');
                } else {
                    setMedicalDocumentsError('An unexpected error occurred');
                }
                throw err;
            } finally {
                setMedicalDocumentsLoading(false);
            }
        },
        []
    );

    // Corrected deleteMedicalDocument
    const deleteMedicalDocument = useCallback(async (fileName: string) => {
        setMedicalDocumentsLoading(true);
        setMedicalDocumentsError(null);
        try {
            const response = await MetProAiAPI.deleteMedicalFile(fileName); // Corrected to deleteMedicalFile
            // Remove the deleted item from the state
            setMedicalDocumentsData(prev => prev.filter(item => item.name !== fileName));
            return response;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setMedicalDocumentsError(err.response?.data?.error || 'Failed to delete medical file');
            } else {
                setMedicalDocumentsError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setMedicalDocumentsLoading(false);
        }
    }, []);

    // Corrected extractMedicalPdf
    const extractMedicalPdf = useCallback(async (urls: string | string[]) => {
        setMedicalDocumentsLoading(true);
        setMedicalDocumentsError(null);
        try {
            const response = await MetProAiAPI.extractMedicalPDF(urls);
            return response;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setMedicalDocumentsError(err.response?.data?.error || 'Failed to extract medical PDF');
            } else {
                setMedicalDocumentsError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setMedicalDocumentsLoading(false);
        }
    }, []);

    // Corrected fetchPatientDocuments - No direct equivalent in OpenAPI, Needs implementation
    const fetchPatientDocuments = useCallback(async () => {
        setPatientDocumentsLoading(true);
        setPatientDocumentsError(null);
        try {
            //  This needs to be implemented on the backend and added to OpenAPI
            const response = await MetProAiAPI.listPatientDocuments();
            setPatientDocumentsData(response.documents || []);
            return response;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setPatientDocumentsError(err.response?.data?.error || 'Failed to fetch patient documents');
            } else {
                setPatientDocumentsError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setPatientDocumentsLoading(false);
        }
    }, []);

    // Corrected uploadPatientDocuments
    const uploadPatientDocuments = useCallback(
        async (files: File[], workspaceName: string) => {
            setPatientDocumentsLoading(true);
            setPatientDocumentsError(null);
            console.log('Uploading patient documents:', files);

            try {
                // 1. Upload via Next.js API (for handling file storage)
                const nextApiResponse = await MetProAiNextAPI.uploadPatientDocumentFiles(files, workspaceName);
                console.log('Patient documents uploaded (Next API):', nextApiResponse);

                // 2. Prepare file paths
                const filePaths = nextApiResponse.files.map((file) => file.savedAs);
                console.log("File paths : (upload Patient  Doc Hook) ", filePaths)

                // 3. Call Flask API, passing file paths
                console.log("Uploading patient documents: (API - Flask)", { file_paths: filePaths });
                const flaskResponse = await MetProAiAPI.uploadPatientDocuments({
                    file_paths: filePaths,
                });
                console.log('Patient documents uploaded (Flask API):', flaskResponse);


                return nextApiResponse; // Or return data from Flask if needed.
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setPatientDocumentsError(err.response?.data?.error || 'Failed to upload patient documents');
                } else {
                    setPatientDocumentsError('An unexpected error occurred');
                }
                throw err;
            } finally {
                setPatientDocumentsLoading(false);
            }
        },
        []
    );

    // Corrected deletePatientDocument
    const deletePatientDocument = useCallback(async (fileName: string) => {
        setPatientDocumentsLoading(true);
        setPatientDocumentsError(null);
        try {
            const response = await MetProAiAPI.deletePatientFile(fileName);  // Corrected to deletePatientFile
            setPatientDocumentsData(prev => prev.filter(item => item.name !== fileName));
            return response;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setPatientDocumentsError(err.response?.data?.error || 'Failed to delete patient file');
            } else {
                setPatientDocumentsError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setPatientDocumentsLoading(false);
        }
    }, []);

    // Corrected extractPatientPdf
    const extractPatientPdf = useCallback(async (urls: string | string[]) => {
        setPatientDocumentsLoading(true);
        setPatientDocumentsError(null);
        try {
            const response = await MetProAiAPI.extractPatientPDF(urls);
            return response;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setPatientDocumentsError(err.response?.data?.error || 'Failed to extract patient PDF');
            } else {
                setPatientDocumentsError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setPatientDocumentsLoading(false);
        }
    }, []);

    // ... other hooks for chat, workspace, system ...

    return {
        medicalDocumentsData,
        medicalDocumentsLoading,
        medicalDocumentsError,
        fetchMedicalDocuments,
        uploadMedicalDocuments,
        deleteMedicalDocument,
        extractMedicalPdf,
        uploadPatientDocuments,
        patientDocumentsData,
        patientDocumentsLoading,
        patientDocumentsError,
        fetchPatientDocuments,
        deletePatientDocument,
        extractPatientPdf,

    };
};

export default useMetProAi;
