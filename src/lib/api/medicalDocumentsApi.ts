// src/services/api/medicalDocumentsApi.js
import API from './axios-config';

// Medical document endpoints
export const MedicalDocumentsApi = {
  /**
   * Upload multiple medical documents from file paths
   * @param {Array} filePaths - Array of file paths
   * @returns {Promise} - API response
   */
  uploadDocuments: (filePaths: string[]) => {
    return API.post('/upload/medical_documents', {
      file_paths: filePaths
    });
  },
  
  /**
   * Delete a specific medical file by filename
   * @param {string} fileName - Name of the file to delete
   * @returns {Promise} - API response
   */
  deleteFile: (fileName: string) => {
    return API.delete(`/delete/medical_file/${fileName}`);
  },
  
  /**
   * Extract content from URLs and save as medical PDFs
   * @param {string|Array} urls - Single URL or array of URLs
   * @returns {Promise} - API response
   */
  extractAndSavePdf: (urls: string | string[]) => {
    return API.post('/extract/save_pdf_medical', { urls });
  }
};

export default MedicalDocumentsApi;