import fs from 'fs/promises';
import syncFs from 'fs';
import path from 'path';
import { storage } from '../server/storage';

/**
 * Generate static HTML pages for all published blog posts
 * This ensures perfect SEO while maintaining static deployment
 */
async function generateBlogPages() {
  console.log('🚀 Generating static blog pages...');
  
  try {
    // Get all published posts from database
    const posts = await storage.getPublishedPosts();
    console.log(`📝 Found ${posts.length} published posts`);
    
    // Create blog directory in client/dist for deployment
    const distDir = path.join(process.cwd(), 'client/dist');
    const blogDir = path.join(distDir, 'blog');
    await fs.mkdir(blogDir, { recursive: true });
    
    // Generate HTML template function
    const generatePostHTML = (post: any, baseUrl: string = 'https://swimsolutions.ai') => {
      const blogPost = storage.convertToClientFormat(post);
      const postUrl = `${baseUrl}/blog/${blogPost.slug}`;
      
      // Escape HTML special characters
      const escapeHtml = (str: string) => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      const safeTitle = escapeHtml(blogPost.title);
      const safeDescription = escapeHtml(blogPost.metaDescription);
      const safeAuthor = escapeHtml(blogPost.author);
      const safeCategory = escapeHtml(blogPost.category);
      
      return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>${safeTitle} | SWiM AI Blog</title>
    <meta name="description" content="${safeDescription}" />
    <meta name="keywords" content="${blogPost.tags.map(escapeHtml).join(', ')}" />
    <meta name="author" content="${safeAuthor}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${blogPost.featuredImage || baseUrl + '/og-image-final.jpg'}" />
    <meta property="og:site_name" content="SWiM AI" />
    <meta property="article:published_time" content="${blogPost.publishedAt}" />
    <meta property="article:modified_time" content="${blogPost.updatedAt}" />
    <meta property="article:author" content="${safeAuthor}" />
    <meta property="article:section" content="${safeCategory}" />
    ${blogPost.tags.map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join('\n    ')}
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${postUrl}" />
    <meta property="twitter:title" content="${safeTitle}" />
    <meta property="twitter:description" content="${safeDescription}" />
    <meta property="twitter:image" content="${blogPost.featuredImage || baseUrl + '/og-image-final.jpg'}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${postUrl}" />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${safeTitle}",
      "description": "${safeDescription}",
      "image": "${blogPost.featuredImage || baseUrl + '/og-image-final.jpg'}",
      "author": {
        "@type": "Organization",
        "name": "${safeAuthor}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SWiM AI",
        "logo": {
          "@type": "ImageObject",
          "url": "${baseUrl}/favicon-512x512.png"
        }
      },
      "datePublished": "${blogPost.publishedAt}",
      "dateModified": "${blogPost.updatedAt}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${postUrl}"
      },
      "articleSection": "${safeCategory}",
      "keywords": "${blogPost.tags.map(escapeHtml).join(', ')}",
      "wordCount": ${blogPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length},
      "timeRequired": "PT${Math.ceil(blogPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)}M"
    }
    </script>
    
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f8fafc; }
      .container { max-width: 900px; margin: 0 auto; padding: 60px 20px; background: white; min-height: 100vh; }
      .header { border-bottom: 1px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 40px; }
      .title { font-size: 2.5rem; font-weight: bold; color: #1a202c; margin-bottom: 15px; line-height: 1.2; }
      .meta { color: #718096; font-size: 0.95rem; margin-bottom: 25px; display: flex; gap: 15px; flex-wrap: wrap; }
      .featured-image { width: 100%; height: 400px; object-fit: cover; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .content { font-size: 1.1rem; line-height: 1.8; color: #2d3748; }
      .content h1 { font-size: 2rem; font-weight: bold; color: #1a202c; margin: 40px 0 20px 0; }
      .content h2 { font-size: 1.75rem; font-weight: bold; color: #1a202c; margin: 35px 0 18px 0; }
      .content h3 { font-size: 1.5rem; font-weight: semibold; color: #1a202c; margin: 30px 0 15px 0; }
      .content p { margin-bottom: 20px; }
      .content strong { font-weight: 600; color: #1a202c; }
      .content em { font-style: italic; }
      .content a { color: #3182ce; text-decoration: underline; }
      .content a:hover { color: #2c5282; }
      .content ul, .content ol { margin: 20px 0; padding-left: 30px; }
      .content li { margin-bottom: 8px; }
      .content blockquote { border-left: 4px solid #3182ce; padding-left: 20px; margin: 25px 0; font-style: italic; color: #4a5568; }
      .footer { margin-top: 50px; padding-top: 30px; border-top: 1px solid #e2e8f0; text-align: center; }
      .footer a { color: #3182ce; text-decoration: none; margin: 0 15px; }
      .footer a:hover { text-decoration: underline; }
      .back-link { display: inline-block; margin-bottom: 20px; color: #3182ce; text-decoration: none; }
      .back-link:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="container">
      <a href="${baseUrl}" class="back-link">← SWiM AI</a>
      
      <div class="header">
        <h1 class="title">${safeTitle}</h1>
        <div class="meta">
          <span>By ${safeAuthor}</span>
          <span>•</span>
          <span>${new Date(blogPost.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>•</span>
          <span>${Math.ceil(blogPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)} min read</span>
        </div>
        ${blogPost.featuredImage ? `<img src="${blogPost.featuredImage}" alt="${safeTitle}" class="featured-image" />` : ''}
      </div>
      
      <div class="content">
        ${blogPost.content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
          .replace(/^### (.*$)/gm, '<h3>$1</h3>')
          .replace(/^## (.*$)/gm, '<h2>$1</h2>')
          .replace(/^# (.*$)/gm, '<h1>$1</h1>')
          .replace(/^- (.*$)/gm, '<li>$1</li>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/^(?!<[h|l|u])/gm, '<p>')
          .replace(/<p>(<[h|l|u])/g, '$1')
          .replace(/(<\/[h|l|u][^>]*>)<p>/g, '$1')
        }
      </div>
      
      <div class="footer">
        <a href="${baseUrl}">SWiM AI Home</a>
        <a href="${baseUrl}/blog">All Blog Posts</a>
        <a href="${baseUrl}/#contact">Contact Us</a>
      </div>
    </div>
    
    <!-- Progressive enhancement: Load React app for interactive features -->
    <div id="root" style="display: none;"></div>
    <script>
      window.__BLOG_POST_DATA__ = ${JSON.stringify(blogPost)};
    </script>
    <script type="module" crossorigin src="/assets/index.js"></script>
  </body>
</html>`;
    };
    
    // Generate individual HTML files for each post
    for (const post of posts) {
      const blogPost = storage.convertToClientFormat(post);
      const html = generatePostHTML(post);
      
      // Create post directory
      const postDir = path.join(blogDir, blogPost.slug);
      await fs.mkdir(postDir, { recursive: true });
      
      // Write index.html file
      const filePath = path.join(postDir, 'index.html');
      await fs.writeFile(filePath, html);
      
      console.log(`✅ Generated: /blog/${blogPost.slug}/index.html`);
    }
    
    // Generate blog index page with all posts
    const blogIndexHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>Blog | SWiM AI - AI-Powered Marketing & Business Solutions</title>
    <meta name="description" content="Expert insights on AI marketing, workflow automation, and business intelligence. Learn how to transform your B2B operations with proven strategies and case studies." />
    <meta name="keywords" content="AI marketing blog, workflow automation, B2B automation, business intelligence, SaaS development" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://swimsolutions.ai/blog" />
    <meta property="og:title" content="Blog | SWiM AI - AI-Powered Marketing & Business Solutions" />
    <meta property="og:description" content="Expert insights on AI marketing, workflow automation, and business intelligence. Learn how to transform your B2B operations with proven strategies and case studies." />
    <meta property="og:image" content="https://swimsolutions.ai/og-image-final.jpg" />
    <meta property="og:site_name" content="SWiM AI" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://swimsolutions.ai/blog" />
    <meta property="twitter:title" content="Blog | SWiM AI - AI-Powered Marketing & Business Solutions" />
    <meta property="twitter:description" content="Expert insights on AI marketing, workflow automation, and business intelligence. Learn how to transform your B2B operations with proven strategies and case studies." />
    <meta property="twitter:image" content="https://swimsolutions.ai/og-image-final.jpg" />
    
    <link rel="canonical" href="https://swimsolutions.ai/blog" />
    <link rel="stylesheet" href="/assets/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="/assets/index.js"></script>
  </body>
</html>`;
    
    await fs.writeFile(path.join(blogDir, 'index.html'), blogIndexHTML);
    console.log('✅ Generated: /blog/index.html');
    
    console.log(`🎉 Successfully generated ${posts.length + 1} static blog pages`);
    
  } catch (error) {
    console.error('❌ Error generating blog pages:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateBlogPages().then(() => {
    console.log('✨ Blog page generation complete!');
    process.exit(0);
  });
}

export { generateBlogPages };