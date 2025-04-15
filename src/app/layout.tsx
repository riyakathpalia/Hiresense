import type { Metadata } from "next";
import AppThemeProvider from "@/providers/AppThemeProivder";
import "./globals.css";
import { Box } from "@mui/material";
import { HireSenseProvider } from '@/context/HireSenseContext';


export const metadata: Metadata = {
  title: "HireSense",
  description: "Created by Souvik Bhattacharya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`antialiased`}>
        <AppThemeProvider >

          <Box>
            <main>
              <HireSenseProvider>
                {children}
              </HireSenseProvider>
            </main>
          </Box>
        </AppThemeProvider>
      </body>
    </html>
  );
}
