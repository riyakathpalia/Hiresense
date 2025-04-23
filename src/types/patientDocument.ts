// src/types/patientDocument.ts
export interface PatientDocument {
  id: string;
  name: string;
  uploadDate?: Date | string;
  fileSize?: number;
  // ... other properties specific to patient documents from your API
  documentType?: string; // Example specific to medical documents
  patientId?: string;    // Example specific to medical documents
  // Use Record<string, unknown> instead of [key: string]: any
  [key: string]: unknown;
}