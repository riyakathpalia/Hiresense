import axios, { AxiosResponse } from 'axios';

// Create an instance of axios with proper base URL
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Match Swagger server URL
  timeout: 10000, // Recommended to add timeout
});

// Define response type to match Swagger
interface ChatApiResponse {
  reply: string;
}

export const ChatApi = {
  /**
   * Send a message to the AI (matches Swagger specification)
   * @param {string} message - User message to send to AI
   * @returns {Promise<ChatApiResponse>} - API response with AI reply
   */
  sendMessage: (message: string): Promise<AxiosResponse<ChatApiResponse>> => {
    return API.post<ChatApiResponse>('/chat', { message });
  },
  
  /**
   * Send a keyword-based search to the AI
   * @param {string} keyword - Keyword to search for
   * @returns {Promise<ChatApiResponse>} - API response with matched results
   */
  sendKeywordChat: (keyword: string): Promise<AxiosResponse<ChatApiResponse>> => {
    return API.post<ChatApiResponse>('/chat', { 
      message: `Search for keyword: ${keyword}` 
    });
  },
  
  /**
   * Send a treatment-related query (example of domain-specific chat)
   * @param {string} condition - Medical condition to inquire about
   * @returns {Promise<ChatApiResponse>} - API response with treatment info
   */
  askAboutTreatment: (condition: string): Promise<AxiosResponse<ChatApiResponse>> => {
    return API.post<ChatApiResponse>('/chat', {
      message: `What is the treatment for ${condition}?`
    });
  }
};

export default ChatApi;