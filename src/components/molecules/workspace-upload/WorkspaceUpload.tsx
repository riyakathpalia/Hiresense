'use client';

import React, { useState } from 'react';
import {
    Upload as UploadIcon,
    X,
    FileText,
    Link
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { CardFooter } from '../Card/Card';
import CustomButton from '../../atoms/button/CustomButton';
import { useWorkspace } from '@/context/WorkspaceContext';
import useMetProAi from '@/lib/hooks/useMetProAi';

type UploadType = 'medicalDocument' | 'patientDocument';

interface WorkspaceUploadProps {
    type: UploadType;
    onUploadSuccess?: (response: any) => void;
}

const MAX_FILE_SIZE_MB = 10;

const WorkspaceUpload: React.FC<WorkspaceUploadProps> = ({
    type,
    onUploadSuccess,
}) => {
    const { activeWorkspace } = useWorkspace();
    const { enqueueSnackbar } = useSnackbar();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState('');
    const [isUploadingUrl, setIsUploadingUrl] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const { medicalDocuments, patientDocuments } = useMetProAi();

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

    // Handle file upload button click
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

        try {
            let response;
            if (type === 'medicalDocument') {
                response = await medicalDocuments.upload(files, activeWorkspace.name);
            } else {
                response = await patientDocuments.upload(files, activeWorkspace.name);
            }
            console.log(`${type} File Upload response:`, response);
            onUploadSuccess?.(response);
            enqueueSnackbar(`${type === 'medicalDocument' ? 'Medical' : 'Patient'} documents uploaded successfully to MetProAi!`, {
                variant: 'success',
            });
            setFiles([]); // Clear files after successful upload
        } catch (error: any) {
            console.error('File Upload error:', error);
            enqueueSnackbar(`Failed to upload ${type === 'medicalDocument' ? 'medical' : 'patient'} documents to MetProAi.  ${error.message || 'An error occurred.'}`, { variant: 'error' });
        } finally {
            setUploading(false);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleUrlUpload = async () => {
        if (!activeWorkspace?.name) {
            enqueueSnackbar('Please select a workspace first.', { variant: 'warning' });
            return;
        }

        if (!url.trim()) {
            enqueueSnackbar(`Please enter a valid URL to upload to MetProAi.`, { variant: 'error' });
            return;
        }

        setIsUploadingUrl(true);
        try {
            let response;
            if (type === 'medicalDocument') {
                response = await medicalDocuments.extractPdf(url);
            } else {
                response = await patientDocuments.extractPdf(url);
            }
            console.log(`${type} URL Upload response:`, response);
            onUploadSuccess?.(response)
            enqueueSnackbar(`${type === 'medicalDocument' ? 'Medical' : 'Patient'} document from URL uploaded successfully to MetProAi!`, {
                variant: 'success',
            });
            setUrl('');
        } catch (error: any) {
            console.error('URL Upload error:', error);
            enqueueSnackbar(`Failed to upload ${type === 'medicalDocument' ? 'medical' : 'patient'} document from URL to MetProAi. ${error.message || 'An error occurred.'}`, { variant: 'error' });
        } finally {
            setIsUploadingUrl(false);
        }
    };

    const getDragDropText = () => {
        return type === 'medicalDocument'
            ? 'Drag and drop medical files here or click to browse'
            : 'Drag and drop patient files here or click to browse';
    };

    return (
        <Card sx={{ width: '100%' }}>
            <CardHeader
                title={
                    <Typography variant="h6" component="div" color="white">
                        Upload {type === 'medicalDocument' ? 'Medical' : 'Patient'} Documents to MetProAi
                    </Typography>
                }
                sx={{ py: 1.5, textAlign: 'center' }}
            />
            <CardContent>
                <Typography variant="subtitle1" gutterBottom color="textSecondary">
                    Upload Files
                </Typography>
                <Box
                    border={1}
                    borderColor="divider"
                    borderRadius="md"
                    padding={2}
                    textAlign="center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                    onClick={() => document.getElementById(`workspace-input-${type}`)?.click()}
                    sx={{
                        cursor: 'pointer',
                        backgroundColor: dragActive ? 'action.selected' : 'transparent',
                        transition: 'background-color 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
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
                </Box>

                {files.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                            Selected Files for MetProAi ({files.length})
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
                                        <IconButton
                                            edge="end"
                                            aria-label="Remove file"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(index);
                                            }}
                                        >
                                            <X size={16} />
                                        </IconButton>
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
                    Upload from URL to MetProAi
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
                        onClick={handleFileUpload} // Use handleFileUpload here
                        disabled={files.length === 0 || uploading}
                        startIcon={!uploading && <UploadIcon size={16} />}
                        size="small"
                    >
                        {uploading ? `Uploading to MetProAi...` : `Upload Files`}
                    </CustomButton>
                    <CustomButton
                        variant="primary"
                        color="primary"
                        onClick={handleUrlUpload}
                        disabled={!url.trim() || isUploadingUrl}
                        startIcon={!isUploadingUrl && <Link size={16} />}
                        size="small"
                    >
                        {isUploadingUrl ? `Uploading from URL to MetProAi...` : `Upload from URL`}
                    </CustomButton>
                </Box>
            </CardFooter>
        </Card>
    );
};

export default WorkspaceUpload;
