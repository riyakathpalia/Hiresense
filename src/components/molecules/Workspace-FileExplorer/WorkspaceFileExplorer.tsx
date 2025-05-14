import { FileUploadProvider } from '@/context/FileUploadContext';
import React, { useState } from 'react';

import { useMetProAiContext } from '@/context/MetProAiContext';
import { useWorkspace } from '@/context/WorkspaceContext';
import { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/system';

// Atoms 

// Molecules
import FileExplorerContent from '@/components/molecules/FileExplorerContent/FileExplorerContent';
import { Tabs, TabsList, TabsTrigger } from '@/components/molecules/tabs/Tabs';


// MUI Icons 

// React Lucide Icons
import { KeyboardArrowDown } from '@mui/icons-material';
import {
  File,
  FileText,
  Folder
} from 'lucide-react';
import { ComponentCarousel } from '../Carousel/Carousel';


interface Folder {
  type: string;
  files?: (Folder | File)[];
}


interface WorkspaceFileExplorerProps {
  type?: 'medical_documents' | 'patient_documents';
  onSuccess?: (response: string) => void;
  sx?: SxProps<Theme>
}


const WorkspaceFileExplorer: React.FC<WorkspaceFileExplorerProps> = ({ onSuccess }) => {
  const { activeWorkspace, isLoading, refreshWorkspaces } = useWorkspace();
  console.log("Active Workspace: ", activeWorkspace?.folders);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [shortlisting, setShortlisting] = useState(false);
  const { medical_documents, patient_documents } = useMetProAiContext();
  const [checkedJDFiles, setCheckedJDFiles] = useState<string[]>([]);
  // checked use state for Listing the JD's
  const [checked, setChecked] = useState<number[]>([]);
  //const [jdUploadResponse, setJdUploadResponse] = useState<string | null>(null);

  // State to manage the current slide index
  // This state is used to track which slide (JD or Resumes) is currently active in the UI
  const [currentSlide, setCurrentSlide] = useState(1)

  // State to manage the expansion of FileExplorer
  const [isFileExplorerExpanded, setIsFileExplorerExpanded] = useState(true);


  const slides = [
    <FileExplorerContent onSuccess={onSuccess} type={"medical_documents"} />,
    <FileExplorerContent type={"patient_documents"} />,
  ]

  return (
    <FileUploadProvider>

      <Box sx={{
        width: '100%',
        border: 1,
        borderRadius: 2,
        p: 2
      }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            cursor: "pointer",
          }}
        >
          <Tabs
            defaultValue="medical"
            value={currentSlide === 0 ? "medical" : "patient"}
            onValueChange={(val) => {
              if (val === "patient") setCurrentSlide(1);
              if (val === "medical") setCurrentSlide(0);
            }}
            style={{
              width: "100%",
            }}
          >
            <TabsList
              style={{
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <TabsTrigger
                value="patient"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: currentSlide === 1 ? 'bold' : 'normal',
                  backgroundColor: currentSlide === 1 ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  borderRadius: 8,
                  padding: '6px 12px',
                  transition: '0.2s',
                }}
              >
                <FileText style={{ width: 20, height: 20 }} />
                <span>Patient Documents</span>
              </TabsTrigger>
              <TabsTrigger
                value="medical"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: currentSlide === 0 ? 'bold' : 'normal',
                  backgroundColor: currentSlide === 0 ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  borderRadius: 8,
                  padding: '6px 12px',
                  transition: '0.2s',
                }}
              >
                <File style={{ width: 20, height: 20 }} />
                <span>Medical Documents</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>


          <Box sx={{
            '&hover': { backgroundColor: 'BlueMirage.main' },
          }}>
            <KeyboardArrowDown
              sx={{
                color: "text.secondary",
                transition: "transform 0.2s",
                ...(isFileExplorerExpanded && {
                  transform: "rotate(180deg)",
                }),
                cursor: "pointer",
              }}
              onClick={() => setIsFileExplorerExpanded(!isFileExplorerExpanded)}
            />
          </Box>
        </Box>
        <Box sx={{ height: 400, }}>
          <ComponentCarousel
            sx={{
              overflowY: "auto",
            }}
            slides={slides}
            currentIndex={currentSlide}
            onChangeIndex={(index, direction) => setCurrentSlide(index)}
          />
        </Box>
      </Box>
    </FileUploadProvider>
  );
};

export default WorkspaceFileExplorer;