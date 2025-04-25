"use client";
import WorkspaceChat from "@/components/molecules/workspace-chat/WorkspaceChat";
import WorkspaceUpload from "@/components/molecules/workspace-upload/WorkspaceUpload";
import { ensureGuestId } from "@/utils/userAgent";
import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";

const MetProAiHomePage = () => {
  useEffect(() => {
    ensureGuestId();
  }, []);

  // Dummy upload handlers - replace with your actual logic
  // const handleMedicalUpload = async (files: File[], workspaceName: string) => {
  //   console.log("Uploading medical documents for MetProAi:", files, workspaceName);
  //   return { success: true, message: "Medical documents uploaded to MetProAi" };
  // };

  // const handlePatientUpload = async (files: File[], workspaceName: string) => {
  //   console.log("Uploading patient documents for MetProAi:", files, workspaceName);
  //   return { success: true, message: "Patient documents uploaded to MetProAi" };
  // };

  // const handleUploadSuccess = (response: any) => {
  //   console.log("MetProAi Upload success:", response);
  //   // Handle success feedback
  // };

  return (
    <>
        <Container
          sx={{
            py: 4,
          }}
        >
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
                  Home
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
                gap: 2, // Add some gap
                width: '100%'
              }}>
                <WorkspaceUpload
                  type="medicalDocument"
                />


                <WorkspaceUpload
                  type="patientDocument" />
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
