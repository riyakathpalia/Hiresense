```
import { NextRequest, NextResponse } from 'next/server';
import Client from 'ssh2-sftp-client';
import * as fs from 'fs';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

export async function POST(req: NextRequest) {
  const sftp = new Client();
  const uploadedPaths: string[] = [];
  const remoteDir = '/home/ubuntu/akash/hiresense_data/resume/';

  try {
    // Parse the incoming form data using the updated formidable API
    //const form = formidable({ multiples: true }); // Enable multiple file uploads
    // const { files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
    //   form.parse(req as unknown as import('http').IncomingMessage, (err, fields, files) => {
    //     if (err) reject(err);
    //     resolve({ fields, files });
    //   });
    // });

    //const [_, files] = await form.parse(req as unknown as import('http').IncomingMessage);
    
    // Convert NextRequest body to a buffer (formidable needs raw data)
    const bytes = await req.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Initialize formidable
    const form = formidable({
      multiples: true, // Enable multiple file uploads
      keepExtensions: true, // Preserve file extensions
    });

    // Parse the buffer manually since NextRequest isn't a Node.js stream
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req as unknown as import('http').IncomingMessage, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    if (!files || !files.file) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const fileArray = Array.isArray(files.file) ? files.file : [files.file];

    // Connect to SFTP server
    await sftp.connect({
      host: process.env.SFTP_HOST || '3.111.149.53',
      port: parseInt(process.env.SFTP_PORT || '22'),
      username: process.env.SFTP_USERNAME || 'ubuntu',
      privateKey: process.env.SFTP_PRIVATE_KEY || fs.readFileSync('ai-copilot-key 1.pem'),
    });

    // Upload each file
    for (const file of fileArray) {
      const localPath = file.filepath; // Path to the uploaded file
      const remotePath = `${remoteDir}${file.originalFilename}`;
      await sftp.put(localPath, remotePath);
      uploadedPaths.push(remotePath);
      console.log(`Uploaded: ${file.originalFilename}`);
    }

    return NextResponse.json({ message: 'Files uploaded successfully', paths: uploadedPaths });
  } catch (err) {
    console.error('Error:', err);
    return NextResponse.json({ error: 'Failed to upload files', details: (err as Error).message }, { status: 500 });
  } finally {
    await sftp.end();
  }
}
```

## HandleDrop
```javascript

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  
```

## TraverseFileTree
```javascript
const traverseFileTree = (item: any, fileList: File[]) => {
    if (item.isFile) {
      item.file((file: File) => {
        fileList.push(file);
      });
    } else if (item.isDirectory) {
      const reader = item.createReader();
      reader.readEntries((entries: any[]) => {
        entries.forEach((entry) => traverseFileTree(entry, fileList));
      });
    }
  };
  
```