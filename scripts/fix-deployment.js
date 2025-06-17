#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Fix deployment by ensuring frontend files are correctly built and copied
 */
async function fixDeployment() {
  console.log('🔧 Fixing deployment configuration...');
  
  // Step 1: Clean previous build
  console.log('Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  // Step 2: Build frontend with correct output
  console.log('Building frontend...');
  execSync('vite build', { stdio: 'inherit' });
  
  // Step 3: Build backend
  console.log('Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  // Step 4: Move frontend files from dist/public to dist
  console.log('Moving frontend files to correct location...');
  const publicDir = 'dist/public';
  
  if (fs.existsSync(publicDir)) {
    const items = fs.readdirSync(publicDir);
    
    for (const item of items) {
      const sourcePath = path.join(publicDir, item);
      const destPath = path.join('dist', item);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        // Copy directory
        fs.cpSync(sourcePath, destPath, { recursive: true });
      } else {
        // Copy file
        fs.copyFileSync(sourcePath, destPath);
      }
      console.log(`Moved: ${item}`);
    }
    
    // Remove the now-empty public directory
    fs.rmSync(publicDir, { recursive: true, force: true });
    console.log('Cleaned up public directory');
  }
  
  // Step 5: Verify critical files exist
  const criticalFiles = ['index.html', 'index.js'];
  let missingFiles = [];
  
  for (const file of criticalFiles) {
    const filePath = path.join('dist', file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  }
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing critical files:', missingFiles);
    throw new Error('Build incomplete - missing files');
  }
  
  // Step 6: Check and fix index.html script references
  const indexPath = path.join('dist', 'index.html');
  let indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  // Fix common script reference issues
  if (indexContent.includes('src="/main.js"') && !fs.existsSync('dist/main.js')) {
    if (fs.existsSync('dist/index.js')) {
      indexContent = indexContent.replace('src="/main.js"', 'src="/index.js"');
      fs.writeFileSync(indexPath, indexContent);
      console.log('Fixed script reference in index.html');
    }
  }
  
  console.log('✅ Deployment fix complete!');
  console.log('📁 Files in dist:');
  const distFiles = fs.readdirSync('dist');
  distFiles.forEach(file => console.log(`  - ${file}`));
}

fixDeployment().catch(console.error);