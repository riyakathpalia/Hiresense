import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import UploadZone from "@/components/old UI/UploadZone/UploadZone";
import { ArrowForward } from '@mui/icons-material';

interface CVUploaderProps {
  onComplete: (files: File[]) => void;
}

const CVUploader: React.FC<CVUploaderProps> = ({ onComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleUpload = () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onComplete(files);
    }, 1500);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        //maxWidth: 600,
        mx: 'auto',
        p: 3,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Upload Your CVs
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Upload multiple CV files to analyze and chat with them using AI.
      </Typography>
      
      <UploadZone onFilesAdded={handleFilesAdded} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          disabled={files.length === 0 || isUploading}
          onClick={handleUpload}
          endIcon={!isUploading ? <ArrowForward /> : null}
        >
          {isUploading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
        </Button>
      </Box>
    </Box>
  );
};

export default CVUploader;
