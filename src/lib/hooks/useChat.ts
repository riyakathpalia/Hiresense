import { useState, useCallback } from 'react';
import { ChatApi } from '@/lib/api/chatApi';

// More descriptive interface naming
interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseChatHook {
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (message: string) => Promise<ChatMessage | null>;
  clearMessages: () => void;
}

interface ChatApiResponse {
  reply: string;
}

/**
 * Custom hook for managing chat conversations
 * @returns {UseChatHook} Chat methods and state
 */
export const useChat = (): UseChatHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // More robust ID generation
  const createId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const sendMessage = useCallback(async (message: string): Promise<ChatMessage | null> => {
    // Trim and validate message
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return null;

    // Add user message
    const userMessage: ChatMessage = {
      id: createId(),
      content: trimmedMessage,
      isUser: true, 
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const loadingTimer = setTimeout(() => setLoading(true), 300);

    try {
      // Updated to match the previous ChatApi implementation
      const responseString = await ChatApi.sendMessage(trimmedMessage);
      const response: ChatApiResponse = JSON.parse(responseString);

      const aiMessage: ChatMessage = {
        id: createId(),
        content: response.reply, // Directly use the response string
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      return aiMessage;
    } catch (err) {
      console.error('Chat API Error:', err);

      const errorMessage: ChatMessage = {
        id: createId(),
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      return null;
    } finally {
      clearTimeout(loadingTimer);
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
  };
};

export default useChat;