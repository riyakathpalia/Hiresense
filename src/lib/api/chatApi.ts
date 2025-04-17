// src/services/api/chatApi.ts
import API from './axios-config';

// Extended Chat API with workspace-specific methods
export const ChatApi = {
  /**
   * Send a message to the AI assistant
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