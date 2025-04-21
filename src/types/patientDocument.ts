// src/types/patientDocument.ts
export interface PatientDocument {
    id: string;
    name: string;
    uploadDate?: Date | string;
    fileSize?: number;
    // ... other properties specific to patient documents from your API
    [key: string]: any;
  }