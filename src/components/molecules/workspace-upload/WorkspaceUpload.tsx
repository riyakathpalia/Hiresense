'use client';

import { useWorkspace } from '@/context/WorkspaceContext';
import useMetProAi from '@/lib/hooks/useMetProAi';

import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
    styled,
} from '@mui/material';
import {
    FileText,
    Link as LinkIcon,
    Upload as UploadIcon,
    X
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../atoms/button/CustomButton';
import { CardFooter } from '../Card/Card';

const StyledDropZone = styled('div')(({ theme }) => ({
    border: '2px dashed',
    borderColor: theme.palette.divider,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.action.hover
    },
    transition: theme.transitions.create(['background-color', 'border-color'])
}));

type UploadType = 'medicalDocument' | 'patientDocument';

// Define the type for the file information we get back from the server
interface UploadFileResponse {
    originalname: string;
    savedAs: string; //  relative path within the uploads directory
    size: number;
    type: string;
    url: string; // Full URL to access the file
}

// Define the structure of the upload response
interface UploadResponse {
    message: string;
    processedFiles: number;
    files: UploadFileResponse[];
}

interface WorkspaceUploadProps {
    type: UploadType;
    onUploadSuccess?: (response: UploadResponse) => void; // Use the defined type here
}

const MAX_FILE_SIZE_MB = 10;

const WorkspaceUpload: React.FC<WorkspaceUploadProps> = ({
    type,
    // onUploadSuccess,
}) => {
    const { activeWorkspace } = useWorkspace();
    const { enqueueSnackbar } = useSnackbar();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState('');
    const [isUploadingUrl, setIsUploadingUrl] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const { uploadMedicalDocuments, uploadPatientDocuments } = useMetProAi();
    const [uploadedFiles, setUploadedFiles] = useState<UploadFileResponse[]>([]); // State for uploaded files
    const { deleteMedicalDocument, deletePatientDocument } = useMetProAi();


    // Load uploaded files from localStorage on component mount
    useEffect(() => {
        if (activeWorkspace?.name) {
            const savedFilesKey = `uploadedFiles_${activeWorkspace.name}_${type}`;
            const savedFiles = localStorage.getItem(savedFilesKey);
            if (savedFiles) {
                try {
                    setUploadedFiles(JSON.parse(savedFiles));
                } catch (error) {
                    console.error('Error parsing saved files:', error);
                    // Handle error, e.g., clear the invalid data
                    localStorage.removeItem(savedFilesKey);
                }
            }
        }
    }, [activeWorkspace?.name, type]);

    // Save uploaded files to localStorage whenever they change
    useEffect(() => {
        if (activeWorkspace?.name) {
            const savedFilesKey = `uploadedFiles_${activeWorkspace.name}_${type}`;
            localStorage.setItem(savedFilesKey, JSON.stringify(uploadedFiles));
        }
    }, [uploadedFiles, activeWorkspace?.name, type]);

    const isValidFile = (file: File) => {
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        const isValidSize = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
        return validTypes.includes(file.type) && isValidSize;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(isValidFile);
            if (newFiles.length < e.target.files.length) {
                enqueueSnackbar('Some files were ignored due to size or type restrictions.', { variant: 'warning' });
            }
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files).filter(isValidFile);
            if (newFiles.length < e.dataTransfer.files.length) {
                enqueueSnackbar('Some files were ignored due to size or type restrictions.', { variant: 'warning' });
            }
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileUpload = async () => {
        if (!activeWorkspace?.name) {
            enqueueSnackbar('Please select a workspace first.', { variant: 'warning' });
            return;
        }

        if (files.length === 0) {
            enqueueSnackbar(`Please select at least one ${type === 'medicalDocument' ? 'medical' : 'patient'} document to upload.`, {
                variant: 'error',
            });
            return;
        }

        setUploading(true);

        const medicalDocUploadHandler = type === "medicalDocument" ? uploadMedicalDocuments : uploadPatientDocuments;

        try {

            const response = await medicalDocUploadHandler(files, activeWorkspace.name);

            console.log(`${type} File Upload response:`, response);
            setFiles([]); // Clear local file selection

        } catch (error: unknown) {
            let message = 'An error occurred.';
            if (error instanceof Error) {
                message = error.message;
            }

            console.error('File Upload error:', error);
            enqueueSnackbar(`Failed to upload ${type === 'medicalDocument' ? 'medical' : 'patient'} documents. ${message}`, {
                variant: 'error',
            });
        } finally {
            setUploading(false);
        }

    };


    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const {
        extractMedicalPdf,
        extractPatientPdf,
    } = useMetProAi();

    const handleUrlUpload = async () => {
        if (!activeWorkspace?.name) {
            enqueueSnackbar('Please select a workspace first.', { variant: 'warning' });
            return;
        }

        if (!url.trim()) {
            enqueueSnackbar('Please enter a valid URL to upload.', { variant: 'error' });
            return;
        }

        setIsUploadingUrl(true);
        try {
            let response;
            if (type === 'medicalDocument') {
                response = await extractMedicalPdf(url, activeWorkspace.name);
            } else {
                response = await extractPatientPdf(url, activeWorkspace.name);
            }

            enqueueSnackbar('File from URL uploaded successfully', {
                variant: 'success',
            });

            setUrl('');
            // Optionally: Refresh file list if needed
        } catch (error: unknown) {
            console.error('URL Upload error:', error);
            const message = error instanceof Error ? error.message : 'An error occurred.';
            enqueueSnackbar(`Failed to upload from URL. ${message}`, { variant: 'error' });
        } finally {
            setIsUploadingUrl(false);
        }
    };


    const getDragDropText = () => {
        return type === 'medicalDocument'
            ? 'Drag and drop medical files here or click to browse'
            : 'Drag and drop patient files here or click to browse';
    };



    const handleDeleteUploadedFile = async (fileName: string) => {
        try {
            if (type === 'medicalDocument') {
                await deleteMedicalDocument(fileName);
            } else {
                await deletePatientDocument(fileName);
            }

            // Remove from local state
            setUploadedFiles(prev => prev.filter(f => f.originalname !== fileName));

            // Update localStorage
            if (activeWorkspace?.name) {
                const savedFilesKey = `uploadedFiles_${activeWorkspace.name}_${type}`;
                const updatedFiles = uploadedFiles.filter(f => f.originalname !== fileName);
                localStorage.setItem(savedFilesKey, JSON.stringify(updatedFiles));
            }

            enqueueSnackbar('File deleted successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to delete file', { variant: 'error' });
            console.error('Delete error:', error);
        }
    };

    return (
        <Card sx={{ width: '100%', border: 1, borderColor: 'divider' }}>
            <CardHeader
                title={
                    <Typography variant="h6" component="div" color="white">
                        Upload {type === 'medicalDocument' ? 'Medical' : 'Patient'} Documents
                    </Typography>
                }
                sx={{ py: 1.5, textAlign: 'center' }}
            />
            <CardContent>
                <Typography variant="subtitle1" gutterBottom color="textSecondary">
                    Upload Files
                </Typography>
                <StyledDropZone
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById(`workspace-input-${type}`)?.click()}
                    sx={{
                        backgroundColor: dragActive ? 'action.selected' : 'transparent',
                        borderColor: dragActive ? 'primary.main' : 'divider',
                    }}
                    aria-label="File upload area"
                >
                    <input
                        id={`workspace-input-${type}`}
                        type="file"
                        multiple
                        accept=".pdf,.docx,.doc,.txt"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <UploadIcon size={48} color="primary" />
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        {getDragDropText()}
                    </Typography>
                </StyledDropZone>

                {files.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                            Selected Files  ({files.length})
                        </Typography>
                        <List
                            dense
                            sx={{
                                maxHeight: 160,
                                overflow: 'auto',
                                pr: 1,
                                bgcolor: 'action.hover',
                            }}
                        >
                            {files.map((file, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            startIcon={<X size={16} />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(index);
                                            }}
                                            sx={{ ml: 1 }}
                                        >
                                            Delete
                                        </Button>
                                    }
                                    sx={{ py: 0.5 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <FileText size={16} color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={file.name}
                                        secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                <Typography variant="subtitle1" gutterBottom mt={3} color="textSecondary">
                    Upload from URL
                </Typography>
                <TextField
                    fullWidth
                    label="Enter Document URL"
                    variant="outlined"
                    value={url}
                    onChange={handleUrlChange}
                    aria-label="Document URL input"
                    sx={{ mb: 2 }}
                />

                {/* Display Uploaded Files */}
                {uploadedFiles.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h6" gutterBottom>
                            Uploaded Files
                        </Typography>
                        <List>
                            {uploadedFiles.map((file, index) => (
                                <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <FileText size={16} />
                                        <ListItemText
                                            primary={file.originalname}
                                            secondary={`${(file.size / 1024).toFixed(2)} KB, ${file.type}`}
                                        />
                                    </Box>
                                    <Box display="flex" gap={1}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="error"
                                            startIcon={<X size={16} />}
                                            onClick={() => handleDeleteUploadedFile(file.originalname)}
                                            sx={{ ml: 1 }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            component="a"
                                            href={file.url}
                                            target="_blank"
                                            startIcon={<LinkIcon size={16} />}
                                        >
                                            View
                                        </Button>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

            </CardContent>
            <CardFooter>
                <Box display="flex" justifyContent="space-between" width="100%" gap={1}>
                    <CustomButton
                        variant="outline"
                        onClick={() => setFiles([])}
                        disabled={files.length === 0}
                        size="small"
                    >
                        Clear Files
                    </CustomButton>
                    <CustomButton
                        variant="primary"
                        onClick={handleFileUpload}
                        disabled={files.length === 0 || uploading}
                        startIcon={!uploading && <UploadIcon size={16} />}
                        size="small"
                    >
                        {uploading ? `Uploading  ...` : `Upload Files`}
                    </CustomButton>
                    <CustomButton
                        variant="primary"
                        color="primary"
                        onClick={handleUrlUpload}
                        disabled={!url.trim() || isUploadingUrl}
                        startIcon={!isUploadingUrl && <LinkIcon size={16} />}
                        size="small"
                    >
                        {isUploadingUrl ? `Uploading from URL ...` : `Upload from URL`}
                    </CustomButton>
                </Box>
            </CardFooter>
        </Card>
    );
};

export default WorkspaceUpload;