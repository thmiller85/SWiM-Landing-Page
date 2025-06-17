#!/usr/bin/env node

/**
 * Safe build script that ensures deployment continues even if prerender fails
 * This script handles all the build steps with proper error handling
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function safeBuild() {
  console.log('🚀 Starting safe build process...');
  
  try {
    // Step 1: Build Vite frontend
    console.log('📦 Building frontend with Vite...');
    execSync('vite build', { stdio: 'inherit' });
    console.log('✅ Vite build completed');
    
    // Step 2: Build server
    console.log('🏗️ Building server...');
    execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
    console.log('✅ Server build completed');
    
    // Step 3: Attempt prerender (non-blocking)
    console.log('📝 Attempting prerender...');
    try {
      execSync('tsx scripts/prerender.ts', { stdio: 'inherit' });
      console.log('✅ Prerender completed successfully');
    } catch (prerenderError) {
      console.warn('⚠️ Prerender failed, but continuing deployment...');
      console.warn('The site will work as a Single Page Application');
      console.log('Prerender error details:', prerenderError.message);
    }
    
    // Step 4: Attempt sitemap generation (non-blocking)
    console.log('🗺️ Attempting sitemap generation...');
    try {
      execSync('tsx scripts/generate-sitemap.ts', { stdio: 'inherit' });
      console.log('✅ Sitemap generated successfully');
    } catch (sitemapError) {
      console.warn('⚠️ Sitemap generation failed, but continuing deployment...');
      console.log('Sitemap error details:', sitemapError.message);
    }
    
    // Step 5: Verify build outputs
    console.log('🔍 Verifying build outputs...');
    
    const distPublic = path.resolve('dist/public');
    const distServer = path.resolve('dist/index.js');
    
    if (fs.existsSync(distPublic) && fs.existsSync(path.join(distPublic, 'index.html'))) {
      console.log('✅ Frontend build verified');
    } else {
      console.warn('⚠️ Frontend build verification failed');
    }
    
    if (fs.existsSync(distServer)) {
      console.log('✅ Server build verified');
    } else {
      console.warn('⚠️ Server build verification failed');
    }
    
    console.log('🎉 Safe build process completed!');
    console.log('💡 Even if some steps failed, the core application should be ready for deployment');
    
  } catch (error) {
    console.error('❌ Critical build error:', error.message);
    process.exit(1);
  }
}

safeBuild();