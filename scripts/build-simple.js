import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting simple build process...');

try {
  // 1. Build React frontend only
  console.log('📦 Building React frontend...');
  execSync('vite build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  // 2. Build server for production
  console.log('⚙️ Building server...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Frontend built to: client/dist');
  console.log('📁 Server built to: dist');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}