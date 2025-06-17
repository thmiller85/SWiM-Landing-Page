#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { storage } from '../server/storage.js';

/**
 * Generate static HTML pages for blog posts to fix direct URL access
 */
async function generateBlogPages() {
  console.log('Generating static blog post pages...');
  
  const distPath = path.resolve('dist');
  const templatePath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(templatePath)) {
    console.error('Template not found. Build the frontend first.');
    return;
  }
  
  const template = fs.readFileSync(templatePath, 'utf-8');
  
  try {
    const posts = await storage.getPublishedPosts();
    console.log(`Found ${posts.length} published posts`);
    
    for (const post of posts) {
      const blogPost = storage.convertToClientFormat(post);
      const blogDir = path.join(distPath, 'blog', blogPost.slug);
      const blogFile = path.join(blogDir, 'index.html');
      
      // Create directory
      if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
      }
      
      // Generate HTML with proper meta tags
      let html = template;
      
      // Update title and description
      const title = blogPost.metaTitle || blogPost.title;
      const description = blogPost.metaDescription || blogPost.excerpt || '';
      
      html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
      html = html.replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${escapeHtml(description)}"`);
      
      // Add Open Graph tags
      const ogTags = [
        `<meta property="og:title" content="${escapeHtml(title)}" />`,
        `<meta property="og:description" content="${escapeHtml(description)}" />`,
        `<meta property="og:type" content="article" />`,
        `<meta property="og:url" content="https://swimsolutions.replit.app/blog/${blogPost.slug}" />`,
        `<meta property="article:author" content="${escapeHtml(blogPost.author)}" />`,
        `<meta property="article:published_time" content="${blogPost.publishedAt}" />`,
        `<meta property="article:section" content="${escapeHtml(blogPost.category)}" />`
      ];
      
      if (blogPost.featuredImage) {
        ogTags.push(`<meta property="og:image" content="${blogPost.featuredImage}" />`);
      }
      
      html = html.replace('</head>', `    ${ogTags.join('\n    ')}\n</head>`);
      
      // Add structured data
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "author": {
          "@type": "Person",
          "name": blogPost.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "SWiM Agency",
          "url": "https://swimsolutions.replit.app"
        },
        "datePublished": blogPost.publishedAt,
        "dateModified": blogPost.updatedAt,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://swimsolutions.replit.app/blog/${blogPost.slug}`
        },
        "articleSection": blogPost.category,
        "keywords": blogPost.tags.join(", ")
      };
      
      if (blogPost.featuredImage) {
        structuredData.image = blogPost.featuredImage;
      }
      
      html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>\n</head>`);
      
      // Add hidden content for SEO
      const seoContent = `
<div style="display: none;" id="blog-seo-content">
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
  <div>By ${escapeHtml(blogPost.author)} in ${escapeHtml(blogPost.category)}</div>
  <div>Tags: ${blogPost.tags.map(tag => escapeHtml(tag)).join(', ')}</div>
  <div>Reading time: ${blogPost.readingTime} minutes</div>
</div>`;
      
      html = html.replace('<div id="root"></div>', `<div id="root"></div>${seoContent}`);
      
      fs.writeFileSync(blogFile, html);
      console.log(`Generated: /blog/${blogPost.slug}`);
    }
    
    console.log(`Successfully generated ${posts.length} blog post pages`);
    
  } catch (error) {
    console.warn('Could not generate blog posts:', error.message);
    console.log('This is normal if database is not available during build');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

generateBlogPages().catch(console.error);