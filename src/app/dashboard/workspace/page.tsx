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

const WorkspacePage = () => {
  const [activeView, setActiveView] = useState<'files' | 'chat'>('files');
  const [aiResponse, setAiResponse] = useState<string | null>(null); // State to hold AI response
  
  const StyledButton = styled(Button)(({ theme }) => ({
    gap: theme.spacing(1),
  }));

  const handleJDUploadSuccess = (response: any) => {
    console.log('JD Upload successful, response:', response);
    setAiResponse(response);
    setActiveView('chat'); // Switch to chat view
  };
  
  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Workspace Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Workspaces
              </Typography>
              {/* <WorkspaceSelector /> */}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* <CustomButton variant="outline" size="small">
                <UsersIcon fontSize="small" />
                Share
              </CustomButton> */}
              {/* <CustomButton variant="primary" size="small">
                <PlusIcon fontSize="small" />
                New Workspace
              </CustomButton> */}
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
          <Grid container spacing={4} sx={{ height: 'calc(100vh - 12rem)' }}>
            {activeView === 'files' ? (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <WorkspaceExplorer onJDUploadSuccess={handleJDUploadSuccess}/>
                  {/* <WorkspaceUpload /> */}
                </Box>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <WorkspaceChat aiResponse={aiResponse}/>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default WorkspacePage;