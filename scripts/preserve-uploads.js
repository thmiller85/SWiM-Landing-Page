#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Preserve uploads directory during build/deployment
 * This script ensures uploaded images persist across deployments
 */
function preserveUploads() {
  console.log('Preserving uploads directory...');
  
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const imagesDir = path.join(uploadsDir, 'images');
  const backupDir = path.join(process.cwd(), '.uploads-backup');
  const backupImagesDir = path.join(backupDir, 'images');
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Create images backup directory if it doesn't exist
  if (!fs.existsSync(backupImagesDir)) {
    fs.mkdirSync(backupImagesDir, { recursive: true });
  }
  
  // Backup existing uploads if they exist
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir).filter(file => file !== '.gitkeep');
    
    for (const file of imageFiles) {
      const sourcePath = path.join(imagesDir, file);
      const destPath = path.join(backupImagesDir, file);
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Backed up: ${file}`);
      } catch (error) {
        console.warn(`Failed to backup ${file}:`, error.message);
      }
    }
    
    console.log(`Backed up ${imageFiles.length} image files`);
  } else {
    console.log('No uploads directory found to backup');
  }
}

function restoreUploads() {
  console.log('Restoring uploads directory...');
  
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const imagesDir = path.join(uploadsDir, 'images');
  const backupDir = path.join(process.cwd(), '.uploads-backup');
  const backupImagesDir = path.join(backupDir, 'images');
  
  // Ensure uploads directory structure exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // Create .gitkeep file
  const gitkeepPath = path.join(imagesDir, '.gitkeep');
  if (!fs.existsSync(gitkeepPath)) {
    fs.writeFileSync(gitkeepPath, '# This file ensures the uploads/images directory is tracked by git\n');
  }
  
  // Restore from backup if it exists
  if (fs.existsSync(backupImagesDir)) {
    const backupFiles = fs.readdirSync(backupImagesDir);
    
    for (const file of backupFiles) {
      const sourcePath = path.join(backupImagesDir, file);
      const destPath = path.join(imagesDir, file);
      
      // Only restore if file doesn't already exist
      if (!fs.existsSync(destPath)) {
        try {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`Restored: ${file}`);
        } catch (error) {
          console.warn(`Failed to restore ${file}:`, error.message);
        }
      }
    }
    
    console.log(`Restored ${backupFiles.length} image files`);
  } else {
    console.log('No backup found to restore');
  }
}

// Check command line argument
const command = process.argv[2];

if (command === 'backup') {
  preserveUploads();
} else if (command === 'restore') {
  restoreUploads();
} else {
  console.log('Usage: node preserve-uploads.js [backup|restore]');
  process.exit(1);
}