import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import path from "path";
import fetch from "node-fetch";
import { blogService } from "./blog";
import { storage } from "./storage";
import { googleSheetsService } from "./google-sheets";
// Import server-only validation schemas to avoid drizzle-orm in client bundle
import { 
  createPostSchema, 
  updatePostSchema, 
  createImageSchema, 
  updateImageSchema, 
  createUserSchema,
  type CreatePostInput,
  type UpdatePostInput
} from "./schema-validators";
import multer from "multer";
import fs from "fs/promises";
import { existsSync } from "fs";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { requireAuth, requireAdmin, requireEditor } from "./auth-middleware";

// Configure multer for temporary file handling during Object Storage upload
const upload = multer({ 
  storage: multer.memoryStorage(), // Store in memory for Object Storage upload
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Simple user agent parser
function parseUserAgent(userAgent: string): {
  deviceType: string;
  browser: string;
  os: string;
} {
  const ua = userAgent.toLowerCase();
  
  // Detect device type
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipad|tablet/.test(ua)) {
    deviceType = /tablet|ipad/.test(ua) ? 'tablet' : 'mobile';
  }
  
  // Detect browser
  let browser = 'unknown';
  if (ua.includes('chrome')) browser = 'chrome';
  else if (ua.includes('firefox')) browser = 'firefox';
  else if (ua.includes('safari')) browser = 'safari';
  else if (ua.includes('edge')) browser = 'edge';
  else if (ua.includes('opera')) browser = 'opera';
  
  // Detect OS
  let os = 'unknown';
  if (ua.includes('windows')) os = 'windows';
  else if (ua.includes('mac')) os = 'macos';
  else if (ua.includes('linux')) os = 'linux';
  else if (ua.includes('android')) os = 'android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'ios';
  
  return { deviceType, browser, os };
}

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('Registering routes...');
  
  // Initialize Object Storage service
  console.log('Initializing Object Storage service...');
  try {
    const objectStorageService = new ObjectStorageService();
    // Verify Object Storage is properly configured
    const publicPaths = objectStorageService.getPublicObjectSearchPaths();
    const privateDir = objectStorageService.getPrivateObjectDir();
    console.log('✓ Object Storage configured successfully');
    console.log(`Public paths: ${publicPaths.join(', ')}`);
    console.log(`Private directory: ${privateDir}`);
  } catch (error) {
    console.error('Error initializing Object Storage:', error);
    console.warn('Some upload functionality may not work properly');
  }
  
  // Serve objects from Object Storage
  app.get('/objects/:objectPath(*)', async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(
        req.path,
      );
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error('Error serving object:', error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });
  
  // Enhanced health check endpoint with database connectivity test
  app.get('/api/health', async (req, res) => {
    console.log('Health check endpoint hit');
    try {
      // Test database connectivity
      await storage.getPublishedPosts();
      
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(), 
        environment: process.env.NODE_ENV,
        database: 'connected',
        services: {
          storage: 'operational',
          api: 'healthy'
        }
      });
    } catch (error) {
      console.error('Health check failed:', error);
      res.status(503).json({ 
        status: 'unhealthy', 
        timestamp: new Date().toISOString(), 
        environment: process.env.NODE_ENV,
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        services: {
          storage: 'error',
          api: 'degraded'
        }
      });
    }
  });
  
  // Robots.txt handler to prevent redirect issues
  app.get('/robots.txt', (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('host');
    const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
    
    res.set('Content-Type', 'text/plain');
    res.send(robots);
  });

  // Dynamic sitemap generation based on current database posts
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const posts = await storage.getPublishedPosts();
      const baseUrl = req.protocol + '://' + req.get('host');
      
      // Static routes with priorities
      const staticRoutes = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/blog', priority: '0.9', changefreq: 'daily' },
        { url: '/team', priority: '0.8', changefreq: 'monthly' },
        { url: '/team/ross-stockdale', priority: '0.7', changefreq: 'monthly' },
        { url: '/team/tom-miller', priority: '0.7', changefreq: 'monthly' },
        { url: '/team/steve-wurster', priority: '0.7', changefreq: 'monthly' },
        { url: '/services/ai-powered-marketing', priority: '0.9', changefreq: 'weekly' },
        { url: '/services/workflow-automation', priority: '0.9', changefreq: 'weekly' },
        { url: '/services/b2b-saas-development', priority: '0.9', changefreq: 'weekly' },
        { url: '/services/data-intelligence', priority: '0.9', changefreq: 'weekly' },
        { url: '/services/ai-strategy-consulting', priority: '0.9', changefreq: 'weekly' },
        { url: '/services/ai-security-ethics', priority: '0.9', changefreq: 'weekly' },
        { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
        { url: '/terms', priority: '0.3', changefreq: 'yearly' }
      ];
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
${posts.map(post => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      // Fallback to static sitemap if it exists
      const staticSitemapPath = path.resolve(process.cwd(), 'client/public/sitemap.xml');
      if (existsSync(staticSitemapPath)) {
        res.sendFile(staticSitemapPath);
      } else {
        res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
      }
    }
  });

  // Note: Server-side rendering for blog posts is handled in server/index.ts
  // This ensures proper isolation from drizzle-orm dependencies

  // Legacy image serving removed - all images now served via Object Storage (/objects/* routes)

  // Legacy blog image serving removed - all images now served via Object Storage (/objects/* routes)
  
  // Blog API routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { category, tag, search, limit } = req.query;
      
      let posts;
      
      if (search && typeof search === 'string') {
        posts = await storage.searchPosts(search);
      } else if (category && typeof category === 'string') {
        posts = await storage.getPostsByCategory(category);
      } else if (tag && typeof tag === 'string') {
        posts = await storage.getPostsByTag(tag);
      } else {
        posts = await storage.getPublishedPosts();
      }
      
      if (limit && typeof limit === 'string') {
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum) && limitNum > 0) {
          posts = posts.slice(0, limitNum);
        }
      }
      
      // Convert database posts to blog format
      const blogPosts = posts.map(post => storage.convertToClientFormat(post));
      
      res.json(blogPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  // Database blog routes - must come before generic :slug route
  app.get('/api/blog/posts/database/all', async (req, res) => {
    try {
      console.log('Fetching published posts from database...');
      const posts = await storage.getPublishedPosts();
      console.log(`Found ${posts.length} published posts`);
      const convertedPosts = posts.map(post => storage.convertToClientFormat(post));
      res.json(convertedPosts);
    } catch (error) {
      console.error('Error fetching database posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts from database', details: (error as Error).message });
    }
  });

  app.get('/api/blog/posts/database/:slug', async (req, res) => {
    try {
      const post = await storage.getPostBySlug(req.params.slug);
      if (!post || post.status !== 'published') {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      // Track view
      await storage.trackView(post.id);
      
      const convertedPost = storage.convertToClientFormat(post);
      res.json(convertedPost);
    } catch (error) {
      console.error('Error fetching database post:', error);
      res.status(500).json({ error: 'Failed to fetch post from database' });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getPostBySlug(slug);
      
      if (!post || post.status !== 'published') {
        return res.status(404).json({ error: "Post not found" });
      }
      
      // Convert database post to blog format
      const blogPost = storage.convertToClientFormat(post);
      
      res.json(blogPost);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/metadata", (req, res) => {
    try {
      const metadata = blogService.getBlogMetadata();
      res.json(metadata);
    } catch (error) {
      console.error('Error fetching blog metadata:', error);
      res.status(500).json({ error: "Failed to fetch blog metadata" });
    }
  });

  app.get("/api/blog/recent", async (req, res) => {
    try {
      const { limit } = req.query;
      const limitNum = limit && typeof limit === 'string' ? parseInt(limit) : 5;
      const posts = await storage.getRecentPosts(limitNum);
      
      // Convert database posts to blog format
      const blogPosts = posts.map(post => storage.convertToClientFormat(post));
      
      res.json(blogPosts);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      res.status(500).json({ error: "Failed to fetch recent posts" });
    }
  });

  // Contact form submission endpoint
  app.post('/api/contact-form', async (req, res) => {
    try {
      const formData = req.body;
      console.log('Contact form data received:', formData);
      
      // Validate required fields based on the actual form structure
      if (!formData.name || !formData.email) {
        return res.status(400).json({ 
          error: 'Missing required fields', 
          details: 'Name and email are required' 
        });
      }

      // Forward to webhook
      const webhookUrl = 'https://n8n.srv863333.hstgr.cloud/webhook/onSwimFormSubmit';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Webhook responded with status ${response.status}`);
      }

      const result = await response.json();
      res.json({ success: true, data: result });
      
    } catch (error) {
      console.error('Contact form submission error:', error);
      res.status(500).json({ 
        error: 'Failed to submit contact form', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Blog tracking endpoints
  app.post('/api/blog/track/view', async (req, res) => {
    try {
      const { slug } = req.body;
      if (!slug) {
        return res.status(400).json({ error: 'Missing slug parameter' });
      }
      
      const post = await storage.getPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      await storage.trackView(post.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking blog view:', error);
      res.status(500).json({ error: 'Failed to track view' });
    }
  });

  app.post('/api/blog/track/lead', async (req, res) => {
    try {
      const { slug } = req.body;
      if (!slug) {
        return res.status(400).json({ error: 'Missing slug parameter' });
      }
      
      const post = await storage.getPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      await storage.trackLead(post.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking blog lead:', error);
      res.status(500).json({ error: 'Failed to track lead' });
    }
  });

  // Lead capture endpoint
  app.post('/api/leads/capture', async (req, res) => {
    try {
      const { 
        firstName, 
        lastName, 
        email, 
        company, 
        industry, 
        companySize, 
        phone,
        leadSource,
        postSlug,
        interactionData
      } = req.body;

      // Validate required fields
      if (!email || !firstName || !company || !leadSource) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get post ID if postSlug provided
      let postId = null;
      if (postSlug) {
        const post = await storage.getPostBySlug(postSlug);
        if (post) {
          postId = post.id;
        }
      }

      // Create lead
      const lead = await storage.createLead({
        firstName,
        lastName,
        email,
        company,
        industry,
        companySize,
        phone,
        leadSource,
        postId,
        interactionData,
      });

      // Initialize Google Sheets and add lead
      await googleSheetsService.ensureHeaders();
      const postTitle = postId ? (await storage.getPostById(postId))?.title : undefined;
      await googleSheetsService.addLead(lead, postTitle);

      res.json({ success: true, leadId: lead.id });
    } catch (error) {
      console.error('Error capturing lead:', error);
      res.status(500).json({ error: 'Failed to capture lead' });
    }
  });

  app.post('/api/blog/track/share', async (req, res) => {
    try {
      const { slug } = req.body;
      if (!slug) {
        return res.status(400).json({ error: 'Missing slug parameter' });
      }
      
      const post = await storage.getPostBySlug(slug);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      await storage.trackShare(post.id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking blog share:', error);
      res.status(500).json({ error: 'Failed to track share' });
    }
  });

  // =============================================================================
  // CMS API Routes - Database-backed content management
  // =============================================================================

  // Posts management - EDITOR REQUIRED
  app.get('/api/cms/posts', requireEditor, async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching CMS posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  app.get('/api/cms/posts/:id', requireEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getPostById(id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching CMS post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  });

  app.post('/api/cms/posts', requireEditor, async (req, res) => {
    try {
      const validatedData = createPostSchema.parse(req.body);
      
      // Convert publishedAt string to Date if provided
      const postData = {
        ...validatedData,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null
      };
      
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(400).json({ error: 'Failed to create post', details: error });
    }
  });

  app.put('/api/cms/posts/:id', requireEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const validatedData = updatePostSchema.parse(req.body);
      
      // Convert publishedAt string to Date if provided
      const updateData = {
        ...validatedData,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : undefined
      };

      const post = await storage.updatePost(id, updateData);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(400).json({ error: 'Failed to update post', details: error });
    }
  });

  app.delete('/api/cms/posts/:id', requireEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePost(id);
      if (!success) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  });

  // Image upload and management using Object Storage - EDITOR REQUIRED
  app.post('/api/cms/images/upload', requireEditor, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      console.log(`=== OBJECT STORAGE UPLOAD DEBUG ===`);
      console.log(`File: ${req.file.originalname}`);
      console.log(`Size: ${req.file.size} bytes`);
      console.log(`MIME type: ${req.file.mimetype}`);
      
      const objectStorageService = new ObjectStorageService();
      
      // Upload file to Object Storage
      const objectUrl = await objectStorageService.uploadCMSImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      
      console.log(`✓ File uploaded to Object Storage: ${objectUrl}`);

      // Generate filename from object URL for database storage
      const filename = objectUrl.split('/').pop() || `image-${Date.now()}.jpg`;

      const imageData = {
        filename: filename,
        originalName: req.file.originalname,
        url: objectUrl,
        size: req.file.size,
        mimeType: req.file.mimetype,
        altText: req.body.altText || '',
        caption: req.body.caption || '',
        width: null,
        height: null,
      };

      // Create database record
      const image = await storage.createImage(imageData);
      console.log(`✓ Image record created in database: ID ${image.id}`);
      
      // Verify database record was actually created
      const verifyImage = await storage.getImageById(image.id);
      if (!verifyImage) {
        console.error(`✗ Database verification failed for image ID ${image.id}`);
        // Note: Object Storage cleanup would require additional implementation
        return res.status(500).json({ error: 'Database verification failed' });
      }
      
      console.log(`✓ Database record verified for ID ${image.id}`);
      console.log(`✓ Upload complete: ${filename}`);
      
      res.status(201).json(image);
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image', details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/cms/images', requireEditor, async (req, res) => {
    try {
      const images = await storage.getAllImages();
      res.json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  });

  app.put('/api/cms/images/:id', requireEditor, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { altText, caption } = req.body;
      const image = await storage.updateImage(id, { altText, caption });
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
      res.json(image);
    } catch (error) {
      console.error('Error updating image:', error);
      res.status(500).json({ error: 'Failed to update image' });
    }
  });

  app.delete('/api/cms/images/:id', requireEditor, async (req, res) => {
    try {
      console.log(`=== DELETE DEBUG ===`);
      const id = parseInt(req.params.id);
      console.log(`Deleting image ID: ${id}`);
      
      const image = await storage.getImageById(id);
      if (!image) {
        console.log(`✗ Image ID ${id} not found in database`);
        return res.status(404).json({ error: 'Image not found' });
      }

      console.log(`Found image: ${image.filename}`);
      console.log(`Image URL: ${image.url}`);

      // Handle file deletion based on storage type
      if (image.url.startsWith('/objects/')) {
        // Object Storage file - delete from cloud storage
        console.log(`Deleting Object Storage file: ${image.url}`);
        try {
          const objectStorageService = new ObjectStorageService();
          const objectFile = await objectStorageService.getObjectEntityFile(image.url);
          await objectFile.delete();
          console.log(`✓ Deleted Object Storage file: ${image.url}`);
        } catch (fileError) {
          if (fileError instanceof ObjectNotFoundError) {
            console.warn(`Object Storage file not found (non-fatal): ${image.url}`);
          } else {
            console.error(`Error deleting Object Storage file ${image.url}:`, fileError);
          }
          // Continue with database deletion even if file deletion fails
        }
      } else {
        // Unknown storage type - only delete database record
        console.log(`Unknown file type for URL: ${image.url} - will only delete database record`);
      }

      console.log(`Deleting database record for ID: ${id}`);
      const success = await storage.deleteImage(id);
      console.log(`Database deletion success: ${success}`);
      
      res.json({ success });
    } catch (error) {
      console.error('=== DELETE ERROR ===');
      console.error('Error deleting image:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      res.status(500).json({ error: 'Failed to delete image', details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Test Object Storage endpoint - REMOVED FOR SECURITY
  // This endpoint was removed as it allowed public file uploads without authentication
  
  // Legacy migration and consistency check endpoints removed - Object Storage handles all image operations

  // Reading time calculation endpoint
  app.post('/api/cms/calculate-reading-time', requireAuth, async (req, res) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Content is required' });
      }

      // Use the same calculation logic as server storage
      const calculateReadingTime = (text: string): number => {
        if (!text || text.trim().length === 0) return 1;
        
        // Remove markdown formatting for accurate word count
        const plainText = text
          .replace(/#{1,6}\s/g, '') // Remove headings
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1') // Remove italic
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
          .replace(/```[\s\S]*?```/g, '') // Remove code blocks
          .replace(/`([^`]+)`/g, '$1') // Remove inline code
          .replace(/\n+/g, ' ') // Replace line breaks with spaces
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        const words = plainText.split(/\s+/).filter(word => word.length > 0).length;
        const wordsPerMinute = 200; // Average reading speed
        const readingTime = Math.ceil(words / wordsPerMinute);
        
        return Math.max(1, readingTime);
      };

      const readingTime = calculateReadingTime(content);
      const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

      res.json({
        readingTime,
        wordCount,
        wordsPerMinute: 200
      });
    } catch (error) {
      console.error('Error calculating reading time:', error);
      res.status(500).json({ error: 'Failed to calculate reading time' });
    }
  });

  // Analytics tracking
  app.post('/api/cms/analytics/:postId/view', requireAuth, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      await storage.trackView(postId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking view:', error);
      res.status(500).json({ error: 'Failed to track view' });
    }
  });

  app.post('/api/cms/analytics/:postId/lead', requireAuth, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      await storage.trackLead(postId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking lead:', error);
      res.status(500).json({ error: 'Failed to track lead' });
    }
  });

  app.post('/api/cms/analytics/:postId/share', requireAuth, async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      await storage.trackShare(postId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking share:', error);
      res.status(500).json({ error: 'Failed to track share' });
    }
  });

  // =============================================================================
  // Google Sheets OAuth Integration
  // =============================================================================

  // Get OAuth authorization URL
  app.get('/api/google-sheets/auth-url', (req, res) => {
    try {
      const authUrl = googleSheetsService.generateAuthUrl();
      res.json({ authUrl });
    } catch (error) {
      console.error('Error generating auth URL:', error);
      res.status(500).json({ error: 'Failed to generate auth URL' });
    }
  });

  // Handle OAuth callback and exchange code for tokens
  app.post('/api/google-sheets/auth/callback', async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: 'Authorization code required' });
      }

      const tokens = await googleSheetsService.getTokensFromCode(code);
      
      // In production, you'd save the refresh_token to environment variables
      // For now, return it so the user can set it manually
      res.json({ 
        success: true, 
        refreshToken: tokens.refresh_token,
        message: 'Save this refresh token as GOOGLE_REFRESH_TOKEN environment variable'
      });
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      res.status(500).json({ error: 'Failed to exchange authorization code' });
    }
  });

  // OAuth callback route
  app.get('/auth/google/callback', async (req, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        return res.send(`
          <html>
            <body>
              <h2>OAuth Error</h2>
              <p>No authorization code received.</p>
              <a href="/">Go back to app</a>
            </body>
          </html>
        `);
      }

      const tokens = await googleSheetsService.getTokensFromCode(code as string);
      
      res.send(`
        <html>
          <body>
            <h2>Google Sheets OAuth Success!</h2>
            <p>Copy this refresh token and add it to your environment variables:</p>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}
            </pre>
            <p>Add this to your Replit secrets or environment variables.</p>
            <a href="/">Go back to app</a>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.send(`
        <html>
          <body>
            <h2>OAuth Error</h2>
            <p>Failed to exchange authorization code: ${(error as Error).message}</p>
            <a href="/">Go back to app</a>
          </body>
        </html>
      `);
    }
  });

  // Test Google Sheets connection and configuration
  app.get('/api/google-sheets/test', async (req, res) => {
    try {
      const isConfigured = googleSheetsService.isConfigured();
      if (!isConfigured) {
        return res.json({ 
          configured: false, 
          message: 'Google Sheets not configured. Missing credentials.',
          instructions: googleSheetsService.getSetupInstructions()
        });
      }

      // Try to ensure headers (this will test the connection)
      await googleSheetsService.ensureHeaders();
      
      res.json({ 
        configured: true, 
        message: 'Google Sheets integration is working!' 
      });
    } catch (error) {
      console.error('Error testing Google Sheets:', error);
      res.status(500).json({ 
        configured: false, 
        error: 'Failed to connect to Google Sheets',
        details: (error as Error).message 
      });
    }
  });

  // =============================================================================
  // New Analytics System - Event Tracking
  // =============================================================================

  // Track analytics session
  app.post('/api/analytics/session', async (req, res) => {
    try {
      const sessionData = req.body;
      // Handle different ways to get IP address
      const ipAddress = req.ip || 
                       req.headers['x-forwarded-for'] || 
                       req.headers['x-real-ip'] ||
                       (req.socket && req.socket.remoteAddress) ||
                       'unknown';
      
      // Parse user agent for device info
      const userAgent = sessionData.userAgent || req.headers['user-agent'] || '';
      const deviceInfo = parseUserAgent(userAgent);
      
      // Ensure required fields are present
      if (!sessionData.sessionId || !sessionData.visitorId) {
        return res.status(400).json({ error: 'Missing required session data' });
      }
      
      const session = await storage.createOrUpdateSession({
        ...sessionData,
        ipAddress: typeof ipAddress === 'string' ? ipAddress : ipAddress?.toString() || 'unknown',
        userAgent,
        ...deviceInfo,
      });
      
      res.json({ success: true, sessionId: session.sessionId });
    } catch (error) {
      console.error('Error creating analytics session:', error);
      res.status(500).json({ error: 'Failed to create session', details: (error as Error).message });
    }
  });

  // Track analytics event
  app.post('/api/analytics/event', async (req, res) => {
    try {
      const eventData = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress;
      
      await storage.trackAnalyticsEvent({
        ...eventData,
        ipAddress,
        userAgent: req.headers['user-agent'] || '',
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      res.status(500).json({ error: 'Failed to track event' });
    }
  });

  // Get real-time analytics
  app.get('/api/analytics/realtime', async (req, res) => {
    try {
      const realtime = await storage.getRealtimeAnalytics();
      res.json(realtime);
    } catch (error) {
      console.error('Error fetching realtime analytics:', error);
      res.status(500).json({ error: 'Failed to fetch realtime analytics' });
    }
  });

  // Get analytics for date range
  app.get('/api/analytics/range', async (req, res) => {
    try {
      const { start, end, postId } = req.query;
      const analytics = await storage.getAnalyticsForRange(
        start as string,
        end as string,
        postId ? parseInt(postId as string) : undefined
      );
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics range:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Advanced analytics endpoints
  app.get('/api/cms/analytics/overview', async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      const publishedPosts = posts.filter(p => p.status === 'published');
      
      const overview = {
        totalPosts: posts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: posts.filter(p => p.status === 'draft').length,
        totalViews: posts.reduce((sum, post) => sum + post.views, 0),
        totalLeads: posts.reduce((sum, post) => sum + post.leads, 0),
        totalShares: posts.reduce((sum, post) => sum + post.shares, 0),
        averageViews: publishedPosts.length > 0 
          ? Math.round(publishedPosts.reduce((sum, post) => sum + post.views, 0) / publishedPosts.length)
          : 0,
        conversionRate: posts.reduce((sum, post) => sum + post.views, 0) > 0
          ? ((posts.reduce((sum, post) => sum + post.leads, 0) / posts.reduce((sum, post) => sum + post.views, 0)) * 100).toFixed(2)
          : '0.00',
      };
      
      res.json(overview);
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      res.status(500).json({ error: 'Failed to fetch analytics overview' });
    }
  });

  app.get('/api/cms/analytics/top-posts', async (req, res) => {
    try {
      const { limit = 10, metric = 'views' } = req.query;
      const posts = await storage.getPublishedPosts();
      
      // Sort by the specified metric
      const sortedPosts = posts.sort((a, b) => {
        switch (metric) {
          case 'leads':
            return b.leads - a.leads;
          case 'shares':
            return b.shares - a.shares;
          case 'conversion':
            const aConversion = a.views > 0 ? a.leads / a.views : 0;
            const bConversion = b.views > 0 ? b.leads / b.views : 0;
            return bConversion - aConversion;
          default:
            return b.views - a.views;
        }
      });
      
      const topPosts = sortedPosts.slice(0, parseInt(limit as string)).map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        views: post.views,
        leads: post.leads,
        shares: post.shares,
        conversionRate: post.views > 0 ? ((post.leads / post.views) * 100).toFixed(2) : '0.00',
        category: post.category,
        publishedAt: post.publishedAt,
      }));
      
      res.json(topPosts);
    } catch (error) {
      console.error('Error fetching top posts:', error);
      res.status(500).json({ error: 'Failed to fetch top posts' });
    }
  });

  app.get('/api/cms/analytics/by-category', async (req, res) => {
    try {
      const posts = await storage.getPublishedPosts();
      
      const categoryStats = posts.reduce((acc, post) => {
        const category = post.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = {
            posts: 0,
            views: 0,
            leads: 0,
            shares: 0,
          };
        }
        
        acc[category].posts++;
        acc[category].views += post.views;
        acc[category].leads += post.leads;
        acc[category].shares += post.shares;
        
        return acc;
      }, {} as Record<string, any>);
      
      // Calculate conversion rates and format response
      const formattedStats = Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        ...stats,
        conversionRate: stats.views > 0 ? ((stats.leads / stats.views) * 100).toFixed(2) : '0.00',
        averageViews: stats.posts > 0 ? Math.round(stats.views / stats.posts) : 0,
      }));
      
      res.json(formattedStats);
    } catch (error) {
      console.error('Error fetching category analytics:', error);
      res.status(500).json({ error: 'Failed to fetch category analytics' });
    }
  });

  app.get('/api/cms/analytics/by-tag', async (req, res) => {
    try {
      const posts = await storage.getPublishedPosts();
      
      const tagStats: Record<string, any> = {};
      
      posts.forEach(post => {
        post.tags.forEach(tag => {
          if (!tagStats[tag]) {
            tagStats[tag] = {
              posts: 0,
              views: 0,
              leads: 0,
              shares: 0,
            };
          }
          
          tagStats[tag].posts++;
          tagStats[tag].views += post.views;
          tagStats[tag].leads += post.leads;
          tagStats[tag].shares += post.shares;
        });
      });
      
      // Calculate conversion rates and format response
      const formattedStats = Object.entries(tagStats).map(([tag, stats]) => ({
        tag,
        ...stats,
        conversionRate: stats.views > 0 ? ((stats.leads / stats.views) * 100).toFixed(2) : '0.00',
        averageViews: stats.posts > 0 ? Math.round(stats.views / stats.posts) : 0,
      }));
      
      res.json(formattedStats);
    } catch (error) {
      console.error('Error fetching tag analytics:', error);
      res.status(500).json({ error: 'Failed to fetch tag analytics' });
    }
  });



  // User management - ADMIN ONLY
  app.post('/api/cms/users', requireAdmin, async (req, res) => {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      
      const user = await storage.createUser(validatedData);
      const { passwordHash, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ error: 'Failed to create user', details: error });
    }
  });

  app.post('/api/cms/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.validateUser(username, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Session fixation protection - regenerate session ID on login
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regeneration failed:', err);
          return res.status(500).json({ error: 'Login failed due to session error' });
        }
        
        // Store only secure user data in session (no passwordHash)
        const { passwordHash, ...sessionUser } = user;
        req.session.user = sessionUser;
        
        // Save session and respond
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error('Session save failed:', saveErr);
            return res.status(500).json({ error: 'Login failed due to session error' });
          }
          
          res.json({ user: sessionUser, message: 'Login successful' });
        });
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Logout endpoint to destroy session
  app.post('/api/cms/auth/logout', requireAuth, async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ message: 'Logout successful' });
      });
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // Check session endpoint to verify authentication status
  app.get('/api/cms/auth/session', (req, res) => {
    if (req.session && req.session.user) {
      // SessionUser already excludes passwordHash, so no need to destructure
      res.json({ user: req.session.user, authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  });





  // SPA fallback route - must be last to catch all non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes and let them 404 properly
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For all other routes, serve the React app
    // This will be handled by the Vite middleware in development
    // or by the static file server in production
    next();
  });

  const httpServer = createServer(app);

  return httpServer;
}
