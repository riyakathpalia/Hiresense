import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, SxProps, TextField, Theme, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';

// Utils
import { handleFileInputChange, handleUrlInputChange } from '@/utils/fileUtils';

// Atoms
import CustomButton from '@/components/atoms/button/CustomButton';
import { ScrollArea } from '@/components/atoms/scroll-area/ScrollArea';

// Molecules
import { CardContent, CardFooter, CardHeader } from '@/components/molecules/Card/Card';
import WorkspaceUpload from '@/components/molecules/workspace-upload/WorkspaceUpload';
import { useMetProAiContext } from '@/context/MetProAiContext';
import { useWorkspace } from '@/context/WorkspaceContext';

// Lucied React Icons
import { FileInput, FileText, Link, Plus, Trash2, UploadIcon, X } from 'lucide-react';

interface FileExplorerContentProps {
    type: 'patient_documents' | 'medical_documents';
    onSuccess?: (response: string) => void;
    sx?: SxProps<Theme>
}

const FileExplorerContent: React.FC<FileExplorerContentProps> = ({
    type,
    onSuccess,
}) => {
    const [checkedFiles, setCheckedFiles] = useState<string[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isURLMode, setIsURLMode] = useState(false);
    const [urls, setUrls] = useState<string>();
    const [newURL, setNewURL] = useState('');

    // Context Variables
    const { patient_documents, medical_documents } = useMetProAiContext();
    const { activeWorkspace, isLoading, refreshWorkspaces } = useWorkspace();

    // Helper function to check if there are folders of the given type
    const hasFolders = activeWorkspace?.folders?.some((f) => f.type === type) ?? false;

    // Determine the type-specific text
    const fileTypeText = type === 'medical_documents' ? 'medical records' : 'patient documents';
    const fileTypeTextSingular = type === 'medical_documents' ? 'medical record' : 'patient document';
    const uploadSuccessText = `${fileTypeText} uploaded successfully!`;
    const uploadFailureText = `Failed to upload ${fileTypeText}.`;
    const clearAllText = `Clear All`;
    const uploadText = `Upload`;

    // URL functions
    const handleURLInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewURL(event.target.value);
    };

    const addURL = () => {
        if (newURL.trim()) {
            setUrls(newURL.trim());
            setNewURL('');
        }
    };

    const removeURL = (index: number) => {
        setUrls('');
    };

    // Handle URL upload
    const handleUrlUpload = async () => {
        if (urls?.length === 0) {
            enqueueSnackbar(`Please add at least one URL to upload.`, { variant: 'error' });
            return;
        }

        const processUrls = type === 'medical_documents'
            ? medical_documents.processMedicalUrls
            : patient_documents.processPatientUrls;

        setUploading(true);

        try {
            const response = await handleUrlInputChange(
                urls || '',
                processUrls,
                activeWorkspace?.name || 'defaultWorkspace'
            );

            console.log(`${type} URL Upload response:`, response);

            if (response) {
                refreshWorkspaces();
                console.log('Upload response (URL):', response);
                if (onSuccess) {
                    onSuccess(JSON.stringify(response));
                }
            }

            enqueueSnackbar(
                `${type === 'medical_documents' ? 'Medical Documents' : 'Patient Documents'} uploaded successfully from URLs!`,
                { variant: 'success' }
            );

            setUrls('');
        } catch (error) {
            console.error('URL Upload error:', error);
            enqueueSnackbar(
                `Failed to upload ${type === 'medical_documents' ? 'medical' : 'patient'} from URLs.`,
                { variant: 'error' }
            );
        } finally {
            setUploading(false);
        }
    };

    // Handle upload button click for files
    const handleFileUpload = async () => {
        if (files.length === 0) {
            console.log('No files selected for upload');
            enqueueSnackbar(`Please select at least one ${fileTypeTextSingular} to upload.`, {
                variant: 'error',
            });
            return;
        }

        const uploadHandler = type === 'medical_documents'
            ? medical_documents.uploadMedicalDocuments
            : patient_documents.uploadPatientDocuments;

        setUploading(true);

        try {
            const response = await handleFileInputChange(files, uploadHandler, activeWorkspace?.name || 'defaultWorkspace');
            console.log(`${type} Upload response:`, response);

            if (response) {
                refreshWorkspaces();
                if (onSuccess) {
                    onSuccess(JSON.stringify(response));
                }
            }

            enqueueSnackbar(`${type === 'medical_documents' ? 'Medical Documents' : 'Patient Documents'} uploaded successfully!`, {
                variant: 'success',
            });

            setFiles([]);
        } catch (error) {
            console.error('Upload error:', error);
            enqueueSnackbar(uploadFailureText, { variant: 'error' });
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

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCheckedToggle = (fileName: string) => () => {
        setCheckedFiles(prev => {
            if (prev.includes(fileName)) {
                return prev.filter(name => name !== fileName);
            } else {
                return [...prev, fileName];
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const handleDelete = async (fileName: string) => {
        try {
            // Replace with actual delete functionality
            console.log(`Deleting file: ${fileName}`);
            // This is a placeholder for the actual API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Refresh workspace after deletion
            refreshWorkspaces();
            enqueueSnackbar(`File deleted successfully.`, { variant: 'success' });
        } catch (error) {
            console.error('Delete error:', error);
            enqueueSnackbar(`Failed to delete file.`, { variant: 'error' });
        }
    };

    return (
        <>
            <CardHeader>
                <Box sx={{ py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {hasFolders && (
                            <Box display="flex" alignItems="center" gap={2}>
                                {!isURLMode ? (
                                    <>
                                        <CustomButton variant="outline" size="small" onClick={() => document.getElementById(`workspace-input-${type}`)?.click()}>
                                            <Plus style={{ height: 16, width: 16, marginRight: 2 }} />
                                            Add Files
                                        </CustomButton>
                                        <input
                                            id={`workspace-input-${type}`}
                                            type="file"
                                            multiple
                                            accept={type === 'medical_documents' ? '.pdf,.docx,.doc,.rtf,.txt' : '.pdf,.docx,.doc,.txt'}
                                            style={{ display: 'none' }}
                                            onChange={handleFileChange}
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                                <CustomButton
                                    variant="outline"
                                    size="small"
                                    onClick={() => setIsURLMode(prev => !prev)}
                                >
                                    {isURLMode ? (
                                        <>Switch to File Mode</>
                                    ) : (
                                        <>Switch to URL Mode</>
                                    )}
                                </CustomButton>
                            </Box>
                        )}
                    </Box>
                </Box>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    // Skeleton loader while data is loading
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {[...Array(3)].map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rectangular"
                                height={36}
                                sx={{ borderRadius: 1 }}
                            />
                        ))}
                    </Box>
                ) : (
                    <ScrollArea style={{ display: "flex", flexDirection: "column", border: 1, borderColor: "red" }}>
                        {hasFolders ? (
                            isURLMode ? (
                                <Box>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        mb={2}
                                        sx={{
                                            '& .MuiFormLabel-root.Mui-focused': {
                                                color: 'white',
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
                                                '& .MuiInputBase-input:focus': {
                                                    color: 'white',
                                                },
                                                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'white',
                                                },
                                            }}
                                        />
                                        <CustomButton
                                            variant="outline"
                                            size="small"
                                            onClick={addURL}
                                            sx={{ ml: 1 }}
                                        >
                                            Add URL
                                        </CustomButton>
                                    </Box>
                                    {urls && (
                                        <Box mt={2}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Selected URLs ({urls})
                                            </Typography>
                                            <List dense sx={{ maxHeight: 160, overflow: 'auto', pr: 1, bgcolor: 'action.hover' }}>
                                                    <ListItem
                                                        secondaryAction={
                                                            <IconButton
                                                                edge="end"
                                                            >
                                                                <X size={16} />
                                                            </IconButton>
                                                        }
                                                        sx={{ py: 0.5 }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                                            <Link size={16} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={urls} />
                                                    </ListItem>
                                            </List>
                                        </Box>
                                    )}
                                </Box>
                            ) : (
                                <List sx={{ width: '100%', bgcolor: 'background.paper', display: "flex", flexDirection: "column", gap: 1 }}>
                                    {activeWorkspace?.folders
                                        .filter((folder) => folder.type === type)
                                        .map((folder, folderIndex) => {
                                            const labelIdPrefix = `checkbox-list-label-${folderIndex}`;

                                            return (
                                                <React.Fragment key={folderIndex}>
                                                    {folder.files?.map((file: string, fileIndex: number) => {
                                                        const labelId = `${labelIdPrefix}-${fileIndex}`;
                                                        return (
                                                            <ListItem
                                                            key={file}
                                                                disablePadding
                                                                secondaryAction={
                                                                    <IconButton
                                                                        edge="end"
                                                                        className="delete-icon"
                                                                        onClick={() => handleDelete(file)}
                                                                        sx={{
                                                                            opacity: 0,
                                                                            transition: 'opacity 0.2s',
                                                                            color: 'error.main',
                                                                            '&:hover': {
                                                                                backgroundColor: 'error.light',
                                                                            },
                                                                        }}
                                                                    >
                                                                        <Trash2 fontSize="small" />
                                                                    </IconButton>
                                                                }
                                                                sx={{
                                                                    '&:hover .delete-icon': {
                                                                        opacity: 1,
                                                                    },
                                                                    border: 1, borderRadius: 1, borderColor: 'divider'
                                                                }}
                                                            >
                                                                <ListItemButton role={undefined} onClick={handleCheckedToggle(file)} dense>
                                                                    {/* <ListItemIcon>
                                                                        <Checkbox
                                                                            edge="start"
                                                                            checked={checkedFiles.includes(file)}
                                                                            tabIndex={-1}
                                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                                            sx={{
                                                                                '&.Mui-checked': {
                                                                                    color: 'Dodgerblue',
                                                                                },
                                                                            }}
                                                                        />
                                                                    </ListItemIcon> */}
                                                                    <ListItemText id={labelId} primary={file} />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        )
                                                    })}
                                                </React.Fragment>
                                            )
                                        })}
                                </List>
                            )
                        ) : (
                            <WorkspaceUpload type={type} onSuccess={onSuccess} />
                        )}
                    </ScrollArea>
                )}

                {/* List of files that are going to be uploaded */}
                {!isURLMode && files.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="subtitle2" gutterBottom>
                            Selected {type === 'medical_documents' ? 'Medical Documents' : 'Patient Documents'} ({files.length})
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
            </CardContent>

            {((isURLMode && urls) || (!isURLMode && files.length > 0)) && (
                <CardFooter>
                    <Box display="flex" gap={1}>
                        {isURLMode ? (
                            <CustomButton
                                variant="outline"
                                onClick={() => setUrls('')}
                                //disabled={urls}
                                size="small"
                            >
                                Clear All URLs
                            </CustomButton>
                        ) : (
                            <CustomButton
                                variant="outline"
                                onClick={() => setFiles([])}
                                disabled={files.length === 0}
                                size="small"
                            >
                                Clear All
                            </CustomButton>
                        )}
                        <CustomButton
                            variant="primary"
                            onClick={handleUpload}
                            startIcon={!uploading && <UploadIcon size={16} />}
                            size="small"
                            //disabled={uploading || (isURLMode ? urls : files.length === 0)}
                        >
                            {uploading
                                ? `Uploading ${isURLMode ? 'URLs' : type === 'medical_documents' ? 'Medical Documents' : 'Patient Documents'}...`
                                : `Upload ${isURLMode ? 'URLs' : 'Files'}`}
                        </CustomButton>
                    </Box>
                </CardFooter>
            )}

        </>
    );
};

export default FileExplorerContent;