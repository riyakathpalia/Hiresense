"use client"
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
  styled
} from '@mui/material';
import {
  Add as PlusIcon,
  Folder as FolderIcon,
  Message as MessageIcon,
  Group as UsersIcon
} from '@mui/icons-material';
import CustomButton from '@/components/atoms/button/CustomButton';
import WorkspaceSelector from '@/components/molecules/Workspace-Selector/WorkspaceSelector';
import WorkspaceExplorer from '@/components/molecules/workspace-explorer.tsx/WorkspaceExplorer';
import WorkspaceChat from '@/components/molecules/workspace-chat/WorkspaceChat';
import WorkspaceUpload from '@/components/molecules/workspace-upload/WorkspaceUpload';

const MetProAiWorkspacePage = () => {
  const [activeView, setActiveView] = useState<'files' | 'chat'>('files');
  const [aiResponse, setAiResponse] = useState<string | null>(null); // State to hold AI response

  const StyledButton = styled(Button)(({ theme }) => ({
    gap: theme.spacing(1),
  }));

  const handleDocumentUploadSuccess = (response: any) => {
    console.log('Document Upload successful, response:', response);
    setAiResponse(response);
    setActiveView('chat'); // Switch to chat view
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }} disableGutters>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Workspace Header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                MetProAi Workspaces
              </Typography>
            </Box>
          </Box>

          {/* Workspace View Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CustomButton
              variant={activeView === 'files' ? 'primary' : 'outline'}
              onClick={() => setActiveView('files')}
            >
              <FolderIcon fontSize="small" />
              Files
            </CustomButton>
            <CustomButton
              variant={activeView === 'chat' ? 'primary' : 'outline'}
              onClick={() => setActiveView('chat')}
            >
              <MessageIcon fontSize="small"/>
              Chat
            </CustomButton>
          </Box>

          <Divider />

          {/* Workspace Content */}
          <Grid container spacing={1} sx={{ height: 'calc(100vh - 12rem)' }}>
            {activeView === 'files' ? (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {/* Instead of WorkspaceExplorer, use WorkspaceUpload directly here */}
                  <Typography variant="h6" gutterBottom>
                    Upload Documents to MetProAi
                  </Typography>
                  <WorkspaceUpload
                    type="medicalDocument"
                    uploadHandler={() => Promise.resolve({})} // Replace with your actual handler
                    uploadUrlHandler={(url, workspaceName) => Promise.resolve({})} // Replace with your actual handler
                    onUploadSuccess={handleDocumentUploadSuccess}
                  />
                    <WorkspaceUpload
                      type="patientDocument"
                      uploadHandler={() => Promise.resolve({})} // Replace with your actual handler
                      uploadUrlHandler={(url, workspaceName) => Promise.resolve({})} // Replace with your actual handler
                      onUploadSuccess={handleDocumentUploadSuccess}
                    />
                </Box>
              </Grid>
            ) : (
              <Grid item xs={12} sx={{ height: '100%' }}>
                <WorkspaceChat aiResponse={aiResponse}/>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default MetProAiWorkspacePage;