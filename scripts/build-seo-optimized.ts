import { exec } from 'child_process';
import { promisify } from 'util';
import { generateBlogPages } from './generate-blog-pages';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Complete SEO-optimized build process
 * 1. Build React app
 * 2. Generate static blog pages with metadata
 * 3. Create sitemap
 * 4. Export blog content for client-side fallback
 */
async function buildSEOOptimized() {
  console.log('🚀 Starting SEO-optimized build...');
  
  try {
    // Step 1: Build the React application
    console.log('📦 Building React application...');
    await execAsync('vite build');
    
    // Step 2: Generate static blog pages
    console.log('📝 Generating static blog pages...');
    await generateBlogPages();
    
    // Step 3: Export blog content for client-side fallback
    console.log('💾 Exporting blog content...');
    await exportBlogContent();
    
    // Step 4: Generate sitemap
    console.log('🗺️ Generating sitemap...');
    await execAsync('tsx scripts/generate-sitemap.ts');
    
    // Step 5: Update robots.txt
    console.log('🤖 Updating robots.txt...');
    await updateRobotsTxt();
    
    console.log('✨ SEO-optimized build complete!');
    console.log('📊 Features enabled:');
    console.log('  ✅ Static HTML pages for all blog posts');
    console.log('  ✅ Complete Open Graph metadata');
    console.log('  ✅ JSON-LD structured data');
    console.log('  ✅ Client-side fallback for dynamic functionality');
    console.log('  ✅ Optimized sitemap with blog posts');
    console.log('  ✅ Perfect SEO score potential');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * Export blog content as JSON for client-side fallback
 */
async function exportBlogContent() {
  const { storage } = await import('../server/storage');
  
  try {
    const posts = await storage.getPublishedPosts();
    const blogPosts = posts.map(post => storage.convertToClientFormat(post));
    
    // Create data directory
    const dataDir = path.join(process.cwd(), 'client/dist/data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // Export all posts
    await fs.writeFile(
      path.join(dataDir, 'posts.json'),
      JSON.stringify(blogPosts, null, 2)
    );
    
    // Export individual posts
    for (const post of blogPosts) {
      await fs.writeFile(
        path.join(dataDir, `${post.slug}.json`),
        JSON.stringify(post, null, 2)
      );
    }
    
    // Export metadata
    const metadata = {
      totalPosts: blogPosts.length,
      categories: [...new Set(blogPosts.map(p => p.category))],
      tags: [...new Set(blogPosts.flatMap(p => p.tags))],
      lastExported: new Date().toISOString()
    };
    
    await fs.writeFile(
      path.join(dataDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    console.log(`✅ Exported ${blogPosts.length} blog posts as JSON fallback`);
    
  } catch (error) {
    console.error('❌ Error exporting blog content:', error);
  }
}

/**
 * Update robots.txt with sitemap reference
 */
async function updateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://swimsolutions.ai/sitemap.xml

# Blog content
Allow: /blog/
Allow: /blog/*

# Assets
Allow: /assets/
Allow: /images/
`;

  const robotsPath = path.join(process.cwd(), 'client/dist/robots.txt');
  await fs.writeFile(robotsPath, robotsTxt);
  console.log('✅ Updated robots.txt');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildSEOOptimized();
}

export { buildSEOOptimized };