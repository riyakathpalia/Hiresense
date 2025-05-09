export interface ApiResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
  data: unknown;
}

//  Types for medical and patient documents
export interface MedicalDocumentFile {
  name: string;
  file_path: string;
}

export interface PatientDocumentFile {
  name: string;
  file_path: string;
}


export interface UploadResponse extends ApiResponse {
  saved_files?: MedicalDocumentFile[] | PatientDocumentFile[];
}

export interface ListDocumentsResponse extends ApiResponse {
  medical_documents?: MedicalDocumentFile[];
  patient_documents?: PatientDocumentFile[];
}

export interface ProcessUrlItem {
  url: string;
  status: string;
  [key: string]: unknown; // To accommodate other potential properties
}

export interface ProcessUrlResponse {
  status: string;
  message: string;
}


export interface ChatResponse {
  reply: string;
}

export interface ErrorResponse {
  error: string;
  failed_files?: string[];
}