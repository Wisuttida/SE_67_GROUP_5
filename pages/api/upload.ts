// import type { NextApiRequest, NextApiResponse } from 'next';
// import * as formidable from 'formidable';
// import fs from 'fs';
// import path from 'path';

// // Disable Next.js's default body parsing
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//     const form = new formidable.IncomingForm();

//     // Set the upload directory
//     const uploadDir = path.join(process.cwd(), 'public', 'uploads');

//     // Ensure the upload directory exists
//     fs.mkdirSync(uploadDir, { recursive: true });

//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error parsing the files' });
//         }

//         const uploadedFile = files.file; // Assuming the input name is 'file'
//         console.log(files)
//         if (!uploadedFile || !Array.isArray(uploadedFile) || uploadedFile.length === 0) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }
//         const file = uploadedFile[0]; // Assuming the input name is 'file'
//         const data = fs.readFileSync(file.filepath); // Read the file into a buffer

//         const originalName = file.originalFilename as string;
//         const ext = path.extname(originalName);
//         const baseName = path.basename(originalName, ext);
//         let uniqueName = originalName;
//         let counter = 1;

//         // Check if the file already exists and generate a new name if necessary
//         while (fs.existsSync(path.join(uploadDir, uniqueName))) {
//             uniqueName = `${baseName}${counter}${ext}`;
//             counter++;
//         }
//         const uploadPath = path.join(uploadDir, uniqueName);

//         fs.writeFileSync(uploadPath, data);

//         return res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${uniqueName}` });
//     });
// };

// export default uploadHandler;

import axios from 'axios';

export async function uploadImage(imageFile: File) {
    const formData = new FormData();
    formData.append('file', imageFile);
    // formData.append('key', '6d207e02198a847aa98d0a2a901485a5');

    try {
        const response = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization' : 'Basic private_EvBCYds04c2JLZmKTPOEWFNq3ME=',
                'X-Requested-With': 'XMLHttpRequest',
                'Access-Control-Allow-Origin': '*',
            },
        });

        if (response.data.success) {
            return response.data.data.url; // URL of the uploaded image
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

// import type { NextApiRequest, NextApiResponse } from 'next';
// import axios from 'axios';
// import formidable from 'formidable';

// // Disable Next.js's default body parsing
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

// const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//     // Set CORS headers
//     res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (or specify your frontend URL)
//     res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//     if (req.method === 'OPTIONS') {
//         // Handle preflight request
//         return res.status(200).end();
//     }

//     const form = new formidable.IncomingForm();

//     form.parse(req, async (err, fields, files) => {
//         if (err) {
//             return res.status(500).json({ error: 'Error parsing the files' });
//         }

//         const uploadedFile = files.file; // Assuming the input name is 'file'
//         if (!uploadedFile || !Array.isArray(uploadedFile) || uploadedFile.length === 0) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }

//         const file = uploadedFile[0];
//         const formData = new FormData();
//         formData.append('file', file.filepath);
//         formData.append('key', '6d207e02198a847aa98d0a2a901485a5'); // Replace with your actual API key

//         try {
//             const response = await axios.post('https://freeimage.host/api/1/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             if (response.data.success) {
//                 return res.status(200).json({ message: 'File uploaded successfully', filePath: response.data.data.url });
//             } else {
//                 return res.status(500).json({ error: 'Upload failed' });
//             }
//         } catch (error) {
//             return res.status(500).json({ error: 'Error uploading image' });
//         }
//     });
// };

// export default uploadHandler;