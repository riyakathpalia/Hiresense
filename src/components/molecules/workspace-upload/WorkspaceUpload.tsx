import React, { useState } from 'react';
import {
  Upload as UploadIcon,
  X,
  FileText,
  FileInput
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  styled
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { CardFooter } from '../Card/Card';
import { useHireSenseContext } from '@/context/HireSenseContext';
import { handleFileInputChange } from '@/utils/fileUtils';
import CustomButton from '@/components/atoms/button/CustomButton';
import { useWorkspace } from '@/context/WorkspaceContext';

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

type UploadType = 'resume' | 'jobDescription';

interface WorkspaceUploadProps {
  type: UploadType;
  onUploadSuccess?: (response: any) => void;
}

const traverseFileTree = (item: any, fileList: File[]) => {
  if (item.isFile) {
    item.file((file: File) => {
      fileList.push(file);
    });
  } else if (item.isDirectory) {
    const dirReader = item.createReader();
    dirReader.readEntries((entries: any[]) => {
      for (const entry of entries) {
        traverseFileTree(entry, fileList);
      }
    });
  }
};

const WorkspaceUpload: React.FC<WorkspaceUploadProps> = ({ type, onUploadSuccess }) => {
  const { activeWorkspace } = useWorkspace();
  const { enqueueSnackbar } = useSnackbar();
  const { resumes, jobDescriptions } = useHireSenseContext();
  const [files, setFiles] = useState<File[]>([]); // Scoped to each instance
  const [uploading, setUploading] = useState(false);
  const [isFolderMode, setIsFolderMode] = useState(false); // Toggle between file and folder mode

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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

  const handleUpload = async () => {
    console.log('Uploading files:(type)', typeof(files));
    if (files.length === 0) {
      enqueueSnackbar(`Please select at least one ${type === 'resume' ? 'resume' : 'job description'} to upload.`, {
        variant: 'error',
      });
      return;
    }

    const uploadHandler = type === 'resume' ? resumes.uploadResumes : jobDescriptions.uploadJobDescriptions;
    setUploading(true);

    try {
      const response = await handleFileInputChange(files, uploadHandler, activeWorkspace?.name || 'defaultWorkspace');
      console.log(`${type} Upload response:`, response);

      if (onUploadSuccess) {
        onUploadSuccess(response);
      }

      enqueueSnackbar(`${type === 'resume' ? 'Resumes' : 'Job descriptions'} uploaded successfully!`, {
        variant: 'success',
      });
      setFiles([]); // Clear files after successful upload
    } catch (error) {
      console.error('Upload error:', error);
      enqueueSnackbar(`Failed to upload ${type === 'resume' ? 'resumes' : 'job descriptions'}.`, { variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader
        title={
          <Typography variant="h6" component="div" color="white">
            {type === 'resume' ? 'Upload Resumes' : 'Upload Job Descriptions'}
          </Typography>
        }
        sx={{
          py: 1.5,
          textAlign: 'center',
        }}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="subtitle2">
            {isFolderMode ? 'Folder Mode Enabled' : 'File Mode Enabled'}
          </Typography>
          <CustomButton
            variant="outline"
            size="small"
            onClick={() => setIsFolderMode((prev) => !prev)}
          >
            {isFolderMode ? 'Switch to File Mode' : 'Switch to Folder Mode'}
          </CustomButton>
        </Box>
        <StyledDropZone
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`workspace-input-${type}`)?.click()}
        >
          <input
            id={`workspace-input-${type}`}
            type="file"
            multiple
            {...(isFolderMode ? { webkitdirectory: 'true' } : {})} // Dynamically add webkitdirectory
            accept={type === 'resume' ? '.pdf,.docx,.doc,.rtf,.txt' : '.pdf,.docx,.doc,.txt'}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Typography variant="h6" gutterBottom>
            Drop {type === 'resume' ? 'resumes' : 'job descriptions'} here or click to browse{' '}
            {isFolderMode ? 'folders' : 'files'}
          </Typography>
        </StyledDropZone>
        
        {/* // List of files that are going to be uploaded */}
        {files.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Selected {type === 'resume' ? 'resumes' : 'job descriptions'} ({files.length})
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
                    {type === 'resume' ? <FileText size={16} color="primary" /> : <FileInput size={16} color="primary" />}
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
      <CardFooter>
        <Box display="flex" gap={1}>
          <CustomButton
            variant="outline"
            onClick={() => setFiles([])}
            disabled={files.length === 0}
            size="small"
          >
            Clear All
          </CustomButton>
          <CustomButton
            variant="primary"
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            startIcon={!uploading && <UploadIcon size={16} />}
            size="small"
          >
            {uploading ? `Uploading ${type === 'resume' ? 'resumes' : 'job descriptions'}...` : `Upload`}
          </CustomButton>
        </Box>
      </CardFooter>
    </Card>
  );
};

export default WorkspaceUpload;