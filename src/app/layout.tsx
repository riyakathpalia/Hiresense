import AppThemeProvider from "@/providers/AppThemeProvider";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MetProAI",
  description: "Your AI assistant for medical analysis and conversation",
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
              {children}
            </main>
          </Box>
        </AppThemeProvider>
      </body>
    </html>
  );
}