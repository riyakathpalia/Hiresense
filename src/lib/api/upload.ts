import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};

// interface AxiosError {
//   response: {
//     data: {
//       error: string;
//     };
//   };
// }

export const uploadFilesViaSSH = async (
  files: File[] // Removed unused callback
) => {
  const formData = new FormData();

  // If you want to allow multiple file uploads:
  for (let i = 0; i < files.length; i++) {
    formData.append('file', files[i]); // API expects `file` field
  }

  try {
    const res = await axios.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    enqueueSnackbar(res.data.message || 'Files uploaded successfully!', {
      variant: 'success',
    });
  } catch (err: unknown) {
    // Type the error as AxiosError to access its properties safely
    if (axios.isAxiosError(err)) {
      enqueueSnackbar(err?.response?.data?.error || 'Upload failed', {
        variant: 'error',
      });
    } else {
      console.error(err);
      enqueueSnackbar('Unexpected error occurred', {
        variant: 'error',
      });
    }
  }
};
