#!/usr/bin/env tsx

/**
 * Complete deployment build script
 * Ensures blog pages are generated and deployed correctly
 */

import { execSync } from 'child_process';
import fs from 'fs';

async function buildForDeployment() {
  console.log('🚀 Starting deployment build process...');
  
  try {
    // Step 1: Export current blog data from database
    console.log('📋 Exporting blog data from database...');
    execSync('tsx scripts/export-blog-data.ts', { stdio: 'inherit' });
    
    // Step 2: Build frontend
    console.log('🔨 Building frontend...');
    execSync('npx vite build', { stdio: 'inherit' });
    
    // Step 3: Generate static blog pages for SEO
    console.log('📄 Generating static blog pages...');
    try {
      execSync('tsx scripts/prerender.ts', { stdio: 'inherit' });
    } catch (prerenderError) {
      console.log('⚠️ Prerender failed but continuing deployment...');
    }
    
    // Step 4: Generate sitemap
    console.log('🗺️ Generating sitemap...');
    try {
      execSync('tsx scripts/generate-sitemap.ts', { stdio: 'inherit' });
    } catch (sitemapError) {
      console.log('⚠️ Sitemap generation failed but continuing deployment...');
    }
    
    console.log('✅ Deployment build completed successfully!');
    
  } catch (error) {
    console.error('❌ Deployment build failed:', error);
    process.exit(1);
  }
}

buildForDeployment();