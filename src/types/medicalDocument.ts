// src/types/medicalDocument.ts
export interface MedicalDocument {
  id: string;
  name: string;
  uploadDate?: Date | string;
  fileSize?: number;
  documentType?: string; // Example specific to medical documents
  patientId?: string;    // Example specific to medical documents
  // Use Record<string, unknown> instead of [key: string]: any
  [key: string]: unknown;  // This allows any additional properties but restricts the type to be more specific
}
