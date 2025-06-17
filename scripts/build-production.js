#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building production application...');

// Build frontend
console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Copy frontend files to correct location for server
console.log('Copying frontend files to server directory...');
if (fs.existsSync('dist/public')) {
  // Copy all files from dist/public to dist (where server expects them)
  const publicFiles = fs.readdirSync('dist/public');
  for (const file of publicFiles) {
    const sourcePath = path.join('dist/public', file);
    const destPath = path.join('dist', file);
    if (fs.statSync(sourcePath).isDirectory()) {
      fs.cpSync(sourcePath, destPath, { recursive: true });
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
  console.log('Frontend files copied successfully');
}

// Build backend
console.log('Building backend...');
execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

// Create production package.json
const prodPackageJson = {
  "name": "swim-ai-production",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "drizzle-orm": "^0.36.4",
    "express": "^4.21.2"
  }
};

fs.writeFileSync('dist/package.json', JSON.stringify(prodPackageJson, null, 2));

// Create Dockerfile for production
const dockerfile = `FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]`;

fs.writeFileSync('dist/Dockerfile', dockerfile);

// Run prerender (now includes sitemap generation)
console.log('Running prerender with sitemap generation...');
execSync('tsx scripts/prerender.ts', { stdio: 'inherit' });

console.log('Production build complete!');