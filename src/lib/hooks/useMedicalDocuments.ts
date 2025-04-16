import { useApi } from './useApi';
import { MedicalDocumentsApi } from '@/lib/api/medicalDocumentsApi';

export const useUploadMedicalDocuments = () => {
  return useApi(MedicalDocumentsApi.uploadDocuments);
};

export const useDeleteMedicalFile = () => {
  return useApi(MedicalDocumentsApi.deleteFile);
};

export const useExtractMedicalPdf = () => {
  return useApi(MedicalDocumentsApi.extractAndSavePdf);
};