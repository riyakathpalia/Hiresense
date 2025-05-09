// app/api/workspace/route.ts

import { existsSync } from 'fs';
import { mkdir, readdir } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

// Where to store uploaded files
const BASE_DIR = process.env.BASE_DIR || 'uploads'; // Default to 'uploads' if BASE_DIR is undefined
const UPLOAD_DIR = path.join(process.cwd(), BASE_DIR);

export async function GET(req: NextRequest) {
    try {
        // Get cookies from the request
        const cookies = req.headers.get('cookie') || '';
        const guestId = cookies
            .split('; ')
            .find((cookie) => cookie.startsWith('guestId='))
            ?.split('=')[1];

        if (!guestId) {
            return NextResponse.json({ error: 'Guest ID is required in cookies' }, { status: 400 });
        }

        // Ensure upload directory exists
        if (!existsSync(UPLOAD_DIR)) {
            await mkdir(UPLOAD_DIR, { recursive: true });
        }

        // Create a directory for the guestId
        const GUEST_DIR = path.join(UPLOAD_DIR, guestId);
        if (!existsSync(GUEST_DIR)) {
            await mkdir(GUEST_DIR, { recursive: true });
        }

        // Read all subfolders (workspaces) inside the guestId folder
        const workspaceFolders = await readdir(GUEST_DIR, { withFileTypes: true });

        // Traverse each workspace folder
        const workspaces = await Promise.all(
            workspaceFolders
                .filter((entry) => entry.isDirectory()) // Only process directories
                .map(async (folder, index) => {
                    const workspacePath = path.join(GUEST_DIR, folder.name);

                    // Initialize arrays for resume and jd files
                    const patientFiles: string[] = [];
                    const medicalFiles: string[] = [];

                    // Check for 'resume' folder and collect file names
                    const medicalPath = path.join(workspacePath, 'medical_documents');
                    if (existsSync(medicalPath)) {
                        const files = await readdir(medicalPath);
                        medicalFiles.push(...files);
                    }

                    // Check for 'jd' folder and collect file names
                    const patientPath = path.join(workspacePath, 'patient_documents');
                    if (existsSync(patientPath)) {
                        const files = await readdir(patientPath);
                        patientFiles.push(...files);
                    }

                    // Build the folders array dynamically
                    const folders = [];
                    if (patientFiles.length > 0) {
                        folders.push({ type: 'patient_documents', files: patientFiles });
                    }
                    if (medicalFiles.length > 0) {
                        folders.push({ type: 'medical_documents', files: medicalFiles });
                    }

                    // Return the workspace object
                    return {
                        id: `${index + 1}`,
                        name: folder.name,
                        folders,
                    };
                })
        );

        // Wrap the workspaces array in a "workspace" keyword
        return NextResponse.json({ workspace: workspaces });
    } catch (error) {
        console.error('Error in GET:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}