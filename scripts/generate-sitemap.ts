
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://your-domain.com'; // Replace with your actual domain
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

generateSitemap();
