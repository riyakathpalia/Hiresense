import { MetProAiAPI } from '@/lib/api/flask-api';
import { MedicalDocumentFile, PatientDocumentFile } from '@/types/api/MetProAiApiProps';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { MetProAiNextAPI } from '../api/next-api';

// Custom hook for resume operations
export const useMedicalDocument = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [medical_documents, setMedicalDocument] = useState<MedicalDocumentFile[]>([]);

    const fetchMedicalDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await MetProAiAPI.listMedicalDocuments();
            setMedicalDocument(response.medical_documents || []);
            return response;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to fetch medical documents');
            } else {
                setError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadMedicalDocuments = useCallback(
        async (files: File[], workspaceName: string) => {
            setLoading(true);
            setError(null);
            console.log('Uploading Medical:', files);

            try {
                const nextApiResponse = await MetProAiNextAPI.uploadMedicalDocumentFiles(files, workspaceName);
                console.log('Medical Documents uploaded:', nextApiResponse);
                // Refresh the resume list
                //await fetchResumes();
                const filePaths = nextApiResponse.files.map((file) => file.savedAs);
                console.log('File paths: (useMetProAi)', filePaths);

                MetProAiAPI.uploadMedicalDocuments(filePaths, workspaceName);
                return nextApiResponse;
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.error || 'Failed to upload medical');
                } else {
                    setError('An unexpected error occurred');
                }
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const deleteMedicalDocument = useCallback(
        async (fileName: string) => {
            setLoading(true);
            setError(null);

            try {
                const response = await MetProAiAPI.deleteMedicalDocument(fileName);

                // Refresh the document list after successful deletion
                await fetchMedicalDocuments();

                return response;
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.error || 'Failed to delete medical document');
                } else {
                    setError('An unexpected error occurred');
                }
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchMedicalDocuments]
    );

    const processMedicalUrls = useCallback(
        async (urls: string, workspaceName: string) => {
            setLoading(true);
            setError(null);
            console.log('Processing Medical URLs:', urls);

            try {
                // Corrected to pass workspaceName as required by the API implementation
                const response = await MetProAiAPI.processMedicalUrls(urls, workspaceName);
                console.log('Processing Medical URLs Response:', response);

                // Refresh the document list after processing URLs
                //await fetchMedicalDocuments();

                return response;
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.error || 'Failed to process medical URLs');
                } else {
                    setError('An unexpected error occurred');
                }
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchMedicalDocuments]
    );

    const deleteMedicalUrl = useCallback(
        async (url: string) => {
            setLoading(true);
            setError(null);

            try {
                // Add this new function to use the delete URL endpoint
                const response = await MetProAiAPI.deleteMedicalUrl(url);

                // Refresh the document list after deletion
                await fetchMedicalDocuments();

                return response;
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.error || 'Failed to delete medical URL');
                } else {
                    setError('An unexpected error occurred');
                }
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchMedicalDocuments]
    );


    return {
        medical_documents,
        loading,
        error,
        fetchMedicalDocuments,
        uploadMedicalDocuments,
        deleteMedicalDocument,
        processMedicalUrls,
        deleteMedicalUrl,
        // getSummary,
    };
};

// Custom hook for job description operations
export const usePatientDocument = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [patient_documents, setPatientDocument] = useState<PatientDocumentFile[]>([]);

    const fetchPatientDocuments = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await MetProAiAPI.listPatientDocuments();
            setPatientDocument(response.patient_documents || []);
            return response;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to fetch patient documents');
            } else {
                setError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadPatientDocuments = useCallback(async (files: File[], workspaceName: string) => {
        setLoading(true);
        setError(null);

        try {
            const nextApiResponse = await MetProAiNextAPI.uploadPatientDocumentFiles(files, workspaceName);
            console.log('Patient Documents uploaded:', nextApiResponse);
            // Refresh the resume list
            //await fetchResumes();
            const filePaths = nextApiResponse.files.map((file) => file.savedAs);
            console.log('File paths: (useMetProAi)', filePaths);
            MetProAiAPI.uploadPatientDocuments(filePaths, workspaceName);
            await fetchPatientDocuments();
            return nextApiResponse;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to upload medical');
            } else {
                setError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    },
        []
    );

    const deletePatientDocument = useCallback(
        async (fileName: string) => {
            setLoading(true);
            setError(null);

            try {
                const response = await MetProAiAPI.deletePatientDocument(fileName);

                // Refresh the document list after successful deletion
                await fetchPatientDocuments();

                return response;
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.error || 'Failed to delete patient document');
                } else {
                    setError('An unexpected error occurred');
                }
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchPatientDocuments]
    );

    const processPatientUrls = useCallback(
        async (urls: string) => {
            setLoading(true);
            setError(null);
            console.log('Processing Patient URLs:', urls);

            try {
                const response = await MetProAiAPI.processPatientUrls(urls);

                // Refresh the document list after processing URLs
                await fetchPatientDocuments();

                return response;
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.error || 'Failed to process patient URLs');
                } else {
                    setError('An unexpected error occurred');
                }
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchPatientDocuments]
    );

    const deletePatientUrl = useCallback(
        async (url: string) => {
            setLoading(true);
            setError(null);

            try {
                // Add this new function to use the delete URL endpoint
                const response = await MetProAiAPI.deletePatientUrl(url);

                // Refresh the document list after deletion
                await fetchPatientDocuments();

                return response;
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.error || 'Failed to delete patient URL');
                } else {
                    setError('An unexpected error occurred');
                }
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [fetchPatientDocuments]
    );

    return {
        patient_documents,
        fetchPatientDocuments,
        loading,
        error,
        uploadPatientDocuments,
        deletePatientDocument,
        processPatientUrls,
        deletePatientUrl,
    };
};

// Custom hook for chat operations
export const useMetProAiChat = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<{ message: string; reply: string }[]>([]);

    const sendMessage = useCallback(async (message: string, medicalSearch: boolean = true, workspace_name: string) => {
        setLoading(true);
        setError(null);

        try {
            // Simplified to match the API implementation
            const reply = await MetProAiAPI.sendChatMessage(message , medicalSearch, workspace_name);

            // Add the message-reply pair to chat history
            setChatHistory((prev) => [...prev, { message, reply }]);

            return reply;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to send message');
            } else {
                setError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearChat = useCallback(() => {
        setChatHistory([]);
    }, []);

    return {
        loading,
        error,
        chatHistory,
        sendMessage,
        clearChat,
    };
};

// Custom hook for chat operations
// export const useHireSenseChat = () => {
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
//     const [chatHistory, setChatHistory] = useState<{ message: string; reply: string }[]>([]);

//     const sendMessage = useCallback(async (message: string, jdSearch: boolean = true, workspace_name: string) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const response = await MetProAiAPI.sendChatMessage(message, jdSearch, workspace_name);

//             setChatHistory((prev) => [...prev, { message, reply: response.reply }]);

//             return response;
//         } catch (err: unknown) {
//             if (axios.isAxiosError(err)) {
//                 setError(err.response?.data?.error || 'Failed to send message');
//             } else {
//                 setError('An unexpected error occurred');
//             }
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const sendKeywordChat = useCallback(async (keyword: string) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const response = await MetProAiAPI.sendKeywordChat(keyword);

//             setChatHistory((prev) => [...prev, { message: `Keyword: ${keyword}`, reply: response.reply }]);

//             return response;
//         } catch (err: unknown) {
//             if (axios.isAxiosError(err)) {
//                 setError(err.response?.data?.error || 'Failed to send keyword chat');
//             } else {
//                 setError('An unexpected error occurred');
//             }
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const clearChat = useCallback(() => {
//         setChatHistory([]);
//     }, []);

//     return {
//         loading,
//         error,
//         chatHistory,
//         sendMessage,
//         sendKeywordChat,
//         clearChat,
//     };
// };

// // Custom hook for system operations
// export const useHireSenseWorkspace = () => {
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     const createNewWorkspace = useCallback(async (workspaceName: string) => {
//         setLoading(true);
//         setError(null);

//         try {
//             const newWorkspaceResponse = await MetProAiNextAPI.createNewWorkspace(workspaceName);
//             console.log('New Workspace Created:', newWorkspaceResponse);
//             return newWorkspaceResponse;
//         } catch (err: unknown) {
//             if (axios.isAxiosError(err)) {
//                 setError(err.response?.data?.error || 'Failed to reset data');
//             } else {
//                 setError('An unexpected error occurred');
//             }
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     return {
//         loading,
//         error,
//         createNewWorkspace,
//     };
// };


// Custom hook for system operations
export const useMetProAiSystem = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const resetAllData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await MetProAiAPI.resetAllData();
            return response;
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Failed to reset data');
            } else {
                setError('An unexpected error occurred');
            }
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        resetAllData,
    };
};

// Combined hook for all HireSense operations
export const useMetProAi = () => {
    const medical_documents = useMedicalDocument();
    const patient_documents = usePatientDocument();
    // const chat = useHireSenseChat();
    const system = useMetProAiSystem();
    // const useWorkspaces = useHireSenseWorkspace();

    return {
        medical_documents,
        patient_documents,
        // chat,
        system,
        // useWorkspaces,
    };
};

export default useMetProAi;