"use client";
import CustomButton from '@/components/atoms/button/CustomButton';
import { useSidebar } from '@/context/SidebarContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useToast } from '@/lib/hooks/useToast';
import { Add, KeyboardArrowDown } from '@mui/icons-material';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  List,
  ListItemButton,
  TextField,
  Typography
} from '@mui/material';
import {
  ArrowLeft as ArrowLeftIcon,
  FileText as DashboardIcon,
  Home as HomeIcon,
  Menu as MenuIcon
} from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { title: 'Home', icon: <HomeIcon size={18} />, path: '/Dashboard/Home' },
  { title: 'Dashboard', icon: <DashboardIcon size={18} />, path: '/Dashboard' },
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

    router.push(`/Dashboard/Home`);

    toast({
      title: "Success!",
      description: `Workspace "${newWorkspaceName}" was created successfully.`,
      variant: "default",
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
            bgcolor: "BlackPearl.main",
            backdropFilter: "blur(5px)",
            display: { md: "none" },
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={isOpen}
        sx={{
          width: isOpen ? 200 : 80,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isOpen ? 200 : 80,
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Sidebar Header */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          flexShrink: 0,
        }}>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>

            {isOpen ? (
              <Typography variant="h6" color='DodgerBlue.main' sx={{ fontWeight: "bold" }}>
                <Image
                  src="/Caze MeTPro AI.png"
                  alt="MetProAI Logo"
                  width={isOpen ? 170 : 50}
                  height={isOpen ? 150 : 50}
                  priority
                  style={{
                    filter: `drop-shadow(5px 5px 5px #000000)`,
                    transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
                  }}
                />
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

        {/* Navigation Menu */}
        <List sx={{ flexShrink: 0, py: 1 }}>
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
                  router.replace(item.path);
                }
              }}
            >
              {item.icon}
              {isOpen && <Typography sx={{ ml: 2, fontSize: '0.875rem' }}>{item.title}</Typography>}
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ flexShrink: 0 }} />

        {/* Workspaces Section */}
        <Box sx={{ px: 1.5, py: 2, flexShrink: 0 }}>
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

          {/* Render individual workspaces ONLY if expanded AND sidebar is open */}
          {isWorkspacesExpanded && isOpen && (
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
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                  }}
                  onClick={() => {
                    setActiveWorkspace(workspace);
                    router.push('Home');
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
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}>
                    {workspace.name.charAt(0)}
                  </Box>
                  <Typography noWrap sx={{ flex: 1, textAlign: 'left' }}>
                    {workspace.name}
                  </Typography>
                </CustomButton>
              ))}

              {/* "New Workspace" Button */}
              <CustomButton
                variant="ghost"
                size="small"
                sx={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  color: 'text.secondary',
                  mt: 1,
                  textTransform: 'none',
                  px: 2,
                  gap: 2,
                }}
                onClick={() => setIsNewWorkspaceDialogOpen(true)}
              >
                <Add sx={{ fontSize: 20, flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.875rem' }}>
                  New Workspace
                </Typography>
              </CustomButton>
            </Box>
          )}

          {/* For collapsed sidebar */}
          {!isOpen && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
              {workspaces.map((workspace) => (
                <CustomButton
                  key={workspace.id}
                  variant={workspace.id === activeWorkspace?.id ? "primary" : "ghost"}
                  sx={{
                    width: 40,
                    height: 40,
                    minWidth: 'auto',
                    p: 0,
                    borderRadius: '50%',
                  }}
                  onClick={() => {
                    setActiveWorkspace(workspace);
                    router.push('/Home');
                  }}
                  title={workspace.name}
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
                    fontSize: '0.75rem',
                  }}>
                    {workspace.name.charAt(0)}
                  </Box>
                </CustomButton>
              ))}
              <CustomButton
                variant="ghost"
                size="small"
                sx={{
                  width: 40,
                  height: 40,
                  minWidth: 'auto',
                  p: 0,
                  borderRadius: '50%',
                  mt: 1,
                }}
                onClick={() => setIsNewWorkspaceDialogOpen(true)}
                title="New Workspace"
              >
                <Add sx={{ fontSize: 20 }} />
              </CustomButton>
            </Box>
          )}
        </Box>

        {/* Spacer to push the image to the bottom */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Image at the bottom */}
        <Divider sx={{ flexShrink: 0 }} />
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          flexShrink: 0,
        }}>
          <Image
            src="/Caze-Logo-Colour-Transparent.webp" // Path to the image
            alt="Logo Image"
            width={isOpen ? 140 : 50}
            height={isOpen ? 150 : 50}
            priority
            style={{
              filter: `drop-shadow(5px 5px 5px #000000)`,
              transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out',
            }}
          />
        </Box>
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