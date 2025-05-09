'use client';
import Sidebar from "@/components/molecules/Sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import AppThemeProvider from "@/providers/AppThemeProvider";
import { MetProAiProvider } from "@/context/MetProAiContext"; // Import MetProAiProvider
import { SnackbarProvider } from 'notistack';

import { Box } from "@mui/material"; // Import MUI Box for layout

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider suppressHydrationWarning>
      <div className="flex h-screen">
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          <WorkspaceProvider>
            <SidebarProvider>
                  {/* Sidebar stays static */}
                  <Sidebar />

                  {/* Main content area for MetProAI */}
                  <Box
                    component="main"
                    flex={1}
                    overflow="auto"
                    margin={0}
                    padding={0}
                  >
                    {children}
                  </Box>
                
              
            </SidebarProvider>
          </WorkspaceProvider>
        </SnackbarProvider>
      </div>
    </AppThemeProvider>
  );
}