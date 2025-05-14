import axios, { AxiosResponse } from 'axios';

// Strict type for request body
interface ChatRequest {
  message: string;
}

// Precise response type matching Swagger
interface ChatResponse {
  reply: string;
}

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

export const ChatApi = {
  /**
   * Send a message to the AI copilot
   * @param {string} message - User's message to the AI
   * @returns {Promise<string>} AI's reply
   * @throws {Error} If message is empty or API call fails
   */
  sendMessage: async (message: string): Promise<string> => {
    if (!message || message.trim() === '') {
      throw new Error('Message cannot be empty');
    }

    try {
      const response = await API.post<ChatResponse>('/chat', { message });
      return response.data.reply;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw error;
    }
  },
};

export default ChatApi;
