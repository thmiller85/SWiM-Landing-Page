import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Running post-build static page generation...');

// Generate static blog pages after the main build
const generateProcess = spawn('tsx', ['scripts/generate-blog-pages.ts'], {
  cwd: join(__dirname, '..'),
  stdio: 'inherit'
});

generateProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Static blog pages generated successfully');
  } else {
    console.error('❌ Failed to generate static blog pages');
    process.exit(code);
  }
});

generateProcess.on('error', (error) => {
  console.error('❌ Error generating static blog pages:', error);
  process.exit(1);
});