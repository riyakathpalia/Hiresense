"use client"
import { MetProAiNextAPI } from '@/lib/api/next-api';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Define or import the Workspace type
export interface Folder {
  id: string;
  name: string;
  type: 'patient_documents' | 'medical_documents';
  children: (Folder | File)[];
  files?: string[]; // Optional property for files directly in the folder
}

export interface File {
  id: string;
  name: string;
  type: 'file';
  fileType: string;
  url: string;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
}

export interface Workspace {
  id: string;
  name: string;
  folders: Folder[];
  createdAt?: Date;
  updatedAt?: Date;
  collaborators?: Collaborator[];
  type?: 'medical_documents' | 'patient_documents';
  filePath?: string;
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
  addWorkspace: (workspace: Workspace) => void;
  deleteWorkspace: (workspaceId: string) => void;
  refreshWorkspaces: () => Promise<void>;
  isLoading?: boolean;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('activeWorkspace');
      console.log('Saved active workspace:', saved);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadWorkspaces = useCallback(async () => {
    setIsLoading(true);
    console.log('Loading workspaces...');
    try {
      const workspacesData: Workspace[] = await MetProAiNextAPI.getWorkspaces();
      console.log('Fetched workspaces:', workspacesData);

      setWorkspaces(workspacesData);

      // Check if there are any workspaces available
      if (workspacesData.length === 0) {
        console.log('No workspaces found, creating default workspace...');
        // Create a default workspace if none exist
        const defaultWorkspace = await MetProAiNextAPI.createDefaultWorkspace();
        setWorkspaces([defaultWorkspace]);
        setActiveWorkspace(defaultWorkspace);
        loadWorkspaces();
      } else {
        if (!activeWorkspace) {
          console.log("Setting active workspace to the first one in the list...");
          setActiveWorkspace(workspacesData[0]);
        } else {
          // Check if the active workspace is still valid
          const updated = workspacesData.find((w) => w.id === activeWorkspace.id);
          console.log("Updated active workspace:", updated);
          setActiveWorkspace(updated || workspacesData[0]);
        }
      }
      // Mark initialization as complete
      setIsInitialized(true);
    } catch (err) {
      console.error('Error loading workspaces:', err);
    }finally{
      setIsLoading(false);
      setIsInitialized(true);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('workspaces', JSON.stringify(workspaces));
      if (activeWorkspace) {
        localStorage.setItem('activeWorkspace', JSON.stringify(activeWorkspace));
      }
    }
  }, [workspaces, activeWorkspace, isInitialized]);

  const refreshWorkspaces = async () => {
    await loadWorkspaces();
  };

  const addWorkspace = (workspace: Workspace) => {
    setWorkspaces((prev) => [...(prev || []), workspace]);
    setActiveWorkspace(workspace);
  };

  const deleteWorkspace = (workspaceId: string) => {
    setWorkspaces((prev) => (prev || []).filter((w) => w.id !== workspaceId));
    if (activeWorkspace?.id === workspaceId) {
      const remaining = (workspaces || []).filter((w) => w.id !== workspaceId);
      setActiveWorkspace(remaining[0] || null);
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces: workspaces || [],
        activeWorkspace,
        setActiveWorkspace,
        addWorkspace,
        deleteWorkspace,
        refreshWorkspaces,
        isLoading
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};