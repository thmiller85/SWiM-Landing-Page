#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Backup and restore uploads to a location that persists across deployments
 * This creates a deployment-safe backup system
 */

const UPLOADS_DIR = path.join(process.cwd(), 'uploads/images');
const BACKUP_DIR = path.join(process.cwd(), 'persistent-uploads');
const METADATA_FILE = path.join(BACKUP_DIR, 'upload-metadata.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return Buffer.from(content).toString('base64').slice(0, 32);
}

function backupUploads() {
  console.log('Backing up uploads for deployment persistence...');
  
  ensureDir(BACKUP_DIR);
  ensureDir(UPLOADS_DIR);
  
  const metadata = {
    lastBackup: new Date().toISOString(),
    files: []
  };
  
  // Read existing uploads
  const uploadFiles = fs.readdirSync(UPLOADS_DIR).filter(file => file !== '.gitkeep');
  
  for (const file of uploadFiles) {
    const sourcePath = path.join(UPLOADS_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    const stats = fs.statSync(sourcePath);
    
    try {
      // Copy file to backup location
      fs.copyFileSync(sourcePath, backupPath);
      
      metadata.files.push({
        filename: file,
        size: stats.size,
        modified: stats.mtime.toISOString(),
        hash: getFileHash(sourcePath)
      });
      
      console.log(`✓ Backed up: ${file} (${stats.size} bytes)`);
    } catch (error) {
      console.warn(`Failed to backup ${file}:`, error.message);
    }
  }
  
  // Save metadata
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
  console.log(`Backup completed: ${uploadFiles.length} files backed up`);
  
  return metadata;
}

function restoreUploads() {
  console.log('Restoring uploads from backup...');
  
  ensureDir(UPLOADS_DIR);
  
  if (!fs.existsSync(METADATA_FILE)) {
    console.log('No backup metadata found');
    return { restored: 0, errors: [] };
  }
  
  const metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
  let restored = 0;
  const errors = [];
  
  for (const fileInfo of metadata.files) {
    const backupPath = path.join(BACKUP_DIR, fileInfo.filename);
    const restorePath = path.join(UPLOADS_DIR, fileInfo.filename);
    
    // Only restore if file doesn't exist or is different
    if (fs.existsSync(restorePath)) {
      try {
        const currentHash = getFileHash(restorePath);
        if (currentHash === fileInfo.hash) {
          console.log(`✓ File up to date: ${fileInfo.filename}`);
          continue;
        }
      } catch (error) {
        // File is corrupted, restore it
      }
    }
    
    try {
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, restorePath);
        restored++;
        console.log(`✓ Restored: ${fileInfo.filename}`);
      } else {
        errors.push(`Backup file missing: ${fileInfo.filename}`);
      }
    } catch (error) {
      errors.push(`Failed to restore ${fileInfo.filename}: ${error.message}`);
    }
  }
  
  console.log(`Restore completed: ${restored} files restored, ${errors.length} errors`);
  return { restored, errors };
}

function syncUploads() {
  console.log('Syncing uploads bidirectionally...');
  
  // Backup current uploads
  const backupResult = backupUploads();
  
  // Then restore any missing files from backup
  const restoreResult = restoreUploads();
  
  return {
    backup: backupResult,
    restore: restoreResult
  };
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'backup':
    backupUploads();
    break;
  case 'restore':
    restoreUploads();
    break;
  case 'sync':
    syncUploads();
    break;
  default:
    console.log('Usage: node backup-uploads.js [backup|restore|sync]');
    console.log('  backup  - Backup current uploads');
    console.log('  restore - Restore uploads from backup');
    console.log('  sync    - Bidirectional sync (backup then restore)');
}