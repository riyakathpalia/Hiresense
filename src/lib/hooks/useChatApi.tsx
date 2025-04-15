import { useState, useCallback } from 'react';
import { HireSenseAPI, ChatResponse } from '@/lib/api/axios-config';
import { useToast } from '@/lib/hooks/useToast';

interface MessageType {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseChatApiOptions {
  onMessageSent?: (message: MessageType) => void;
  onResponseReceived?: (message: MessageType, response: ChatResponse) => void;
  onError?: (error: any) => void;
}

export const useChatApi = (options?: UseChatApiOptions) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a unique ID for messages
  const createId = () => Date.now().toString();

  // Send a chat message to the API
  const sendChatMessage = useCallback(async (content: string, jdSearch: boolean = true) => {
    if (!content.trim()) return null;
    
    // Create user message
    const userMessage: MessageType = {
      id: createId(),
      content,
      isUser: true,
      timestamp: new Date(),
    };
    
    // Call onMessageSent callback if provided
    if (options?.onMessageSent) {
      options.onMessageSent(userMessage);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Make API call
      const response = await HireSenseAPI.sendChatMessage(content, jdSearch);
      
      // Create AI response message
      const aiMessage: MessageType = {
        id: createId(),
        content: response.reply,
        isUser: false,
        timestamp: new Date(),
      };
      
      // Call onResponseReceived callback if provided
      if (options?.onResponseReceived) {
        options.onResponseReceived(aiMessage, response);
      }
      
      return { userMessage, aiMessage, response };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send message';
      setError(errorMessage);
      
      // Call onError callback if provided
      if (options?.onError) {
        options.onError(err);
      } else {
        // Default error handling
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return { userMessage, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  // Send a keyword-based chat message
  const sendKeywordChat = useCallback(async (keyword: string) => {
    if (!keyword.trim()) return null;
    
    // Create user message
    const userMessage: MessageType = {
      id: createId(),
      content: `Search for keyword: ${keyword}`,
      isUser: true,
      timestamp: new Date(),
    };
    
    // Call onMessageSent callback if provided
    if (options?.onMessageSent) {
      options.onMessageSent(userMessage);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Make API call
      const response = await HireSenseAPI.sendKeywordChat(keyword);
      
      // Create AI response message
      const aiMessage: MessageType = {
        id: createId(),
        content: response.reply,
        isUser: false,
        timestamp: new Date(),
      };
      
      // Call onResponseReceived callback if provided
      if (options?.onResponseReceived) {
        options.onResponseReceived(aiMessage, response);
      }
      
      return { userMessage, aiMessage, response };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process keyword';
      setError(errorMessage);
      
      // Call onError callback if provided
      if (options?.onError) {
        options.onError(err);
      } else {
        // Default error handling
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return { userMessage, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  // Get a CV summary
  const getCVSummary = useCallback(async (filePath: string) => {
    if (!filePath) return null;
    
    // Create user message
    const userMessage: MessageType = {
      id: createId(),
      content: "Generate a summary of this resume",
      isUser: true,
      timestamp: new Date(),
    };
    
    // Call onMessageSent callback if provided
    if (options?.onMessageSent) {
      options.onMessageSent(userMessage);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Make API call
      const response = await HireSenseAPI.getCVSummary(filePath);
      
      // Create AI response message with summary
      const summaryMessage: MessageType = {
        id: createId(),
        content: response.summary,
        isUser: false,
        timestamp: new Date(),
      };
      
      // Create additional message for skills if available
      let skillsMessage: MessageType | null = null;
      if (response.skills && response.skills.length > 0) {
        skillsMessage = {
          id: createId(),
          content: `Key skills: ${response.skills.join(', ')}`,
          isUser: false,
          timestamp: new Date(),
        };
      }
      
      // Call onResponseReceived callback for summary
      if (options?.onResponseReceived) {
        options.onResponseReceived(summaryMessage, { ...response, reply: response.summary });
        
        // Call again for skills if available
        if (skillsMessage && options?.onResponseReceived) {
          options.onResponseReceived(skillsMessage, { ...response, reply: response.summary });
        }
      }
      
      return { 
        userMessage, 
        summaryMessage, 
        skillsMessage, 
        response 
      };
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate summary';
      setError(errorMessage);
      
      // Call onError callback if provided
      if (options?.onError) {
        options.onError(err);
      } else {
        // Default error handling
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return { userMessage, error: err };
    } finally {
      setIsLoading(false);
    }
  }, [options, toast]);

  return {
    isLoading,
    error,
    sendChatMessage,
    sendKeywordChat,
    getCVSummary
  };
};

export default useChatApi;