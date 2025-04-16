import Sidebar from "@/components/molecules/Sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import AppThemeProvider from "@/providers/AppThemeProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeProvider suppressHydrationWarning={true}>
      <div className="flex h-screen">
        <WorkspaceProvider>
          <SidebarProvider>
            {/* Sidebar remains static */}
            <Sidebar />
            {/* Main content area for MetProAi */}
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </SidebarProvider>
        </WorkspaceProvider>
      </div>
    </AppThemeProvider>
  );
}