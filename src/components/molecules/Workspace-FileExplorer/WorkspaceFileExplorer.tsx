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


    // Listed Jd's checkbox Handler
    // const handleToggle = (value: number) => () => {
    //   const currentIndex = checked.indexOf(value);
    //   const newChecked = [...checked];

    //   if (currentIndex === -1) {
    //     newChecked.push(value);
    //   } else {
    //     newChecked.splice(currentIndex, 1);
    //   }

    //   setChecked(newChecked);
    // };

    // Helper function to check if there are folders of the given type
    //const hasFolders = activeWorkspace?.folders?.some((f) => f.type === type) ?? false;

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    // Handle upload button click
    // This function is called when the upload button is clicked
    // const handleUpload = async () => {
    //   if (files.length === 0) {
    //     console.log('No files selected for upload');
    //     enqueueSnackbar(`Please select at least one ${type === 'resumes' ? 'resume' : 'job description'} to upload.`, {
    //       variant: 'error',
    //     });
    //     return;
    //   }

    //   const uploadHandler = type === 'resumes' ? resumes.uploadResumes : jobDescriptions.uploadJobDescriptions;
    //   setUploading(true);

    //   try {
    //     const response = await handleFileInputChange(files, uploadHandler, activeWorkspace?.name || 'defaultWorkspace');
    //     console.log(`${type} Upload response:`, response);

    //     if (response) {
    //       refreshWorkspaces(); // Refresh the workspace after upload
    //       if (type === 'jd') {
    //         onJDUploadSuccess?.(JSON.stringify(response)); // Call the onJDUploadSuccess callback if provided
    //       }
    //     }
    //     enqueueSnackbar(`${type === 'resumes' ? 'Resumes' : 'Job descriptions'} uploaded successfully!`, {
    //       variant: 'success',
    //     });
    //     setFiles([]); // Clear files after successful upload
    //   } catch (error) {
    //     console.error('Upload error:', error);
    //     enqueueSnackbar(`Failed to upload ${type === 'resumes' ? 'resumes' : 'job descriptions'}.`, { variant: 'error' });
    //   } finally {
    //     setUploading(false);
    //   }
    // }

    const handleCheckedJDToggle = (fileName: string) => () => {
        setCheckedJDFiles(prev => {
            if (prev.includes(fileName)) {
                return prev.filter(name => name !== fileName);
            } else {
                return [...prev, fileName];
            }
        });
    };


    const handleShortlisting = async () => {
        console.log("Shortlisting JD's: ", checkedJDFiles);
    }


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
                    <Tabs defaultValue="Medical" style={{
                        width: "100%",
                    }} onValueChange={(val) => {
                        if (val === "patient") setCurrentSlide(0);
                        if (val === "medical") setCurrentSlide(1);
                    }}>
                        <TabsList style={{
                            width: "100%",
                            justifyContent: "space-around",

                        }}>
                            <TabsTrigger value="medical" onClick={() => setCurrentSlide(1)}>
                                <FileText style={{
                                    width: 20,
                                    height: 20,
                                }} />
                                <span>Patient Documents</span>
                            </TabsTrigger>
                            <TabsTrigger value="jd" onClick={() => {
                                setCurrentSlide(0)
                                setIsFileExplorerExpanded(true)
                            }}>
                                <File style={{
                                    width: 20,
                                    height: 20,
                                }} />
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


                {/* {isFileExplorerExpanded && (
          <>
            <CardHeader>
              <Box sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <CardTitle>
                    <Box sx={{ fontSize: '1.125rem' }}>{type == 'jd' ? "Job Descriptions" : "Resumes"}</Box>
                  </CardTitle>
                  {hasFolders ? (
                    <>
                      <CustomButton variant="outline" size="small" onClick={() => document.getElementById(`workspace-input-${type}`)?.click()}>
                        <Plus style={{ height: 16, width: 16, marginRight: 2 }} />
                        Add Files
                      </CustomButton>
                      <input
                        id={`workspace-input-${type}`}
                        type="file"
                        multiple
                        accept={type === 'resumes' ? '.pdf,.docx,.doc,.rtf,.txt' : '.pdf,.docx,.doc,.txt'}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </>
                  ) : (<></>)}
                </Box>
              </Box>

            </CardHeader>
            <CardContent>

              {isLoading ? (
                // Skeleton loader while data is loading
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[...Array(3)].map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      height={36}
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
              ) : (
                <ScrollArea style={{ display: "flex", flexDirection: "column", border: 1, borderColor: "red" }}>
                  {hasFolders ? (
                    <List sx={{ width: '100%', bgcolor: 'background.paper', display: "flex", flexDirection: "column", gap: 1 }}>

                      {activeWorkspace?.folders
                        .filter((folder) => folder.type === "jd") // Filter folders by type (jd or resume)
                        .map((folder, folderIndex) => {
                          const labelIdPrefix = `checkbox-list-label-${folderIndex}`;

                          return (
                            <React.Fragment key={folderIndex}>
                              {folder.files?.map((file: string, fileIndex: number) => {
                                const labelId = `${labelIdPrefix}-${fileIndex}`;
                                return (
                                  <ListItem
                                    disablePadding
                                    secondaryAction={
                                      <IconButton
                                        edge="end"
                                        className="delete-icon"
                                        //onClick={() => handleDelete(index)}
                                        sx={{
                                          opacity: 0,
                                          transition: 'opacity 0.2s',
                                          color: 'error.main',
                                          '&:hover': {
                                            backgroundColor: 'error.light',
                                          },
                                        }}
                                      >
                                        <Trash2 fontSize="small" />
                                      </IconButton>
                                    }
                                    sx={{
                                      '&:hover .delete-icon': {
                                        opacity: 1,
                                      },
                                      border: 1, borderRadius: 1, borderColor: 'divider'
                                    }}
                                  >
                                    <ListItemButton role={undefined} onClick={handleCheckedJDToggle(file)} dense>
                                      {type === 'jd' &&
                                        <ListItemIcon>
                                          <Checkbox
                                            edge="start"
                                            checked={checkedJDFiles.includes(file)}
                                            tabIndex={-1}
                                            inputProps={{ 'aria-labelledby': labelId }}
                                            sx={{
                                              '&.Mui-checked': {
                                                color: 'Dodgerblue',
                                              },
                                            }}
                                          />
                                        </ListItemIcon>
                                      }

                                      <ListItemText id={labelId} primary={
                                        // this prints each file name
                                        <div key={fileIndex}>{file}</div>
                                      } />
                                    </ListItemButton>
                                  </ListItem>
                                )
                              })}

                            </React.Fragment>
                          )
                        })}
                    </List>
                    // <Box sx={{ "& > * + *": { mt: 1 } }}>
                    //   {activeWorkspace?.folders
                    //     .filter((folder) => folder.type === type) // Filter folders by type (jd or resume)
                    //     .map((folder, index) => (
                    //       <FolderItem key={index} folder={folder as Folder} />
                    //     ))}
                    // </Box>
                  ) : (
                    <WorkspaceUpload type={type} onJDUploadSuccess={onJDUploadSuccess} /> // Show upload component if no folders of the specified type exist
                  )}
                </ScrollArea>
              )}

              {files.length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected {type === 'resumes' ? 'resumes' : 'job descriptions'} ({files.length})
                  </Typography>
                  <List
                    dense
                    sx={{
                      maxHeight: 160,
                      overflow: 'auto',
                      pr: 1,
                      bgcolor: 'action.hover',
                    }}
                  >
                    {files.map((file, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                          >
                            <X size={16} />
                          </IconButton>
                        }
                        sx={{ py: 0.5 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {type === 'resumes' ? <FileText size={16} color="primary" /> : <FileInput size={16} color="primary" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>

          </>
        )}

        {files.length > 0 && (
          <>
            <CardFooter>
              <Box display="flex" gap={1}>
                <CustomButton
                  variant="outline"
                  onClick={() => setFiles([])}
                  disabled={files.length === 0}
                  size="small"
                >
                  Clear All
                </CustomButton>
                <CustomButton
                  variant="primary"
                  onClick={handleUpload}
                  //disabled={files.length === 0 || uploading}
                  startIcon={!uploading && <UploadIcon size={16} />}
                  size="small"
                >
                  {uploading ? `Uploading ${type === 'resumes' ? 'resumes' : 'job descriptions'}...` : `Upload`}
                </CustomButton>
              </Box>
            </CardFooter>
          </>
        )}
        {checkedJDFiles.length > 0 && (
          <Box sx={{ position: 'sticky', backgroundColor: "BlueMirage.main", bottom: 0, p: 2, zIndex: 10 }}>

            <CustomButton
              variant="primary"
              onClick={handleShortlisting}
              //disabled={files.length === 0 || uploading}
              startIcon={!uploading && <UploadIcon size={16} />}
              size="small"
            >
              {shortlisting ? `${type === 'resumes' ? 'resumes Shortlisting' : 'job descriptions Shortlisting'}...` : `Shortlist`}
            </CustomButton>
          </Box>
        )} */}
            </Box>
        </FileUploadProvider>
    );
};

export default WorkspaceFileExplorer;