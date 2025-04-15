import { useState, useCallback } from 'react';
import {HireSenseAPI} from '@/lib/api/flask-api';
import { ResumeFile } from '@/types/api/HireSenseApiProps';
import { HireSenseNextAPI } from '../api/next-api';


// Custom hook for resume operations
export const useResumes = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resumes, setResumes] = useState<ResumeFile[]>([]);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await HireSenseAPI.listResumes();
      setResumes(response.resumes || []);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch resumes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadResumes = useCallback(async (files: File[], workspaceName:string) => {
    setLoading(true);
    setError(null);
    console.log('Uploading resumes:', files);
    
    try {
      const response = await HireSenseNextAPI.uploadResumeFiles(files, workspaceName);
      console.log('Resumes uploaded:', response);
      // Refresh the resume list
      await fetchResumes();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to upload resumes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchResumes]);

  const deleteResume = useCallback(async (resumeId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await HireSenseAPI.deleteResume(resumeId);
      // Refresh the resume list
      await fetchResumes();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to delete resume');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchResumes]);

  const getSummary = useCallback(async (filePath: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await HireSenseAPI.getCVSummary(filePath);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to get CV summary');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    resumes,
    loading,
    error,
    fetchResumes,
    uploadResumes,
    deleteResume,
    getSummary
  };
};

// Custom hook for job description operations
export const useJobDescriptions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadJobDescriptions = useCallback(async (files: File[], workspaceName:string) => {
    setLoading(true);
    setError(null);
    
    //const jsonString = JSON.stringify(filePath[0]);
    //console.log('data:', filePath[0]);

    //console.log('Job description data:(JSON String)', jsonString);
    //console.log('Uploading job description:', jsonString);
    
    try {
      const uplaoded_file_paths = await HireSenseNextAPI.uploadJobDescriptionFiles(files, workspaceName);
      console.log("Uploaded File Paths: ",uplaoded_file_paths)
      const response = await HireSenseAPI.uploadJobDescriptions(uplaoded_file_paths);

      //console.log('Job description uploaded:', response);

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to upload job description');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteJobDescription = useCallback(async (jdId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await HireSenseAPI.deleteJobDescription(jdId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to delete job description');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    uploadJobDescriptions,
    deleteJobDescription
  };
};

// Custom hook for chat operations
export const useHireSenseChat = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ message: string; reply: string }[]>([]);

  const sendMessage = useCallback(async (message: string, jdSearch: boolean = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await HireSenseAPI.sendChatMessage(message, jdSearch);
      
      setChatHistory(prev => [
        ...prev,
        { message, reply: response.reply }
      ]);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendKeywordChat = useCallback(async (keyword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await HireSenseAPI.sendKeywordChat(keyword);
      
      setChatHistory(prev => [
        ...prev,
        { message: `Keyword: ${keyword}`, reply: response.reply }
      ]);
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to send keyword chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setChatHistory([]);
  }, []);

  return {
    loading,
    error,
    chatHistory,
    sendMessage,
    sendKeywordChat,
    clearChat
  };
};

// Custom hook for system operations
export const useHireSenseSystem = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const resetAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await HireSenseAPI.resetAllData();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to reset data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    resetAllData
  };
};

// Combined hook for all HireSense operations
export const useHireSense = () => {
  const resumes = useResumes();
  const jobDescriptions = useJobDescriptions();
  const chat = useHireSenseChat();
  const system = useHireSenseSystem();

  return {
    resumes,
    jobDescriptions,
    chat,
    system
  };
};

export default useHireSense;