#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Complete deployment build script
 * Ensures blog pages are generated and deployed correctly
 */
async function buildForDeployment() {
  console.log('🚀 Starting deployment build...');
  
  try {
    // Step 1: Build the Vite frontend
    console.log('📦 Building frontend...');
    execSync('vite build', { stdio: 'inherit' });
    
    // Step 2: Run prerender which now includes sitemap generation
    console.log('📝 Running prerender (includes sitemap generation)...');
    try {
      execSync('tsx scripts/prerender.ts', { stdio: 'inherit' });
    } catch (error) {
      console.warn('⚠️ Prerender step failed, continuing deployment...');
      console.warn('The site will work as a Single Page Application');
    }
    
    // Step 3: Verify blog pages exist
    const blogDir = path.join(process.cwd(), 'client/dist/blog');
    if (fs.existsSync(blogDir)) {
      const files = fs.readdirSync(blogDir, { recursive: true });
      console.log(`✅ Generated ${files.length} blog files`);
    } else {
      console.warn('⚠️ No blog directory found');
    }
    
    // Step 4: Copy any additional assets
    const sitemapSource = path.join(process.cwd(), 'dist/public/sitemap.xml');
    const sitemapDest = path.join(process.cwd(), 'client/dist/sitemap.xml');
    
    if (fs.existsSync(sitemapSource)) {
      fs.copyFileSync(sitemapSource, sitemapDest);
      console.log('✅ Copied sitemap.xml to deployment directory');
    }
    
    console.log('🎉 Deployment build complete!');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForDeployment();