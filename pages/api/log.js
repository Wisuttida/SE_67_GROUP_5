import fs from 'fs';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'logs', 'app.log'); // Ensure the 'logs' directory exists

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { message } = req.body;
        const logMessage = `${new Date().toISOString()} - ${message}\n`;

        fs.appendFile(logFilePath, logMessage, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write log' });
            }
            res.status(200).json({ success: 'Log saved' });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}