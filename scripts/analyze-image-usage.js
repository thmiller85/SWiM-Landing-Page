#!/usr/bin/env node

/**
 * Image Usage Analysis Script
 * Identifies which images in /client/public are actually being used
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively get all files in a directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Get all image files in /client/public
function getPublicImages() {
  const publicDir = path.join(path.dirname(__dirname), 'client/public');
  const allFiles = getAllFiles(publicDir);
  
  return allFiles
    .filter(file => /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(file))
    .map(file => ({
      fullPath: file,
      relativePath: path.relative(publicDir, file),
      filename: path.basename(file),
      size: fs.statSync(file).size
    }));
}

// Search for image references in code
function searchImageReferences(images) {
  const rootDir = path.dirname(__dirname);
  const sourceFiles = [
    ...getAllFiles(path.join(rootDir, 'client/src')),
    ...getAllFiles(path.join(rootDir, 'server')),
    path.join(rootDir, 'client/index.html')
  ].filter(file => /\.(tsx?|jsx?|html|css|scss)$/i.test(file));

  const imageUsage = {};
  
  images.forEach(image => {
    imageUsage[image.relativePath] = {
      ...image,
      usedIn: [],
      isUsed: false
    };
  });

  sourceFiles.forEach(sourceFile => {
    try {
      const content = fs.readFileSync(sourceFile, 'utf8');
      
      images.forEach(image => {
        const patterns = [
          image.filename,
          image.relativePath,
          `/${image.relativePath}`,
          image.relativePath.replace(/\\/g, '/'),
          `/${image.relativePath.replace(/\\/g, '/')}`
        ];
        
        patterns.forEach(pattern => {
          if (content.includes(pattern)) {
            imageUsage[image.relativePath].usedIn.push({
              file: path.relative(rootDir, sourceFile),
              pattern: pattern
            });
            imageUsage[image.relativePath].isUsed = true;
          }
        });
      });
    } catch (error) {
      console.warn(`Could not read file: ${sourceFile}`);
    }
  });

  return imageUsage;
}

// Format file size
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main analysis function
function analyzeImageUsage() {
  console.log('🔍 Analyzing image usage in /client/public...\n');
  
  const publicImages = getPublicImages();
  const imageUsage = searchImageReferences(publicImages);
  
  const usedImages = Object.values(imageUsage).filter(img => img.isUsed);
  const unusedImages = Object.values(imageUsage).filter(img => !img.isUsed);
  
  console.log('📊 SUMMARY:');
  console.log(`Total images: ${publicImages.length}`);
  console.log(`Used images: ${usedImages.length}`);
  console.log(`Unused images: ${unusedImages.length}`);
  
  const totalSize = publicImages.reduce((sum, img) => sum + img.size, 0);
  const unusedSize = unusedImages.reduce((sum, img) => sum + img.size, 0);
  
  console.log(`Total size: ${formatBytes(totalSize)}`);
  console.log(`Unused size: ${formatBytes(unusedSize)}`);
  console.log(`Potential savings: ${formatBytes(unusedSize)} (${((unusedSize/totalSize)*100).toFixed(1)}%)\n`);
  
  // Used images report
  if (usedImages.length > 0) {
    console.log('✅ USED IMAGES:');
    usedImages.forEach(img => {
      console.log(`  📁 ${img.relativePath} (${formatBytes(img.size)})`);
      img.usedIn.forEach(usage => {
        console.log(`    └─ ${usage.file} (as "${usage.pattern}")`);
      });
    });
    console.log('');
  }
  
  // Unused images report
  if (unusedImages.length > 0) {
    console.log('❌ UNUSED IMAGES (candidates for deletion):');
    unusedImages.forEach(img => {
      console.log(`  🗑️  ${img.relativePath} (${formatBytes(img.size)})`);
    });
    console.log('');
  }
  
  // Special categories analysis
  console.log('📋 CATEGORY ANALYSIS:');
  
  const categories = {
    'Favicons': unusedImages.filter(img => /favicon|apple-touch-icon/i.test(img.filename)),
    'OG Images': unusedImages.filter(img => /og-image/i.test(img.filename)),
    'Logos': unusedImages.filter(img => /logo/i.test(img.filename)),
    'Blog Images': unusedImages.filter(img => img.relativePath.includes('images/blog')),
    'Other': unusedImages.filter(img => 
      !/favicon|apple-touch-icon|og-image|logo/i.test(img.filename) && 
      !img.relativePath.includes('images/blog')
    )
  };
  
  Object.entries(categories).forEach(([category, images]) => {
    if (images.length > 0) {
      const categorySize = images.reduce((sum, img) => sum + img.size, 0);
      console.log(`  ${category}: ${images.length} files (${formatBytes(categorySize)})`);
      images.forEach(img => {
        console.log(`    - ${img.filename}`);
      });
    }
  });
  
  // Generate cleanup script
  if (unusedImages.length > 0) {
    console.log('\n🧹 CLEANUP RECOMMENDATIONS:');
    console.log('Run these commands to remove unused images:');
    console.log('');
    
    unusedImages.forEach(img => {
      console.log(`rm "${img.fullPath}"`);
    });
    
    // Save cleanup script
    const cleanupScript = unusedImages.map(img => `rm "${img.fullPath}"`).join('\n');
    fs.writeFileSync('./scripts/cleanup-unused-images.sh', `#!/bin/bash\n\n# Auto-generated cleanup script\n# Remove unused images from /client/public\n\n${cleanupScript}\n\necho "Cleanup completed. Removed ${unusedImages.length} unused images."`);
    console.log('\n💾 Cleanup script saved to: ./scripts/cleanup-unused-images.sh');
    console.log('Review the script before running: chmod +x ./scripts/cleanup-unused-images.sh && ./scripts/cleanup-unused-images.sh');
  }
}

// Run the analysis
analyzeImageUsage();