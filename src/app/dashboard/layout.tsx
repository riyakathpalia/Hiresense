import Sidebar from "@/components/molecules/Sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import AppThemeProvider from "@/providers/AppThemeProvider";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider suppressHydrationWarning={true}>
      <div className="flex h-screen">
        
        <WorkspaceProvider>
          <SidebarProvider>
            {/* Sidebar remains static */}
            <Sidebar />
            {/* Main content area for MetProAI */}
            <main className="flex-1 overflow-auto m-0 p-0">
              {children}
            </main>
          </SidebarProvider>
        </WorkspaceProvider>
      </div>
    </AppThemeProvider>
  );
}