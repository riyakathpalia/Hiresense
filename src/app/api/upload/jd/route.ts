// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Where to store uploaded files
const UPLOAD_DIR = path.join(process.cwd(), '../uploads');

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  try {
    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const contentType = req.headers.get('content-type') || '';

    // Check if it's multipart form data
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content type must be multipart/form-data' }, { status: 400 });
    }
    const formData = await req.formData();
  
    // Extract the workspace name from the form data
    const workspaceName = formData.get('workspaceName') as string;
    if (!workspaceName) {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
    }

    // Create a directory for the workspace inside the jd folder
    const WORKSPACE_DIR = path.join(UPLOAD_DIR, workspaceName, 'jd',);
    console.log("Workspace directory:", WORKSPACE_DIR);
    if (!existsSync(WORKSPACE_DIR)) {
      await mkdir(WORKSPACE_DIR, { recursive: true });
    }

    const files = formData.getAll('file');
    console.log('Form data:', formData);
    console.log('Content type:', contentType);

    console.log('Files received:', files);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    let totalSize = 0;
    const processedFiles = [];

    for (const file of files) {
      if (!(file instanceof File)) {
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
      const fileExtension = path.extname(file.name);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const WORKSPACE_DIR_PATH = path.join(WORKSPACE_DIR, uniqueFilename);

      // Save the file
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(WORKSPACE_DIR_PATH, buffer);

      processedFiles.push({
        originalName: file.name,
        savedAs: uniqueFilename,
        size: file.size,
        type: file.type
      });
    }


    if (processedFiles.length === 0) {
      return NextResponse.json({ error: 'No valid files uploaded' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Files uploaded successfully',
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