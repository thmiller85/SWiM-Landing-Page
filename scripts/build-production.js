#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building production application...');

// Build frontend
console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

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

// Run prerender and sitemap
console.log('Running prerender...');
execSync('tsx scripts/prerender.ts', { stdio: 'inherit' });

console.log('Generating sitemap...');
execSync('tsx scripts/generate-sitemap.ts', { stdio: 'inherit' });

console.log('Production build complete!');