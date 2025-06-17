#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Copy frontend files from dist/public to dist
 * This ensures the server can find the static files in production
 */
function copyFrontendFiles() {
  console.log('Copying frontend files to server directory...');
  
  const sourceDir = 'dist/public';
  const destDir = 'dist';
  
  if (!fs.existsSync(sourceDir)) {
    console.warn('No frontend build found at dist/public');
    return;
  }
  
  // Get all files and directories in dist/public
  const items = fs.readdirSync(sourceDir);
  
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(destDir, item);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Copy directory recursively
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      fs.cpSync(sourcePath, destPath, { recursive: true });
      console.log(`Copied directory: ${item}`);
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied file: ${item}`);
    }
  }
  
  console.log('Frontend files copied successfully');
}

copyFrontendFiles();