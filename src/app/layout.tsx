import AppThemeProvider from "@/providers/AppThemeProvider";
import type { Metadata } from "next";
import "./globals.css";
import { MetProAiProvider } from '@/context/MetProAiContext';
import { SidebarProvider } from "@/context/SidebarContext";

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
          <MetProAiProvider>
            <SidebarProvider>
              <main>
                {children}
              </main>
            </SidebarProvider>
          </MetProAiProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}