// src/app/api/upload/medical/route.ts
import { Blob } from 'buffer';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Disable built-in body parsing to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Base directory where uploaded files will be stored
const BASE_DIR = process.env.BASE_DIR || 'uploads';
const UPLOAD_DIR = path.join(process.cwd(), BASE_DIR);

// Allowed MIME types for medical document uploads
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

// File size limits
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB total upload limit

// Handle POST request to upload medical documents
export async function POST(req: NextRequest) {
  try {
    // Ensure base upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Check if request content is multipart form data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content type must be multipart/form-data' }, { status: 400 });
    }

    // Parse incoming form data
    const formData = await req.formData();

    // Extract workspace name from form data
    // const workspaceName = formData.get('workspaceName') as string;
    // if (!workspaceName) {
    //   return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
    // }

    // Create workspace directory under 'medical' folder
    const MEDICAL_DOC = path.join(UPLOAD_DIR, 'medical_documents');
    if (!existsSync(MEDICAL_DOC)) {
      await mkdir(MEDICAL_DOC, { recursive: true });
    }

    // Get all uploaded files
    const files = formData.getAll('file');
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    let totalSize = 0;
    const processedFiles = [];

    // Loop through and process each file
    for (const file of files) {
      if (!(file instanceof Blob)) {
        console.log('Invalid file object:', file);
        continue;
      }

      // Validate file type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        console.log(`File type not allowed: ${file.type}`);
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        continue;
      }

      totalSize += file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        return NextResponse.json({ error: 'Total upload size exceeds limit' }, { status: 400 });
      }

      // Create a unique filename to prevent overwriting
      const fileExtension = path.extname((file as File).name);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const fullPath = path.join(MEDICAL_DOC, uniqueFilename);

      // Save the file
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(fullPath, buffer);

      processedFiles.push({
        originalName: (file as File).name,
        savedAs: uniqueFilename,
        size: file.size,
        type: file.type
      });
    }

    // If no files passed validation
    if (processedFiles.length === 0) {
      return NextResponse.json({ error: 'No valid files uploaded' }, { status: 400 });
    }

    // Return success response with processed file info
    return NextResponse.json({
      message: 'Medical documents uploaded successfully',
      processedFiles: processedFiles.length,
      files: processedFiles,
    });
  } catch (error) {
    // Handle unexpected server errors
    console.error('Medical Upload Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}