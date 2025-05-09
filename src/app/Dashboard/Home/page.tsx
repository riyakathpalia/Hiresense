"use client";
import WorkspaceChat from "@/components/molecules/workspace-chat/WorkspaceChat";
import WorkspaceFileExplorer from "@/components/molecules/Workspace-FileExplorer/WorkspaceFileExplorer";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ensureGuestId } from "@/utils/userAgent";
import { Chat, Upload } from '@mui/icons-material';
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const MetProAiHomePage = () => {
  const { refreshWorkspaces } = useWorkspace();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    refreshWorkspaces()
    ensureGuestId();
  }, []);

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: '100vh',
        py: { xs: 2, md: 4 },
        padding: { xs: '8px', sm: '10px' },
      }}
    >
      <Typography variant="h5" component="h1" fontWeight="bold" textAlign="start" margin="8px">
        Welcome to CazeMetProAI
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        orientation="horizontal"
        sx={{
          display: 'flex',
          gap: 2,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            justifyContent: 'center',
            gap: 0.5,
            minHeight: '40px',
            fontSize: '0.875rem',
            padding: '8px 12px',
            boxShadow: 'none',
            border: 'none',
            marginRight: '8px',
            color:'white',
          },
          '& .Mui-selected': {
            color: 'white',
            fontWeight: 'bold',
            backgroundColor: 'action.hover',
            borderRadius: '4px',
            '& .MuiTab-wrapper > *:first-of-type': {
              color: 'white',
            },
          },
          '& .MuiTab-wrapper > *:first-of-type': {
            fontSize: '1.2rem',
          },
        }}
      >
        <Tab
          icon={<Chat />}
          iconPosition="start"
          label="Chat"
          aria-label="Chat workspace"
        />
        <Tab
          icon={<Upload />}
          iconPosition="start"
          label="File Upload"
          aria-label="File upload workspace"
        />
      </Tabs>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {activeTab === 0 && (
          <WorkspaceChat />
        )}
        {activeTab === 1 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              height: '100%',
            }}
          >

            <WorkspaceFileExplorer /> {/* Render only once */}

          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MetProAiHomePage;