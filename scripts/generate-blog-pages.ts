import fs from 'fs/promises';
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
    
    // Create blog directory in dist
    const blogDir = path.join(process.cwd(), 'client/dist/blog');
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
    
    <link rel="stylesheet" href="/assets/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="/assets/index.js"></script>
    
    <!-- Preload blog post data for instant rendering -->
    <script>
      window.__BLOG_POST_DATA__ = ${JSON.stringify(blogPost)};
    </script>
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
if (require.main === module) {
  generateBlogPages().then(() => {
    console.log('✨ Blog page generation complete!');
    process.exit(0);
  });
}

export { generateBlogPages };