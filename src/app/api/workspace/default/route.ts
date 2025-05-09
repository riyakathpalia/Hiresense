// app/api/workspace/default/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

// Base directory where guest folders are stored
const BASE_DIR = process.env.BASE_DIR || 'uploads';
const UPLOAD_DIR = path.join(process.cwd(), BASE_DIR);

export async function POST(req: NextRequest) {
    try {

        // Get cookies from the request
        const cookies = req.headers.get('cookie') || '';
        const guestId = cookies.split('; ')
            .find((cookie) => cookie.startsWith('guestId='))
            ?.split('=')[1];

        if (!guestId) {
            return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
        }

        // Path to the guestId folder
        const guestDir = path.join(UPLOAD_DIR, guestId);

        // Ensure the guestId folder exists
        if (!existsSync(guestDir)) {
            await mkdir(guestDir, { recursive: true });
        }

        // Path to the default workspace folder
        const defaultWorkspaceDir = path.join(guestDir, 'Default');

        // Check if the default workspace folder exists
        if (!existsSync(defaultWorkspaceDir)) {
            // Create the default workspace folder
            await mkdir(defaultWorkspaceDir, { recursive: true });
            return NextResponse.json({
                message: 'Default workspace created successfully',
                workspace: 'DefaultWorkspace',
            });
        }

        // If the default workspace already exists
        return NextResponse.json({
            message: 'Default workspace already exists',
            workspace: 'DefaultWorkspace',
        });
    } catch (error) {
        console.error('Error creating default workspace:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
