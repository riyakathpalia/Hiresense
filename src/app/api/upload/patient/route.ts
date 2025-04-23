// app/api/upload/patient/route.ts
import { Blob } from 'buffer';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Disable body parsing for multipart file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Where to store uploaded files
const BASE_DIR = process.env.BASE_DIR || 'uploads'; // Default to 'uploads' if BASE_DIR is undefined
const UPLOAD_DIR = path.join(process.cwd(), BASE_DIR);

// Allowed file types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

// Max individual file size (5MB) and total upload size (100MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 100 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // Ensure upload base directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Check if request content is multipart form data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await req.formData();

    // Extract workspace name
    // const workspaceName = formData.get('workspaceName') as string;
    // if (!workspaceName) {
    //   return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
    // }

    // Create directory: /uploads/<workspaceName>/patient
    const PATIENT_DOC = path.join(UPLOAD_DIR, 'patient_documents');
    console.log('Workspace directory:', PATIENT_DOC);
    if (!existsSync(PATIENT_DOC)) {
      await mkdir(PATIENT_DOC, { recursive: true });
    }

    // Get all uploaded files
    const files = formData.getAll('file');
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    let totalSize = 0;
    const processedFiles = [];

    // Process each file
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
      const fullPath = path.join(PATIENT_DOC, uniqueFilename);

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

    if (processedFiles.length === 0) {
      return NextResponse.json({ error: 'No valid files uploaded' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Patient documents uploaded successfully',
      processedFiles: processedFiles.length,
      files: processedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
