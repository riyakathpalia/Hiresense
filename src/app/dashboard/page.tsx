"use client"
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { FileText, Search, Users, BarChart4 } from "lucide-react";
import WorkspaceUpload from "@/components/molecules/workspace-upload/WorkspaceUpload";
import WorkspaceChat from "@/components/molecules/workspace-chat/WorkspaceChat";
import WorkspaceSelector from "@/components/molecules/Workspace-Selector/WorkspaceSelector";
import { useEffect } from "react";
import { ensureGuestId } from "@/utils/userAgent";

const Home = () => {
  const theme = useTheme()
  useEffect(() => {
    ensureGuestId();
  }, []);

  return (<>

    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Workspace Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Hiresense Home
            </Typography>
          </Box>

        </Box>

        <Box sx={{
          border: 1,
          borderRadius:2,
          borderColor: 'divider',
        }}>
          <Box sx={{
            display: 'flex',
          }}>
            <WorkspaceUpload type="jobDescription" />
            <WorkspaceUpload type="resume" />
          </Box>

          <Box>
            <WorkspaceChat />
          </Box>
        </Box>

      </Box>
    </Container>
  </>
  );
}

export default Home;