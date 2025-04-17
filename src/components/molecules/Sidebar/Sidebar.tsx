"use client";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, Box, Typography, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowLeft as ArrowLeftIcon,
  FileText as DashboardIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  PanelLeft as CategoryIcon,
  User as PersonIcon,
  Briefcase as WorkIcon,
  MessageCircle as ChatIcon,
  Settings as SettingsIcon,
  Home as HomeIcon
} from 'lucide-react';
import { useSidebar } from '@/context/SidebarContext';
import { useRouter, usePathname } from 'next/navigation';
import CustomButton from '@/components/atoms/button/CustomButton';
import Image from 'next/image';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useState } from 'react';
import { Add, Folder, KeyboardArrowDown } from '@mui/icons-material';
import { useToast } from '@/lib/hooks/useToast';

const navItems = [
  { title: 'Home', icon: <HomeIcon size={20} />, path: '/' }, // Ensure path is '/'
  { title: 'Dashboard', icon: <DashboardIcon size={20} />, path: '/dashboard' },
  //{ title: 'CV Categories', icon: <CategoryIcon size={20} />, path: 'dashboard/categories' },
  // { title: 'Candidates', icon: <PersonIcon size={20} />, path: 'dashboard/candidates' },
  //{ title: 'Job Descriptions', icon: <WorkIcon size={20} />, path: 'dashboard/jobs' },
  //{ title: 'AI Chat', icon: <ChatIcon size={20} />, path: 'dashboard/workspace' },
];

const Sidebar = () => {
  const router = useRouter();
  const { isOpen, toggleSidebar } = useSidebar();
  const { workspaces, activeWorkspace, setActiveWorkspace, addWorkspace } = useWorkspace();
  const [isWorkspacesExpanded, setIsWorkspacesExpanded] = useState(true);
  const pathname = usePathname();
  const [isNewWorkspaceDialogOpen, setIsNewWorkspaceDialogOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const { toast } = useToast();

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim() === '') {
      toast({
        title: "Error",
        description: "Workspace name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newWorkspace = {
      id: `ws-${Date.now()}`,
      name: newWorkspaceName,
      folders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      collaborators: []
    };

    addWorkspace(newWorkspace);
    setActiveWorkspace(newWorkspace);
    setNewWorkspaceName('');
    setIsNewWorkspaceDialogOpen(false);

    toast({
      title: "Success",
      description: `Workspace "${newWorkspaceName}" created successfully`,
    });
  };

  return (
    <>
      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            bgcolor: "BlackPearl.main", // Background with opacity
            backdropFilter: "blur(5px)", // Blur effect
            display: { md: "none" }, // Hide on larger screens
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          width: isOpen ? 220 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isOpen ? 200 : 80,
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
          },

        }}
      >
        {/* Sidebar Header */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>

            {isOpen ? (
              <Typography variant="h6" color='DodgerBlue.main' sx={{ fontWeight: "bold" }}>
                MetProAi
              </Typography>
            ) : (
              <Box
                onClick={toggleSidebar}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "DodgerBlue.main",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                MP
              </Box>
            )}
          </Box>

          <CustomButton variant='link' onClick={toggleSidebar} sx={{ minWidth: 0, p: 1, display: { md: "flex" } }}>
            {isOpen ? <ArrowLeftIcon size={20} /> : <MenuIcon />}
          </CustomButton>
        </Box>

        <Divider />

        {/* Workspaces Section */}
        <Box sx={{ px: 1.5, py: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              cursor: 'pointer'
            }}
            onClick={() => setIsWorkspacesExpanded(!isWorkspacesExpanded)}
          >
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                color: 'text.secondary',
                fontWeight: 'medium',
                ...(!isOpen && {
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap',
                  borderWidth: 0,
                })
              }}
            >
              Workspaces
            </Typography>
            {isOpen && (
              <KeyboardArrowDown
                sx={{
                  color: 'text.secondary',
                  transition: 'transform 0.2s',
                  ...(isWorkspacesExpanded && {
                    transform: 'rotate(180deg)'
                  })
                }}
              />
            )}
          </Box>

          {isWorkspacesExpanded && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {workspaces.map((workspace) => (
                <CustomButton
                  key={workspace.id}
                  variant={workspace.id === activeWorkspace?.id ? "primary" : "ghost"}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    gap: 2,
                    height: 36,
                    px: 2,
                    textTransform: 'none',
                    fontSize: '0.875rem'
                  }}
                  onClick={() => {
                    setActiveWorkspace(workspace);
                    router.push('/dashboard/workspace');
                  }}
                >
                  <Box sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                    fontSize: '0.75rem'
                  }}>
                    {workspace.name.charAt(0)}
                  </Box>
                  <Typography noWrap sx={{ flex: 1, textAlign: 'left' }}>
                    {workspace.name}
                  </Typography>
                </CustomButton>
              ))}

              <CustomButton
                variant="ghost"
                size="small"
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  color: 'text.secondary',
                  mt: 1,
                  textTransform: 'none'
                }}
                onClick={() => setIsNewWorkspaceDialogOpen(true)}
              >
                <Add sx={{ mr: 2, fontSize: 20 }} />
                New Workspace
              </CustomButton>
            </Box>
          )}

          {/* For collapsed sidebar */}
          {!isOpen && (
            <CustomButton
              variant="ghost"
              size="small"
              sx={{
                width: '100%',
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'auto'
              }}
              onClick={() => router.push('/dashboard/workspace')}
            >
              <Folder sx={{ fontSize: 25 }} />
            </CustomButton>
          )}
        </Box>

        <Divider />

        {/* Navigation Menu */}
        <List sx={{ overflowY: "auto", justifyContent: "space-around", display: "flex", flexDirection: "column", height: "100%" }}>
          <Box >
            {navItems.map((item) => (
              <ListItemButton
                key={item.title}
                selected={pathname === item.path}
                sx={{
                  justifyContent: isOpen ? "flex-start" : "center",
                  px: isOpen ? 2 : 1,
                  transition: "all 0.3s",

                }}
                onClick={() => {
                  if (pathname !== item.path) {
                    router.replace(item.path); // Replace the current URL
                  }

                }}
              >
                {item.icon}
                {isOpen && <Typography sx={{ ml: 2 }}>{item.title}</Typography>}
              </ListItemButton>
            ))}

          </Box>
        </List>

        <Divider />
        <Box sx={{
          diaply: "flex",
          justifyItems: "center",
        }}>
          <Image
            src="/Caze MeTPro AI.png" // Path to the image
            alt="MetProAi Logo"
            width={150} // Set width
            height={150} // Set height
            priority // Loads image immediately
            style={{ filter: `drop-shadow(10px 10px 10px #000000)` }}
          />
        </Box>

        {/* Settings Button - Future Implementation*/}
        {/* <Box sx={{ p: 2 }}>
          <CustomButton
            fullWidth
            variant="outline"
            sx={{ justifyContent: isOpen ? "flex-start" : "center", px: isOpen ? 2 : 1 }}
            onClick={() => router.push("/settings")}
          >
            <SettingsIcon />
            {isOpen && <Typography sx={{ ml: 2 }}>Settings</Typography>}
          </CustomButton>
        </Box> */}
      </Drawer>

      {/* Floating Button to Toggle Sidebar (Mobile Only) */}
      <CustomButton
        variant="outline"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 40,
          display: { md: "none" },
        }}
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </CustomButton>

      {/* New Workspace Dialog */}
      <Dialog open={isNewWorkspaceDialogOpen} onClose={() => setIsNewWorkspaceDialogOpen(false)}>
        <DialogTitle>Create New Workspace</DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Workspace Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter workspace name"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <CustomButton variant="outline" onClick={() => setIsNewWorkspaceDialogOpen(false)}>
            Cancel
          </CustomButton>
          <CustomButton variant="primary" onClick={handleCreateWorkspace}>
            Create Workspace
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;