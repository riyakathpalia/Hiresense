import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Paper,
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Star as StarIcon,
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as ClockIcon,
} from '@mui/icons-material';

interface CVFile {
  id: string;
  name: string;
  size: string;
  date: string;
  starred?: boolean;
}

interface CVListProps {
  files: CVFile[];
  onSelectCV: (id: string) => void;
  onDeleteCV: (id: string) => void;
  onStarCV: (id: string) => void;
}

const CVList: React.FC<CVListProps> = ({ files, onSelectCV, onDeleteCV, onStarCV }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectCV(id);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="h6">Your CVs</Typography>
        <Typography variant="body2" color="text.secondary">
          {files.length} document{files.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
      <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
        {files.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center', color: 'text.secondary' }}>No CVs uploaded yet</Box>
        ) : (
          <List>
            {files.map((file) => (
              <ListItem
                key={file.id}
                disablePadding
                sx={{
                  bgcolor: selectedId === file.id ? 'action.selected' : 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemButton onClick={() => handleSelect(file.id)}>
                  <ListItemIcon>
                    <FileIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">{file.size}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ClockIcon fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="caption" color="text.secondary">{file.date}</Typography>
                        </Box>
                      </Box>
                    }
                  />
                  {file.starred && <StarIcon sx={{ color: 'gold', mr: 1 }} />}
                  <IconButton onClick={(e) => handleMenuOpen(e, file.id)}>
                    <MoreIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {menuId && (
          <>
            <MenuItem onClick={() => { onStarCV(menuId); handleMenuClose(); }}>
              <StarIcon fontSize="small" sx={{ mr: 1 }} /> {files.find(f => f.id === menuId)?.starred ? 'Remove star' : 'Star'}
            </MenuItem>
            <MenuItem>
              <DownloadIcon fontSize="small" sx={{ mr: 1 }} /> Download
            </MenuItem>
            <MenuItem>
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Rename
            </MenuItem>
            <MenuItem onClick={() => { onDeleteCV(menuId); handleMenuClose(); }} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Paper>
  );
};

export default CVList;