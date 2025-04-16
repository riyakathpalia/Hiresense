// src/services/api/index.js
import API from './axios-config';
import MedicalDocumentsApi from './medicalDocumentsApi';
import PatientDocumentsApi from './patientDocumentsApi';
import ChatApi from './chatApi';

// Export everything from a single entry point
export {
  API,
  MedicalDocumentsApi,
  PatientDocumentsApi,
  ChatApi
};

// Data reset function (if needed)
export const resetAllData = async (check = 'reset all') => {
  try {
    const response = await API.post('/reset/all', { check });
    return response;
  } catch (error) {
    throw error;
  }
};