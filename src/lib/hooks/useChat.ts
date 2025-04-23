// src/hooks/useChat.ts
import { useState, useCallback } from 'react';
import { ChatApi } from '@/lib/api/chatApi';

interface Message {
  id: string;
  ChatResponse: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseChat {
  messages: Message[];
  loading: boolean;
  sendMessage: (message: string) => Promise<Message | null>;
  clearMessages: () => void;
}

/**
 * Custom hook for managing chat conversations
 * @returns {UseChat} Chat methods and state
 */
export const useChat = (): UseChat => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Helper function to create a unique ID
  const createId = () => Date.now().toString();

  const sendMessage = useCallback(async (message: string): Promise<Message | null> => {
    if (!message.trim()) return null;

    // Add user message
    const userMessage: Message = {
      id: createId(),
      ChatResponse: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await ChatApi.sendMessage(message);

      const aiMessage: Message = {
        id: createId(),
        ChatResponse: response.data.reply,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      return aiMessage;
    } catch (err) {
      console.error('Chat API Error:', err); // Optional: for debugging

      const errorMessage: Message = {
        id: createId(),
        ChatResponse: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      return null;
    } finally {
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
