#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build with blog generation...');

try {
  // Build the frontend
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });
  
  // Generate blog pages
  console.log('📝 Generating blog pages...');
  execSync('node -r esbuild-register scripts/generate-sitemap.ts', { stdio: 'inherit' });
  
  // Verify blog pages exist
  const blogDir = path.join(process.cwd(), 'client/dist/blog');
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir, { recursive: true });
    console.log(`✅ Generated ${files.length} blog files`);
  }
  
  console.log('🎉 Build complete!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}