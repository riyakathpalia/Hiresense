// src/app/api/delete/medical_documents/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';

export async function DELETE(req: NextRequest) {
  //const url = new URL(req.url);
  //const filename = url.searchParams.get('filename'); 
  // Extract the workspace name from the route parameters
  const encodedFilename  = req.nextUrl.pathname.split('/').pop();
  const filename = encodedFilename ? decodeURIComponent(encodedFilename) : null;
  console.log("filename : ", filename);
  
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  const BASE_DIR = process.env.BASE_DIR || 'uploads';
  const filePath = path.join(process.cwd(), BASE_DIR, 'medical_documents', decodeURIComponent(filename));

  try {
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    await unlink(filePath);

    return NextResponse.json({
      message: 'Medical document deleted successfully',
      filename,
    });
  } catch (error) {
    console.error('Delete medical document error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
