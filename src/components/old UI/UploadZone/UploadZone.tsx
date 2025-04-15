import React, { useState, useCallback } from 'react';
import { Box, Typography, IconButton, Paper, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { CloudUpload, Description, Close } from '@mui/icons-material';

interface UploadZoneProps {
  onFilesAdded: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  className?: string;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onFilesAdded,
  acceptedFileTypes = ['.pdf', '.docx', '.doc', '.txt'],
  maxFiles = 10,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, []);

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return acceptedFileTypes.includes(fileExtension);
    });

    const newFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles);
    setSelectedFiles(newFiles);
    onFilesAdded(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFilesAdded(newFiles);
  };

  return (
    <Box className={className} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      <Paper
        sx={{
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.400',
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease-in-out',
          bgcolor: isDragging ? 'primary.light' : 'background.paper',
          width: '100%',
          
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedFileTypes.join(',')}
          multiple
          onChange={handleFileInput}
          style={{ display: 'none' }}
          id="file-upload"
        />
        <label htmlFor="file-upload"  style={{ display: 'block', cursor: 'pointer' }}>
          <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6">Drop your CV files here</Typography>
          <Typography variant="body2" color="textSecondary">or click to browse files</Typography>
          <Typography variant="caption" color="textSecondary">
            Accepted formats: {acceptedFileTypes.join(', ')}
          </Typography>
        </label>
      </Paper>

      {selectedFiles.length > 0 && (
        <Paper  sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6">Uploaded Files ({selectedFiles.length})</Typography>
          <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {selectedFiles.map((file, index) => (
              <ListItem key={`${file.name}-${index}`} secondaryAction={
                <IconButton edge="end" onClick={() => removeFile(index)}>
                  <Close />
                </IconButton>
              }>
                <ListItemIcon>
                  <Description color="primary" />
                </ListItemIcon>
                <ListItemText primary={file.name} primaryTypographyProps={{ noWrap: true }} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default UploadZone;