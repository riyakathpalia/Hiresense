import { UploadResponse } from '@/types/api/MetProAiApiProps';
import { createContext, useContext, useEffect, useState } from 'react';

interface FileUploadContextType {
    uploadResponse: string | null | UploadResponse;
    setUploadResponse: (response: string | null) => void;
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export const FileUploadProvider = ({ children }: { children: React.ReactNode }) => {
    const [uploadResponse, setUploadResponse] = useState<string | UploadResponse | null>(null);


    // Debug effect
    useEffect(() => {
        console.log("UploadResponse updated:", uploadResponse);
    }, [uploadResponse]);

    return (
        <FileUploadContext.Provider value={{ uploadResponse, setUploadResponse }}>
            {children}
        </FileUploadContext.Provider>
    );
};

export const useFileUpload = () => {
    const context = useContext(FileUploadContext);
    if (!context) {
        throw new Error('useFileUpload must be used within a FileUploadProvider');
    }
    return context;
};
