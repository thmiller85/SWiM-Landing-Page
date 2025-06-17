import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create Vite server for development
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'spa',
  root: path.join(__dirname, '../client')
});

app.use(vite.ssrFixStacktrace);
app.use(vite.middlewares);

// API endpoint for basic functionality
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const port = parseInt(process.env.PORT || '5000');
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

export default app;