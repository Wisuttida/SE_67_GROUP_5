import type { NextApiRequest, NextApiResponse } from 'next';
import * as formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable Next.js's default body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const form = new formidable.IncomingForm();

    // Set the upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure the upload directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error parsing the files' });
        }

        const uploadedFile = files.file; // Assuming the input name is 'file'
        console.log(files)
        if (!uploadedFile || !Array.isArray(uploadedFile) || uploadedFile.length === 0) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const file = uploadedFile[0]; // Assuming the input name is 'file'
        const data = fs.readFileSync(file.filepath); // Read the file into a buffer
        const uploadPath = path.join(uploadDir, String(file.originalFilename));

        fs.writeFileSync(uploadPath, data);

        return res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${file.originalFilename}` });
    });
};

export default uploadHandler;