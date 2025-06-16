// Serverless function for blog posts API
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, desc } from 'drizzle-orm';

// Import schema (adjust path based on deployment structure)
const schema = {
  blogPosts: {
    id: 'id',
    title: 'title', 
    slug: 'slug',
    excerpt: 'excerpt',
    content: 'content',
    category: 'category',
    author: 'author',
    status: 'status',
    ctaType: 'ctaType',
    featuredImage: 'featuredImage',
    seoTitle: 'seoTitle',
    metaDescription: 'metaDescription',
    downloadableResource: 'downloadableResource',
    views: 'views',
    leads: 'leads',
    shares: 'shares',
    tags: 'tags',
    targetKeywords: 'targetKeywords',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    publishedAt: 'publishedAt'
  }
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Database connection
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    // Authentication for admin endpoints
    const isAdminEndpoint = req.url.includes('/admin/');
    if (isAdminEndpoint) {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token !== 'admin123') {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
    }

    // Handle different HTTP methods and endpoints
    if (req.method === 'GET' && req.url.includes('/admin/blog-posts')) {
      // Admin: Get all blog posts
      const posts = await db.execute('SELECT * FROM blog_posts ORDER BY created_at DESC');
      res.status(200).json(posts.rows);
      
    } else if (req.method === 'GET' && req.url.match(/\/blog-posts\/(\d+)$/)) {
      // Get single blog post by ID
      const id = req.url.match(/\/blog-posts\/(\d+)$/)[1];
      const result = await db.execute('SELECT * FROM blog_posts WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      
      res.status(200).json(result.rows[0]);
      
    } else if (req.method === 'GET' && req.url.includes('/blog-posts')) {
      // Public: Get published blog posts
      const result = await db.execute(
        'SELECT * FROM blog_posts WHERE status = $1 ORDER BY published_at DESC',
        ['published']
      );
      res.status(200).json(result.rows);
      
    } else if (req.method === 'POST' && req.url.includes('/blog-posts')) {
      // Create new blog post
      const data = req.body;
      const result = await db.execute(`
        INSERT INTO blog_posts (
          title, slug, excerpt, content, category, author, status, cta_type,
          featured_image, seo_title, meta_description, downloadable_resource,
          tags, target_keywords, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        ) RETURNING *
      `, [
        data.title, data.slug, data.excerpt, data.content, data.category,
        data.author, data.status, data.ctaType, data.featuredImage,
        data.seoTitle, data.metaDescription, data.downloadableResource,
        JSON.stringify(data.tags), JSON.stringify(data.targetKeywords),
        new Date(), new Date()
      ]);
      
      res.status(201).json(result.rows[0]);
      
    } else if (req.method === 'PATCH' && req.url.match(/\/blog-posts\/(\d+)$/)) {
      // Update blog post
      const id = req.url.match(/\/blog-posts\/(\d+)$/)[1];
      const data = req.body;
      
      const result = await db.execute(`
        UPDATE blog_posts SET
          title = $1, slug = $2, excerpt = $3, content = $4, category = $5,
          author = $6, status = $7, cta_type = $8, featured_image = $9,
          seo_title = $10, meta_description = $11, downloadable_resource = $12,
          tags = $13, target_keywords = $14, updated_at = $15
        WHERE id = $16 RETURNING *
      `, [
        data.title, data.slug, data.excerpt, data.content, data.category,
        data.author, data.status, data.ctaType, data.featuredImage,
        data.seoTitle, data.metaDescription, data.downloadableResource,
        JSON.stringify(data.tags), JSON.stringify(data.targetKeywords),
        new Date(), id
      ]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Post not found' });
        return;
      }
      
      res.status(200).json(result.rows[0]);
      
    } else if (req.method === 'DELETE' && req.url.match(/\/blog-posts\/(\d+)$/)) {
      // Delete blog post
      const id = req.url.match(/\/blog-posts\/(\d+)$/)[1];
      await db.execute('DELETE FROM blog_posts WHERE id = $1', [id]);
      res.status(200).json({ success: true });
      
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await pool.end();
  }
}