import { execSync } from 'child_process';

console.log('Building for deployment...');

// Build the frontend
execSync('vite build', { stdio: 'inherit' });

// Generate blog pages - simplified approach
execSync('tsx scripts/generate-sitemap.ts', { stdio: 'inherit' });

console.log('Build complete!');