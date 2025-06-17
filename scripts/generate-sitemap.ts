
import fs from 'fs';
import path from 'path';
import { generateBlogPages } from './generate-blog-pages';

const baseUrl = 'https://swimsolutions.ai';
const routes = [
  '/',
  '/team',
  '/team/ross-stockdale',
  '/team/tom-miller', 
  '/team/steve-wurster',
  '/team/david-stockdale',
  '/services/ai-powered-marketing',
  '/services/workflow-automation',
  '/services/b2b-saas-development',
  '/services/data-intelligence',
  '/services/ai-strategy-consulting',
  '/services/ai-security-ethics'
];

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  const distPath = path.resolve('dist/public');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }
  
  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap);
  console.log('✓ Generated sitemap.xml');
}

async function main() {
  console.log('🚀 Generating sitemap and blog pages...');
  
  try {
    // Generate static blog pages first
    console.log('📝 Generating static blog pages...');
    await generateBlogPages();
    
    // Then generate sitemap
    console.log('🗺️ Generating sitemap...');
    generateSitemap();
    
    console.log('✅ All generation complete!');
  } catch (error) {
    console.error('❌ Error during generation:', error);
    process.exit(1);
  }
}

main();
