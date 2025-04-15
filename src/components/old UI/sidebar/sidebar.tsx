"use client"

import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  Box,
  Avatar,
  Button
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Message,
  Description,
  Settings,
  Add,
  Logout
} from "@mui/icons-material";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { icon: <Upload />, label: "Upload CVs", active: true },
    { icon: <Message />, label: "Chat", active: false },
    { icon: <Description />, label: "My CVs", active: false },
    { icon: <Settings />, label: "Settings", active: false },
  ];

  return (
    <Drawer
      variant="permanent"

      sx={{
        width: collapsed ? 80 : 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? 80 : 250,
          transition: "width 0.3s",
          overflowX: "hidden",
        },
      }}
      className={className}
    >
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100%",
      }}>
        <Box >
          <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
            {!collapsed && <Typography variant="h6">CV Assistant</Typography>}
            <IconButton onClick={toggleCollapsed}>
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton selected={item.active}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box p={2}>
            {!collapsed ? (
              <Button variant="contained" fullWidth startIcon={<Add />}>
                New Project
              </Button>
            ) : (
              <IconButton>
                <Add />
              </IconButton>
            )}
          </Box>
          <Divider />
        </Box>
        <Box display="flex" alignItems="center" p={2}>
          <Avatar>JD</Avatar>
          {!collapsed && (
            <Box ml={2}>
              <Typography variant="body1">John Doe</Typography>
              <Typography variant="body2" color="textSecondary">
                john@example.com
              </Typography>
            </Box>
          )}
          {!collapsed && (
            <IconButton sx={{ marginLeft: "auto" }}>
              <Logout />
            </IconButton>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;