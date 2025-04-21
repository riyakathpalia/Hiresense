// src/services/api/index.js
import API from './axios-config';

// Export everything from a single entry point
export {
  API
};

// Data reset function (if needed)
export const resetAllData = async (check = 'reset all') => {
  try {
    const response = await API.uploadMedicalDocuments(['/reset', check]);
    return response;
  } catch (error) {
    throw error;
  }
};
