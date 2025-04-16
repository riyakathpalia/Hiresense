// src/services/api/patientDocumentsApi.js
import API from './axios-config';

// Patient document endpoints
export const PatientDocumentsApi = {
  /**
   * Upload multiple patient documents from file paths
   * @param {Array} filePaths - Array of file paths
   * @returns {Promise} - API response
   */
  uploadDocuments: (filePaths) => {
    return API.post('/upload/patient_documents', {
      file_paths: filePaths
    });
  },
  
  /**
   * Delete a specific patient file by filename
   * @param {string} fileName - Name of the file to delete
   * @returns {Promise} - API response
   */
  deleteFile: (fileName) => {
    return API.delete(`/delete/patient_file/${fileName}`);
  },
  
  /**
   * Extract content from URLs and save as patient PDFs
   * @param {string|Array} urls - Single URL or array of URLs
   * @returns {Promise} - API response
   */
  extractAndSavePdf: (urls: string | string[]) => {
        return API.post('/extract/save_pdf_patient', { urls });
  }
};

export default PatientDocumentsApi;