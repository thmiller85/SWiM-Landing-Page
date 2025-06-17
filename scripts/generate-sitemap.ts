#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { storage } from '../server/storage.js';

const siteUrl = 'https://swimsolutions.ai';

// Static routes from the application
const staticRoutes = [
  '/',
  '/team',
  '/team/ross-stockdale',
  '/team/tom-miller', 
  '/team/steve-wurster',
  '/services/ai-powered-marketing',
  '/services/workflow-automation',
  '/services/b2b-saas-development',
  '/services/data-intelligence',
  '/services/ai-strategy-consulting',
  '/services/ai-security-ethics'
];

async function generateSitemap() {
  console.log('🗺️ Generating sitemap...');
  
  try {
    // Get all published blog posts from the database
    const blogPosts = await storage.getPublishedPosts();
    const blogRoutes = blogPosts.map(post => `/blog/${post.slug}`);
    
    // Combine static and dynamic routes
    const allRoutes = [...staticRoutes, ...blogRoutes];
    
    // Generate XML sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : route.startsWith('/blog/') ? '0.8' : '0.9'}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Ensure the dist/public directory exists
    const distDir = path.resolve('dist/public');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Write sitemap to dist/public
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);
    
    console.log(`✅ Sitemap generated with ${allRoutes.length} URLs`);
    console.log(`📍 Location: ${sitemapPath}`);
    console.log(`📄 Static pages: ${staticRoutes.length}`);
    console.log(`📝 Blog posts: ${blogRoutes.length}`);
    
  } catch (error) {
    console.error('❌ Sitemap generation failed:', error);
    
    // Generate basic sitemap with static routes only if database fails
    console.log('🔄 Falling back to static-only sitemap...');
    
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.9'}</priority>
  </url>`).join('\n')}
</urlset>`;

    const distDir = path.resolve('dist/public');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    const sitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, fallbackSitemap);
    
    console.log(`✅ Fallback sitemap generated with ${staticRoutes.length} static URLs`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap().catch(console.error);
}

export { generateSitemap };