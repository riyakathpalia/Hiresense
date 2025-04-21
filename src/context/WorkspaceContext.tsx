'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { handleApiError } from '@/utils/apiErrorHandling';

// Define the types
interface Folder {
    id: string;
    name: string;
    type: 'resume' | 'jd';
    children: (Folder | File)[];
}

interface File {
    id: string;
    name: string;
    type: 'file';
    fileType: string;
    url: string;
}

interface Collaborator {
    id: string;
    name: string;
    email: string;
}

export interface Workspace { // Export the Workspace interface
    id: string;
    name: string;
    folders: Folder[];
    createdAt: Date;
    updatedAt: Date;
    collaborators: Collaborator[];
    type?: 'resume' | 'jd';
    filePath?: string;
}

interface WorkspaceContextType {
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    setActiveWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
    addWorkspace: (workspace: Workspace) => void;
    deleteWorkspace: (workspaceId: string) => void;
}

// Sample data - REMOVED
// const sampleWorkspaces: Workspace[] = [
//     {
//         id: '1',
//         name: 'Engineering Team',
//         folders: [
//             {
//                 id: '1',
//                 name: 'Software Engineers',
//                 type: 'resume',
//                 children: [
//                     {
//                         id: '1-1',
//                         name: 'Frontend Developers',
//                         type: 'resume',
//                         children: [
//                             { id: 'f1', name: 'John Smith Resume.pdf', type: 'file', fileType: 'pdf', url: '#' },
//                             { id: 'f2', name: 'Jane Doe Resume.docx', type: 'file', fileType: 'docx', url: '#' },
//                         ]
                    //     },
                    //     {
                    //         id: '1-2',
                    //         name: 'Backend Developers',
                    //         type: 'resume',
                    //         children: [
                    //             { id: 'f3', name: 'Alex Johnson Resume.pdf', type: 'file', fileType: 'pdf', url: '#' },
                    //         ]
                    //     }
                    // ]
            // },
            // {
            //     id: '2',
            //     name: 'Engineering Jobs',
            //     type: 'jd',
            //     children: [
            //         { id: 'f4', name: 'Senior Software Engineer JD.pdf', type: 'file', fileType: 'pdf', url: '#' },
            //         { id: 'f5', name: 'Junior Developer JD.docx', type: 'file', fileType: 'docx', url: '#' },
            //     ]
            // }
        // ],
        // createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        // updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        // collaborators: [
        //     { id: 'u1', name: 'Sophia Wilson', email: 'sophia@example.com' },
        //     { id: 'u2', name: 'Marcus Lee', email: 'marcus@example.com' },
        // ],
    // },
    // {
    //     id: '2',
    //     name: 'Marketing Team',
    //     folders: [
    //         {
    //             id: '3',
    //             name: 'Marketing Candidates',
    //             type: 'resume',
    //             children: [
    //                 { id: 'f6', name: 'Sarah Miller Resume.pdf', type: 'file', fileType: 'pdf', url: '#' },
    //             ]
    //         },
    //         {
    //             id: '4',
    //             name: 'Marketing Positions',
    //             type: 'jd',
    //             children: [
    //                 { id: 'f7', name: 'Social Media Manager JD.docx', type: 'file', fileType: 'docx', url: '#' },
    //             ]
    //         }
    //     ],
    //     createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    //     updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    //     collaborators: [
    //         { id: 'u3', name: 'James Thompson', email: 'james@example.com' },
    //     ],
    // }
//];


export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const savedWorkspaces = localStorage.getItem('workspaces');
                const savedActive = localStorage.getItem('activeWorkspace');

                if (savedWorkspaces) {
                    const parsed = JSON.parse(savedWorkspaces);
                    // Convert string dates back to Date objects
                    const withDates = parsed.map((w: any) => ({
                        ...w,
                        createdAt: new Date(w.createdAt),
                        updatedAt: new Date(w.updatedAt)
                    }));
                    setWorkspaces(withDates);
                }

                if (savedActive) {
                    const parsed = JSON.parse(savedActive);
                    setActiveWorkspace({
                        ...parsed,
                        createdAt: new Date(parsed.createdAt),
                        updatedAt: new Date(parsed.updatedAt)
                    });
                }
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            } finally {
                setIsInitialized(true);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            localStorage.setItem('workspaces', JSON.stringify(workspaces));
            if (activeWorkspace) {
                localStorage.setItem('activeWorkspace', JSON.stringify(activeWorkspace));
            }
        }
    }, [workspaces, activeWorkspace, isInitialized]);

    const addWorkspace = (workspace: Workspace) => {
        setWorkspaces(prev => [...prev, workspace]);
        setActiveWorkspace(workspace);
    };

    const deleteWorkspace = (workspaceId: string) => {
        setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
        if (activeWorkspace?.id === workspaceId) {
            const remaining = workspaces.filter(w => w.id !== workspaceId);
            setActiveWorkspace(remaining[0] || null);
        }
    };

    // Don't render children until initialized to avoid flash of default state
    if (!isInitialized) {
        return null; // or a loading spinner
    }

    return (
        <WorkspaceContext.Provider value={{
            workspaces,
            activeWorkspace,
            setActiveWorkspace,
            addWorkspace,
            deleteWorkspace
        }}>
            {children}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspace = () => {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
};

interface UploadFile {
    savedAs: string;
}

interface UploadResponse {
    message: string; // Success message
    processedFiles: number; // Number of files processed
    files: UploadFile[]; // Array of uploaded file details
}

// Create an Axios instance for the Next.js backend (MetProAi)
const nextMetProAiApi = axios.create({
    baseURL: '/api', // Adjust this base URL if your MetProAi API routes are different
    timeout: 30000, // 30 seconds timeout
});

// Response interceptor for handling responses and errors globally
nextMetProAiApi.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        // Log errors for debugging
        console.error('MetProAi API Error:', error);

        // Handle specific HTTP errors
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
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
            // The request was made but no response was received
            console.error('MetProAi Network Error: No response received', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
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
                formData.append('file', file, file.name);
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

