import React, { useState } from 'react';
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Box,
  Avatar,
} from '@mui/material';
import { useWorkspace } from '@/context/WorkspaceContext';
import { useToast } from '@/lib/hooks/useToast';
import CustomButton from '@/components/atoms/button/CustomButton';

const WorkspaceSelector = () => {
  const { activeWorkspace, setActiveWorkspace, workspaces, addWorkspace, deleteWorkspace } = useWorkspace();
  const [isNewWorkspaceDialogOpen, setIsNewWorkspaceDialogOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { toast } = useToast();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const handleDeleteWorkspace = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (workspaces.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You need at least one workspace",
        variant: "destructive"
      });
      return;
    }
    
    deleteWorkspace(id);
    toast({
      title: "Success",
      description: `Workspace "${name}" deleted`,
    });
  };
  
  return (
    <>
      <CustomButton
        variant="outline"
        onClick={handleClick}
        sx={{
          display: 'flex',
          gap: 1,
          height:"100%",
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(6px)',
          borderColor: 'divider',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <Box display="flex" alignItems="center" gap={1} > 
          <Avatar sx={{ 
            width: 20, 
            height: 20, 
            //bgcolor: 'primary.light', 
            color: 'DodgerBlue.main',
            fontSize: '0.75rem',
            fontWeight: 'medium'
          }}>
            {activeWorkspace?.name?.charAt(0) || 'W'}
          </Avatar>
          <Typography variant="body1" noWrap sx={{ maxWidth: 120 }}>
            {activeWorkspace?.name || 'Select Workspace'}
          </Typography>
        </Box>
        <ChevronDown style={{ width: 16, height: 16, opacity: 0.5 }} />
      </CustomButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 224,
            overflow: 'visible',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 20,
              height: 20,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {workspaces.map((workspace: any) => (
          <MenuItem 
            key={workspace.id}
            onClick={() => {
              setActiveWorkspace(workspace);
              handleClose();
            }}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              '&:hover .delete-icon': {
                opacity: 1,
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ 
                width: 20, 
                height: 20, 
                bgcolor: 'primary.light', 
                color: 'primary.main',
                fontSize: '0.75rem',
                fontWeight: 'medium'
              }}>
                {workspace.name.charAt(0)}
              </Avatar>
              <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                {workspace.name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              {workspace.id === activeWorkspace?.id && (
                <Check style={{ width: 16, height: 16, marginRight: 8 }} />
              )}
              {workspaces.length > 1 && (
                <IconButton
                  size="small"
                  className="delete-icon"
                  sx={{ 
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.light',
                    }
                  }}
                  onClick={(e) => {
                    handleDeleteWorkspace(workspace.id, workspace.name, e);
                    handleClose();
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              )}
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem 
          onClick={() => {
            setIsNewWorkspaceDialogOpen(true);
            handleClose();
          }}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ListItemIcon>
            <Plus size={16} />
          </ListItemIcon>
          <ListItemText>Create New Workspace</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog 
        open={isNewWorkspaceDialogOpen} 
        onClose={() => setIsNewWorkspaceDialogOpen(false)}
      >
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
          <CustomButton 
            variant="outline" 
            onClick={() => setIsNewWorkspaceDialogOpen(false)}
          >
            Cancel
          </CustomButton>
          <CustomButton 
            variant="primary" 
            onClick={handleCreateWorkspace}
          >
            Create Workspace
          </CustomButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkspaceSelector;