
// Type Definitions based on your Swagger file
export interface ResumeFile {
    name: string;
    file_path: string;
}


export interface JobDescriptionFile {
    name: string;
    file_path: string;
}

export interface ApiResponse<T = any> {
    message?: string;
    error?: string;
    [key: string]: any;
}

export interface UploadResponse extends ApiResponse {
    saved_files: ResumeFile[];
}

export interface ResumesListResponse extends ApiResponse {
    resumes: ResumeFile[];
}

export interface ChatResponse extends ApiResponse {
    reply: string;
    matched_candidates?: Array<{
        name: string;
        relevance_score: number;
    }>;
}

export interface SummaryResponse extends ApiResponse {
    summary: string;
    skills: string[];
}
