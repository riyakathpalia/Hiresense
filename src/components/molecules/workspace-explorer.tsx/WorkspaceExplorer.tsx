import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, MoreHorizontal, Plus, Trash, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/atoms/scroll-area/ScrollArea';
import CustomButton from '@/components/atoms/button/CustomButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules/Card/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/molecules/tabs/Tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu/Dropdown';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Box } from '@mui/system';
import WorkspaceUpload from '../workspace-upload/WorkspaceUpload';

const FolderItem = ({ item, depth = 0, onDelete }: { item: any; depth?: number; onDelete?: (item: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item);
    }
  };

  return (
    <Box sx={{ userSelect: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          py: 1.5,
          px: 2,
          borderRadius: '4px',
          '&:hover': { backgroundColor: 'background.paper' },
          cursor: 'pointer',
          fontSize: '0.875rem',
          pl: depth * 2 + 1
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CustomButton variant="ghost" size="small" sx={{ height: 16, width: 16, mr: 1, p: 0 }}>
          {isOpen ? <ChevronDown style={{ height: 16, width: 16 }} /> : <ChevronRight style={{ height: 16, width: 16 }} />}
        </CustomButton>
        <Folder style={{ height: 16, width: 16, marginRight: 8, color: 'var(--mui-palette-primary-main)' }} />
        <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</Box>
        <DropdownMenu open={false}>
          <DropdownMenuTrigger asChild onClick={(e: any) => e.stopPropagation()}>
            <CustomButton
              variant="primary"
              size="small"
              sx={{
                height: 24,
                width: 24,
                opacity: 0,
                '&:hover': { opacity: 1 },
                '.group:hover &': { opacity: 1 }
              }}
            >
              <MoreHorizontal style={{ height: 16, width: 16 }} />
            </CustomButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent open={false}>
            <DropdownMenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Plus style={{ height: 16, width: 16 }} />
              Add File
            </DropdownMenuItem>
            <DropdownMenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Upload style={{ height: 16, width: 16 }} />
              Upload
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'error.main' }}
            >
              <Trash style={{ height: 16, width: 16 }} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Box>
      {isOpen && item.children && item.children.map((child: any, index: number) => (
        <Box key={index} className="group">
          {child.type === 'folder' ? (
            <FolderItem item={child} depth={depth + 1} onDelete={onDelete} />
          ) : (
            <FileItem item={child} depth={depth + 1} onDelete={onDelete} />
          )}
        </Box>
      ))}
    </Box>
  );
};

const FileItem = ({ item, depth = 0, onDelete }: { item: any; depth?: number; onDelete?: (item: any) => void }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(item);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        borderRadius: '4px',
        '&:hover': { backgroundColor: 'background.paper' },
        cursor: 'pointer',
        pl: depth * 2 + 3.5,
        fontSize: '0.875rem'
      }}
    >
      <FileText style={{ height: 16, width: 16, marginRight: 8, color: 'var(--mui-palette-text-secondary)' }} />
      <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</Box>
      <DropdownMenu open={false}>
        <DropdownMenuTrigger asChild>
          <CustomButton
            variant="ghost"
            size="small"
            sx={{
              height: 24,
              width: 24,
              opacity: 0,
              '&:hover': { opacity: 1 },
              '.group:hover &': { opacity: 1 }
            }}
          >
            <MoreHorizontal style={{ height: 16, width: 16 }} />
          </CustomButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent open={false}>
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
};

interface WorkspaceExplorerProps {
  onDocumentUploadSuccess?: (response: any) => void;
  onDeleteFile?: (item: any) => void;
  onDeleteFolder?: (item: any) => void;
}

const WorkspaceExplorer: React.FC<WorkspaceExplorerProps> = ({ onDocumentUploadSuccess, onDeleteFile, onDeleteFolder }) => {
  const [activeTab, setActiveTab] = useState<'documents'>('documents');
  const { activeWorkspace } = useWorkspace();

  const hasDocuments = activeWorkspace?.folders?.some(f => f.type === 'resume' || f.type === 'jd') ?? false;

  const handleFileUploadSuccess = (response: any) => {
    if (onDocumentUploadSuccess) {
      onDocumentUploadSuccess(response);
    }
  };

  const handleDeleteItem = (item: any) => {
    console.log('Deleting item:', item);
    if (item.type === 'folder' && onDeleteFolder) {
      onDeleteFolder(item);
      // After deleting, you might need to fetch updated workspace data
      // or update the local state to reflect the deletion.
    } else if (item.type === 'file' && onDeleteFile) {
      onDeleteFile(item);
      // Similarly, update local state or fetch data after deletion.
    }
    // If you're managing the workspace data locally in the context,
    // you might need to call a function from the context to update it.
    // Example: updateWorkspace(updatedWorkspaceData);
  };

  return (
    <Box sx={{
      border: 1,
      borderRadius: 2,
      borderColor: 'divider',
    }}>
      <CardHeader>
        <Box sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <CardTitle>
              <Box sx={{ fontSize: '1.125rem' }}>File Explorer</Box>
            </CardTitle>
            {/* <CustomButton variant="outline" size="small">
              <Plus style={{ height: 16, width: 16, marginRight: 2 }} />
              Add Folder
            </CustomButton> */}
          </Box>
        </Box>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="documents">Medical Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <ScrollArea style={{ height: 'calc(100vh - 20rem)' }}>
              {hasDocuments ? (
                <Box sx={{ '& > * + *': { mt: 1 } }}>
                  {activeWorkspace?.folders
                    .filter(f => f.type === 'resume' || f.type === 'jd')
                    .map((folder, index) => (
                      <FolderItem key={index} item={folder} onDelete={handleDeleteItem} />
                    ))}
                  {activeWorkspace?.files
                    .filter(f => f.type === 'medicalDocument')
                    .map((file: { name: string; type: string }, index) => (
                      <FileItem key={index} item={file} onDelete={handleDeleteItem} />
                    ))}
                </Box>
              ) : (
                <WorkspaceUpload 
                  type='medicalDocument' 
                  onUploadSuccess={handleFileUploadSuccess} 
                  uploadHandler={() => { /* Add your upload logic here */ }} 
                  uploadUrlHandler={() => { /* Add your upload URL logic here */ }} 
                />
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Box>
  );
};

export default WorkspaceExplorer;