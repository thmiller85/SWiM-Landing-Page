import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// API endpoint for basic functionality
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Catch all handler: send back React's index.html file for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const port = parseInt(process.env.PORT || '5000');
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

export default app;