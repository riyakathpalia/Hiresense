import React, { useState } from 'react';
import { FileText, ChevronRight, ChevronDown, MoreHorizontal, Plus, Trash, Upload, Folder as FolderIcon } from 'lucide-react';
import { ScrollArea } from '@/components/atoms/scroll-area/ScrollArea';
import CustomButton from '@/components/atoms/button/CustomButton';
import { CardContent, CardHeader, CardTitle } from '@/components/molecules/Card/Card';
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
import { Folder } from '@/context/WorkspaceContext';

interface File {
  type: 'file';
  name: string;
}


interface UploadResponse {
  id: string;
  name: string;
  type: string;
}

const FolderItem = ({ item, depth = 0 }: { item: Folder; depth?: number }) => {
  const [isOpen, setIsOpen] = useState(false);

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
        <FolderIcon style={{ height: 16, width: 16, marginRight: 8, color: 'var(--mui-palette-primary-main)' }} />
        <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</Box>
        <DropdownMenu open={false}>
          <DropdownMenuTrigger onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <CustomButton
              variant="primary"
              size="small"
              sx={{
                height: 24,
                width: 24,
                opacity: 0,
                '&:hover': { opacity: 1 },
                '.group:hover &': { opacity: 1 },
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
            <DropdownMenuItem sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'error.main' }}>
              <Trash style={{ height: 16, width: 16 }} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Box>
      {isOpen && item.children && item.children.map((child, index) => (
        <Box key={index} className="group">
          <FileItem item={child as File} depth={depth + 1} />
        </Box>
      ))}
    </Box>
  );
};

const FileItem = ({ item, depth = 0 }: { item: File; depth?: number }) => {
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
        <DropdownMenuTrigger>
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
          <DropdownMenuItem sx={{ color: 'error.main' }}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Box>
  );
};

interface WorkspaceExplorerProps {
  onSuccess?: (response: UploadResponse) => void;
}

const WorkspaceExplorer: React.FC<WorkspaceExplorerProps> = () => {
  const { activeWorkspace } = useWorkspace();

  const hasMedicalDocument = activeWorkspace?.folders?.some((f) => f.type === 'medical_documents') ?? false;
  const hasPatientDocument = activeWorkspace?.folders?.some((f) => f.type === 'patient_documents') ?? false;

  return (
    <Box sx={{ border: 1, borderRadius: 2, borderColor: 'divider' }}>
      <CardHeader>
        <Box sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <CardTitle>
              <Box sx={{ fontSize: '1.125rem' }}>File Explorer</Box>
            </CardTitle>
          </Box>
        </Box>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="medical">
          <TabsList>
            <TabsTrigger value="medical_documents">Medical Documents</TabsTrigger>
            <TabsTrigger value="patient_documents">Patient Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="medical_documents">
            <ScrollArea style={{ height: 'calc(100vh - 20rem)', display: 'flex', flexDirection: 'column', border: 1 }}>
              {hasMedicalDocument ? (
                <Box sx={{ '& > * + *': { mt: 1 } }}>
                  {activeWorkspace?.folders
                    .filter((f) => f.type === 'medical_documents')
                    .map((folder, index) => (
                      <FolderItem key={index} item={folder as Folder} />
                    ))}
                </Box>
              ) : (
                <WorkspaceUpload type="medical_documents" />
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="patient_documents">
            <ScrollArea style={{ height: 'calc(100vh - 20rem)' }}>
              {hasPatientDocument ? (
                <Box sx={{ '& > * + *': { mt: 1 } }}>
                  {activeWorkspace?.folders
                    .filter((f) => f.type === 'patient_documents')
                    .map((folder, index) => (
                      <FolderItem key={index} item={folder as Folder} />
                    ))}
                </Box>
              ) : (
                <WorkspaceUpload
                  type="patient_documents"
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