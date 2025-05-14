import CustomButton from '@/components/atoms/button/CustomButton';
import { useFileUpload } from '@/context/FileUploadContext';
import { useMetProAiContext } from '@/context/MetProAiContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { handleFileInputChange, handleUrlInputChange } from '@/utils/fileUtils';
import {
    Box,
    Card,
    CardContent,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    styled,
    TextField,
    Typography
} from '@mui/material';
import {
    FileInput,
    FileText,
    Upload as UploadIcon,
    X
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { CardFooter } from '../Card/Card';

// Upload Folder Styled DropZone
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
    transition: theme.transitions.create('background-color')
}));

type UploadType = 'patient_documents' | 'medical_documents';

interface WorkspaceUploadProps {
    type: UploadType;
    onSuccess?: (response: string) => void;
}

const traverseFileTree = (item: FileSystemEntry, fileList: File[]) => {
    if (item.isFile) {
        (item as FileSystemFileEntry).file((file: File) => {
            fileList.push(file);
        });
    } else if (item.isDirectory) {
        const dirReader = (item as FileSystemDirectoryEntry).createReader();
        dirReader.readEntries((entries: FileSystemEntry[]) => {
            for (const entry of entries) {
                traverseFileTree(entry, fileList);
            }
        });
    }
};


const WorkspaceUpload: React.FC<WorkspaceUploadProps> = ({ type, onSuccess }) => {
    const { activeWorkspace, refreshWorkspaces } = useWorkspace();
    const { enqueueSnackbar } = useSnackbar();
    const { medical_documents, patient_documents } = useMetProAiContext();
    const [files, setFiles] = useState<File[]>([]); // Scoped to each instance
    const [uploading, setUploading] = useState(false);
    const [isURLMode, setIsURLMode] = useState(false); // Toggle between file and URL mode
    const [urls, setUrls] = useState('');
    const [newURL, setNewURL] = useState('');
    const { setUploadResponse } = useFileUpload();

    // Handle file input change
    // This function is called when files are selected through the file input or dropped into the drop zone
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleURLInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewURL(event.target.value);
    };

    const addURL = () => {
        console.log(urls)
        if (newURL.trim()) {
            setUrls(newURL.trim());
            setNewURL('');
        }
    };

    // const removeURL = (index: number) => {
    //     setUrls((prev) => prev.filter((_, i) => i !== index));
    // };

    // Handle drag over event
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    // Handle drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const items = e.dataTransfer.items;
        const files: File[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i].webkitGetAsEntry();
            if (item) {
                traverseFileTree(item, files);
            }
        }

        // Update the state after processing all files
        setTimeout(() => {
            setFiles((prev) => [...prev, ...files]);
        }, 100); // Delay to ensure all files are processed
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    // Handle URL upload
    const handleUrlUpload = async () => {
        if (urls === undefined || urls.trim() === '') {
            enqueueSnackbar(`Please add at least one URL to upload.`, { variant: 'error' });
            return;
        }

        const processUrls = type === 'medical_documents'
            ? medical_documents.processMedicalUrls
            : patient_documents.processPatientUrls;

        setUploading(true);

        try {
            const response = await handleUrlInputChange(
                urls,
                processUrls,
                activeWorkspace?.name || 'defaultWorkspace'
            );

            console.log(`${type} URL Upload response:`, response);

            if (response) {
                refreshWorkspaces();
                console.log('Upload response (URL):', response);
                setUploadResponse(JSON.stringify(response));
                onSuccess?.(JSON.stringify(response));
            }

            enqueueSnackbar(
                `${type === 'medical_documents' ? 'Medical Documents' : 'Patient Documents'} uploaded successfully from URLs!`,
                { variant: 'success' }
            );

            setUrls('');
        } catch (error) {
            setUploadResponse(JSON.stringify(error));
            console.error('URL Upload error:', error);
            enqueueSnackbar(
                `Failed to upload ${type === 'medical_documents' ? 'medical' : 'patient'} from URLs.`,
                { variant: 'error' }
            );
        } finally {
            setUploading(false);
        }
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (files.length === 0) {
            console.log('No files selected for upload');
            enqueueSnackbar(
                `Please select at least one ${type === 'medical_documents' ? 'medical' : 'patient'} document to upload.`,
                { variant: 'error' }
            );
            return;
        }

        const uploadHandler = type === 'medical_documents'
            ? medical_documents.uploadMedicalDocuments
            : patient_documents.uploadPatientDocuments;

        setUploading(true);

        try {
            const response = await handleFileInputChange(
                files,
                uploadHandler,
                activeWorkspace?.name || 'defaultWorkspace'
            );

            console.log(`${type} File Upload response:`, response);

            if (response) {
                refreshWorkspaces();
                console.log('Upload response: (workspaceUpload)', response);
                setUploadResponse(JSON.stringify(response));
                onSuccess?.(JSON.stringify(response));
            }

            enqueueSnackbar(
                `${type === 'medical_documents' ? 'Medical' : 'Patient'} documents uploaded successfully!`,
                { variant: 'success' }
            );

            setFiles([]); // Clear files after successful upload
        } catch (error) {
            setUploadResponse(JSON.stringify(error));
            console.error('Upload error:', error);
            enqueueSnackbar(
                `Failed to upload ${type === 'medical_documents' ? 'medical' : 'patient'} documents.`,
                { variant: 'error' }
            );
        } finally {
            setUploading(false);
        }
    };

    // Main upload handler that calls the appropriate upload function based on mode
    const handleUpload = async () => {
        if (isURLMode) {
            await handleUrlUpload();
        } else {
            await handleFileUpload();
        }
    };

    return (
        <Card sx={{ width: '100%' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2">
                        {isURLMode ? 'URL Mode Enabled' : 'File Mode Enabled'}
                    </Typography>
                    <CustomButton
                        variant="outline"
                        size="small"
                        onClick={() => setIsURLMode((prev) => !prev)}
                    >
                        {isURLMode ? 'Switch to File Mode' : 'Switch to URL Mode'}
                    </CustomButton>
                </Box>

                {isURLMode ? (
                    <Box>
                        <Box
                            display="flex"
                            alignItems="center"
                            mb={2}
                            sx={{
                                '& .MuiFormLabel-root.Mui-focused': { // Target the focused label
                                    color: 'white', // Replace with your desired color
                                },
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Enter URL"
                                value={newURL}
                                onChange={handleURLInputChange}
                                size="small"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        addURL();
                                    }
                                }}
                                sx={{
                                    '& .MuiInputBase-input:focus': { // Target the input element when focused
                                        color: 'white', // Your desired text color when focused
                                    },
                                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white', // Outline color when focused
                                    },
                                }}
                            />
                            <CustomButton
                                variant="outline"
                                size="small"
                                onClick={addURL}
                                sx={{ ml: 1 , width: '100px' }}
                            >
                                Add URL
                            </CustomButton>
                        </Box>
                            <Box mt={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Selected URLs ({urls})
                                </Typography>
                                <List dense sx={{ maxHeight: 160, overflow: 'auto', pr: 1, bgcolor: 'action.hover' }}>
                                    
                                        <ListItem
                                            secondaryAction={
                                                <IconButton
                                                    edge="end"
                                                    //onClick={() => removeURL(index)}
                                                >
                                                    <X size={16} />
                                                </IconButton>
                                            }
                                            sx={{ py: 0.5 }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                <FileText size={16} color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary={urls} />
                                        </ListItem>
                                </List>
                            </Box>
                    </Box>
                ) : (
                    <Box>
                        <StyledDropZone
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById(`workspace-input-${type}`)?.click()}
                        >
                            <input
                                id={`workspace-input-${type}`}
                                type="file"
                                multiple
                                accept={type === 'medical_documents' ? '.pdf,.docx,.doc,.rtf,.txt' : '.pdf,.docx,.doc,.txt'}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <Typography variant="h6" gutterBottom>
                                Drop {type === 'medical_documents' ? 'medical documents' : 'patient documents'} here or click to browse
                            </Typography>
                        </StyledDropZone>

                        {files.length > 0 && (
                            <Box mt={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Selected {type === 'medical_documents' ? 'medical documents' : 'patient documents'} ({files.length})
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
                                                {type === 'medical_documents' ? <FileText size={16} color="primary" /> : <FileInput size={16} color="primary" />}
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
                    </Box>
                )}
            </CardContent>
            <CardFooter>
                <Box display="flex" gap={1}>
                    {!isURLMode && (
                        <CustomButton
                            variant="outline"
                            onClick={() => setFiles([])}
                            disabled={files.length === 0}
                            size="small"
                        >
                            Clear All
                        </CustomButton>
                    )}
                    {isURLMode && (
                        <CustomButton
                            variant="outline"
                            onClick={() => setUrls('')}
                            disabled={urls === ''}
                            size="small"
                        >
                            Clear All URLs
                        </CustomButton>
                    )}
                    <CustomButton
                        variant="primary"
                        onClick={handleUpload}
                        startIcon={!uploading && <UploadIcon size={16} />}
                        size="small"
                        disabled={uploading || (isURLMode ? urls === '' : files.length === 0)}
                    >
                        {uploading
                            ? `Uploading ${isURLMode ? 'URLs' : type === 'medical_documents' ? 'medical' : 'patient'}...`
                            : `Upload ${isURLMode ? 'URLs' : 'Files'}`}
                    </CustomButton>
                </Box>
            </CardFooter>
        </Card>
    );
};

export default WorkspaceUpload;