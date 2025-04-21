// src/types/medicalDocument.ts
export interface MedicalDocument {
    id: string;
    name: string;
    uploadDate?: Date | string;
    fileSize?: number;
    documentType?: string; // Example specific to medical documents
    patientId?: string;    // Example specific to medical documents
    // ... other properties from your API
    [key: string]: any;
  }