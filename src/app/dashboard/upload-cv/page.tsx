"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Upload as UploadIcon,
  FileText,
  File,
  Database,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { Button, Card, CardContent, CardActions, CardHeader, Typography, Tabs, Tab, LinearProgress, Snackbar, Alert, IconButton } from '@mui/material';

const UploadPage: React.FC = () => {
    const router = useRouter();
  
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  }
};

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) {
      setSnackbarOpen(true);
      return;
    }
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setTimeout(() => router.push('/dashboard'), 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <Typography variant="h4" gutterBottom>Upload CVs</Typography>
      <Typography variant="body2" color="textSecondary">Upload CV files in various formats for AI processing.</Typography>
      
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} sx={{
        border:"1px solid"
      }}>
        <Tab label={<><FileText size={16} /> File Upload</>} sx={{border:"1px solid"}}/>
        <Tab label={<><File size={16} /> CSV Import</>} />
        <Tab label={<><Database size={16} /> Database Connection</>} />
      </Tabs>

      {tabIndex === 0 && (
        <Card variant="outlined" style={{ marginTop: 20, padding: 20 }}>
          <CardHeader title="Upload CV Files" subheader="Drag and drop or browse your CV files (PDF, DOCX, TXT)" />
          <CardContent>
            <div
              style={{ border: '2px dashed #ccc', padding: 40, textAlign: 'center', cursor: 'pointer' }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <UploadIcon size={48} color="#777" />
              <Typography variant="body1">Drop files here or click to browse</Typography>
            </div>

            {files.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <Typography variant="subtitle1">Selected Files ({files.length})</Typography>
                {files.map((file, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottom: '1px solid #ddd' }}>
                    <Typography variant="body2">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</Typography>
                    <IconButton size="small" onClick={() => removeFile(index)}>
                      <X size={16} />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}

            {uploading && (
              <div style={{ marginTop: 20 }}>
                <Typography variant="body2">Uploading... {progress}%</Typography>
                <LinearProgress variant="determinate" value={progress} />
              </div>
            )}

            {files.length > 10 && (
              <Alert severity="warning" style={{ marginTop: 20 }}>
                <AlertCircle size={16} /> You're uploading a large number of files. Processing may take a while.
              </Alert>
            )}
          </CardContent>
          <CardActions>
            <Button variant="outlined" onClick={() => setFiles([])}>Clear All</Button>
            <Button variant="contained" color="primary" onClick={handleUpload} disabled={files.length === 0 || uploading}>
              {uploading ? 'Processing...' : 'Upload Files'}
            </Button>
          </CardActions>
        </Card>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="error">No files selected. Please upload at least one file.</Alert>
      </Snackbar>
    </div>
  );
};

export default UploadPage;