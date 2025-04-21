"use client";
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { FileText, Search, Users, BarChart4 } from "lucide-react";
import WorkspaceUpload from "@/components/molecules/workspace-upload/WorkspaceUpload";
import WorkspaceChat from "@/components/molecules/workspace-chat/WorkspaceChat";
import WorkspaceSelector from "@/components/molecules/Workspace-Selector/WorkspaceSelector";
import { useEffect } from "react";
import { ensureGuestId } from "@/utils/userAgent";

const MetProAiHomePage = () => {
  const theme = useTheme();
  useEffect(() => {
    ensureGuestId();
  }, []);

  // Dummy upload handlers - replace with your actual logic
  const handleMedicalUpload = async (files: File[], workspaceName: string) => {
    console.log("Uploading medical documents for MetProAi:", files, workspaceName);
    return { success: true, message: "Medical documents uploaded to MetProAi" };
  };

  const handlePatientUpload = async (files: File[], workspaceName: string) => {
    console.log("Uploading patient documents for MetProAi:", files, workspaceName);
    return { success: true, message: "Patient documents uploaded to MetProAi" };
  };

  const handleUploadSuccess = (response: any) => {
    console.log("MetProAi Upload success:", response);
    // Handle success feedback
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Workspace Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Typography variant="h5" component="h1" fontWeight="bold">
                MetProAi Home
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              border: 1,
              borderRadius: 2,
              borderColor: 'divider',
            }}
          >
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap', // Allow uploads to wrap on smaller screens
            }}>
              <WorkspaceUpload
                type="medicalDocument"
                uploadHandler={handleMedicalUpload}
                uploadUrlHandler={async (url: string, workspaceName: string) => {
                  console.log("Uploading medical document via URL for MetProAi:", url, workspaceName);
                  return { success: true, message: "Medical document uploaded via URL to MetProAi" };
                }}
                onUploadSuccess={handleUploadSuccess}
              />
              <WorkspaceUpload
                type="patientDocument"
                uploadHandler={handlePatientUpload}
                uploadUrlHandler={async (url: string, workspaceName: string) => {
                  console.log("Uploading patient document via URL for MetProAi:", url, workspaceName);
                  return { success: true, message: "Patient document uploaded via URL to MetProAi" };
                }}
                onUploadSuccess={handleUploadSuccess}
              />
            </Box>

            <Box>
              <WorkspaceChat />
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default MetProAiHomePage;