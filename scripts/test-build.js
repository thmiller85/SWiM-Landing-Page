#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🧪 Testing static build components...');

try {
  // Test 1: Export content
  console.log('1. Testing content export...');
  execSync('tsx scripts/export-content.ts', { stdio: 'inherit' });
  
  // Test 2: Check exported files
  const dataDir = path.join(__dirname, '../client/public/data');
  const postsFile = path.join(dataDir, 'posts.json');
  
  if (fs.existsSync(postsFile)) {
    const posts = JSON.parse(fs.readFileSync(postsFile, 'utf8'));
    console.log(`✅ Found ${posts.length} exported posts`);
    
    if (posts.length > 0) {
      console.log(`📝 First post: "${posts[0].title}"`);
      console.log(`🖼️ Featured image: ${posts[0].featuredImage}`);
    }
  }
  
  // Test 3: Check image exists
  const imagePath = path.join(__dirname, '../public/images/blog/image-1750178585894-438339842.png');
  if (fs.existsSync(imagePath)) {
    console.log('✅ Blog image exists in source directory');
  } else {
    console.log('❌ Blog image missing from source directory');
  }
  
  // Test 4: Create minimal build structure
  const buildDir = path.join(__dirname, '../client/dist');
  const buildImagesDir = path.join(buildDir, 'images/blog');
  
  if (!fs.existsSync(buildImagesDir)) {
    fs.mkdirSync(buildImagesDir, { recursive: true });
  }
  
  // Copy the image
  const sourceImage = imagePath;
  const destImage = path.join(buildImagesDir, 'image-1750178585894-438339842.png');
  
  if (fs.existsSync(sourceImage)) {
    fs.copyFileSync(sourceImage, destImage);
    console.log('✅ Image copied to build directory');
  }
  
  console.log('🎉 Build test completed successfully!');
  
} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}