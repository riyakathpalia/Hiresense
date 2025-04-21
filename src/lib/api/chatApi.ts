// src/services/api/chatApi.ts
import axios from 'axios';

// Create an instance of axios if needed
const API = axios.create({
  baseURL: 'https://your-api-base-url.com', // Replace with your API base URL
});

// Extended Chat API with workspace-specific methods
export const ChatApi = {
  /**
    return API.post('/chat', { message }); // Ensure API is an axios instance
   * @param {string} message - User message to send to AI
   * @returns {Promise} - API response with AI reply
   */
  sendMessage: (message: string) => {
    return API.post('/chat', { message });
  },
  
  /**
   * Send a keyword-based search to the AI
   * @param {string} keyword - Keyword to search for
   * @returns {Promise} - API response with matched results
   */
  sendKeywordChat: (keyword: string) => {
    return API.post('/chat', { 
      message: `Search for keyword: ${keyword}` 
    });
  },
  

  
};



export default ChatApi;