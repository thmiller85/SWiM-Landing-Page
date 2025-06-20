#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Commit uploaded images to version control to ensure persistence across deployments
 */
function commitUploads() {
  console.log('Checking for new uploaded images to commit...');
  
  const uploadsDir = path.join(process.cwd(), 'uploads/images');
  
  try {
    // Check if uploads directory exists and has files
    if (!fs.existsSync(uploadsDir)) {
      console.log('No uploads directory found');
      return;
    }
    
    const files = fs.readdirSync(uploadsDir).filter(file => file !== '.gitkeep');
    
    if (files.length === 0) {
      console.log('No uploaded files to commit');
      return;
    }
    
    // Check git status for uploads directory
    try {
      const gitStatus = execSync('git status --porcelain uploads/images/', { encoding: 'utf8' });
      
      if (gitStatus.trim().length === 0) {
        console.log('No changes in uploads directory');
        return;
      }
      
      // Add uploads directory to git
      execSync('git add uploads/images/');
      console.log(`✓ Added ${files.length} upload files to git`);
      
      // Check if there are staged changes
      const stagedChanges = execSync('git diff --cached --name-only uploads/images/', { encoding: 'utf8' });
      
      if (stagedChanges.trim().length > 0) {
        // Commit the changes
        const timestamp = new Date().toISOString().split('T')[0];
        execSync(`git commit -m "chore: update uploaded images - ${timestamp}"`);
        console.log('✓ Committed uploaded images to version control');
        
        // If this is a deployment environment, push changes
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.REPLIT_DEPLOYMENT) {
          try {
            execSync('git push origin main', { stdio: 'inherit' });
            console.log('✓ Pushed changes to remote repository');
          } catch (pushError) {
            console.warn('Could not push to remote (this is normal in some deployment environments)');
          }
        }
      }
      
    } catch (gitError) {
      console.warn('Git operations failed (this is normal if not in a git repository)');
    }
    
  } catch (error) {
    console.error('Error committing uploads:', error.message);
  }
}

// Auto-commit uploads on startup in production
if (process.env.NODE_ENV === 'production') {
  commitUploads();
} else if (process.argv[2] === 'commit') {
  commitUploads();
} else {
  console.log('Use: node commit-uploads.js commit (or runs automatically in production)');
}