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
  
  /**
   * Get a summary of a CV/resume
   * @param {string} filePath - Path to the resume file
   * @returns {Promise} - API response with resume summary
   */
  getCVSummary: (filePath: string) => {
    return API.post('/chat', {
      message: `Generate a summary of the resume at: ${filePath}`
    });
  },
  
  /**
   * Find job matches for a resume
   * @param {string} resumeId - ID of the resume
   * @returns {Promise} - API response with job matches
   */
  findJobMatches: (resumeId: string) => {
    return API.post('/chat', {
      message: `Find job matches for resume ID: ${resumeId}`
    });
  },
  
  /**
   * Find candidate matches for a job
   * @param {string} jobId - ID of the job
   * @returns {Promise} - API response with candidate matches
   */
  findCandidateMatches: (jobId: string) => {
    return API.post('/chat', {
      message: `Find candidate matches for job ID: ${jobId}`
    });
  }
};

export default ChatApi;