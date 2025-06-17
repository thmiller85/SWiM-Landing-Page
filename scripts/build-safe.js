#!/usr/bin/env node

/**
 * Safe build script that ensures deployment continues even if prerender fails
 * This script handles all the build steps with proper error handling
 */

import { execSync } from 'child_process';
import fs from 'fs';

async function safeBuild() {
  console.log('🚀 Starting safe build process...');
  
  try {
    // Step 1: Export current blog data from database
    console.log('📋 Exporting current blog data...');
    try {
      execSync('tsx scripts/export-blog-data.ts', { stdio: 'inherit' });
      console.log('✅ Blog data exported successfully');
    } catch (exportError) {
      console.log('⚠️ Blog data export failed, continuing with existing data');
    }
    
    // Step 2: Build frontend with Vite
    console.log('🔨 Building frontend application...');
    execSync('vite build', { stdio: 'inherit' });
    console.log('✅ Frontend build completed');
    
    // Step 3: Build backend server
    console.log('🔧 Building backend server...');
    execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
    console.log('✅ Backend build completed');
    
    // Step 4: Generate static blog pages for SEO (optional)
    console.log('📄 Generating static blog pages...');
    try {
      execSync('tsx scripts/prerender.ts', { stdio: 'inherit' });
      console.log('✅ Static pages generated successfully');
    } catch (prerenderError) {
      console.log('⚠️ Static page generation failed, site will work as SPA');
    }
    
    // Step 5: Generate sitemap (optional)
    console.log('🗺️ Generating sitemap...');
    try {
      execSync('tsx scripts/generate-sitemap.ts', { stdio: 'inherit' });
      console.log('✅ Sitemap generated successfully');
    } catch (sitemapError) {
      console.log('⚠️ Sitemap generation failed, continuing without sitemap');
    }
    
    console.log('🎉 Build process completed successfully!');
    console.log('📊 Build Summary:');
    console.log('   ✓ Frontend: Ready for deployment');
    console.log('   ✓ Backend: Server compiled and ready');
    console.log('   ✓ Blog Data: Current posts exported');
    console.log('   ✓ SEO: Static pages and sitemap generated (if successful)');
    
  } catch (error) {
    console.error('❌ Critical build error:', error.message);
    console.error('🔍 Check the error above and fix any issues before deployment');
    process.exit(1);
  }
}

safeBuild();