import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import path from "path";
import { blogService } from "./blog";
import { storage } from "./storage";
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
import { imagePersistentStorage } from "./storage-persistent";
import { imagePersistence } from "./image-persistence";

// Configure multer for image uploads - use persistent uploads directory
const storage_config = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads/images');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, '');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_config,
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
  
  // Initialize persistent storage and restore uploads from backup
  console.log('Initializing persistent image storage...');
  try {
    await imagePersistentStorage.ensureStorageStructure();
    
    // Restore uploads from backup on startup (deployment-safe)
    const { execSync } = await import("child_process");
    try {
      execSync("node scripts/backup-uploads.js restore", { stdio: "inherit" });
    } catch (restoreError) {
      console.warn('Backup restore failed (this is normal for first deployment)');
    }
    
    const migration = await imagePersistentStorage.migrateFiles();
    if (migration.migrated > 0) {
      console.log(`✓ Migrated ${migration.migrated} files to persistent storage`);
    }
    if (migration.errors.length > 0) {
      console.warn(`Migration warnings: ${migration.errors.length} errors`);
    }
  } catch (error) {
    console.error('Error initializing persistent storage:', error);
  }
  
  // Serve uploaded images statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  
  // Debug endpoint to test if API routes are working
  app.get('/api/health', (req, res) => {
    console.log('Health check endpoint hit');
    res.json({ status: 'ok', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV });
  });
  
  // Dynamic sitemap generation based on current database posts
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const posts = await storage.getPublishedPosts();
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com' 
        : 'http://localhost:5000';
      
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
${posts.map(post => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      // Fallback to static sitemap if it exists
      const staticSitemapPath = path.resolve(process.cwd(), 'client/public/sitemap.xml');
      if (require('fs').existsSync(staticSitemapPath)) {
        res.sendFile(staticSitemapPath);
      } else {
        res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
      }
    }
  });

  // Note: Server-side rendering for blog posts is handled in server/index.ts
  // This ensures proper isolation from drizzle-orm dependencies

  // Serve uploaded images from persistent uploads directory
  app.get('/uploads/images/*', (req, res) => {
    const imagePath = path.join(process.cwd(), req.path);
    res.sendFile(imagePath, (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ error: 'Image not found' });
      }
    });
  });

  // Legacy support for old image paths
  app.get('/images/blog/*', (req, res) => {
    const filename = path.basename(req.path);
    const imagePath = path.join(process.cwd(), 'uploads/images', filename);
    res.sendFile(imagePath, (err) => {
      if (err && !res.headersSent) {
        // Fallback to old location
        const oldPath = path.join(process.cwd(), 'public', req.path);
        res.sendFile(oldPath, (fallbackErr) => {
          if (fallbackErr && !res.headersSent) {
            res.status(404).json({ error: 'Image not found' });
          }
        });
      }
    });
  });
  
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
      const { name, email, company, message, privacyConsent } = req.body;
      
      if (!name || !email || !message || !privacyConsent) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Here you would typically send an email or save to a database
      // For now, we'll just log and return success
      console.log('Contact form submission:', { name, email, company, message });
      
      res.json({ success: true, message: 'Thank you for your message. We will get back to you soon!' });
    } catch (error) {
      console.error('Error processing contact form:', error);
      res.status(500).json({ error: 'Failed to submit contact form' });
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

  // Posts management
  app.get('/api/cms/posts', async (req, res) => {
    try {
      const posts = await storage.getAllPosts();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching CMS posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });

  app.get('/api/cms/posts/:id', async (req, res) => {
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

  app.post('/api/cms/posts', async (req, res) => {
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

  app.put('/api/cms/posts/:id', async (req, res) => {
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

  app.delete('/api/cms/posts/:id', async (req, res) => {
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

  // Image upload and management
  app.post('/api/cms/images/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      // Verify file was actually saved to disk
      const filePath = path.join(process.cwd(), 'uploads/images', req.file.filename);
      try {
        await fs.access(filePath);
        console.log(`✓ File successfully saved: ${req.file.filename}`);
      } catch (fileError) {
        console.error(`✗ File not found after upload: ${filePath}`, fileError);
        return res.status(500).json({ error: 'File upload failed - file not saved' });
      }

      const imageData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/uploads/images/${req.file.filename}`,
        size: req.file.size,
        mimeType: req.file.mimetype,
        altText: req.body.altText || '',
        caption: req.body.caption || '',
        width: null,
        height: null,
      };

      const image = await storage.createImage(imageData);
      console.log(`✓ Image record created in database: ID ${image.id}`);
      
      // Backup the uploaded image immediately for deployment persistence
      try {
        const { execSync } = await import("child_process");
        execSync("node scripts/backup-uploads.js backup", { stdio: "pipe" });
        console.log(`✓ Image backed up for persistence: ${req.file.filename}`);
      } catch (backupError) {
        console.warn('Image backup failed (upload still successful):', backupError);
      }
      
      res.status(201).json(image);
    } catch (error) {
      console.error('Error uploading image:', error);
      // Clean up file if database save failed
      if (req.file) {
        const filePath = path.join(process.cwd(), 'uploads/images', req.file.filename);
        try {
          await fs.unlink(filePath);
          console.log('Cleaned up orphaned file after database error');
        } catch (cleanupError) {
          console.warn('Could not clean up orphaned file:', cleanupError);
        }
      }
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  app.get('/api/cms/images', async (req, res) => {
    try {
      const images = await storage.getAllImages();
      res.json(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  });

  app.put('/api/cms/images/:id', async (req, res) => {
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

  app.delete('/api/cms/images/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const image = await storage.getImageById(id);
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Delete physical file from uploads directory
      const filename = path.basename(image.url);
      const filePath = path.join(process.cwd(), 'uploads/images', filename);
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        console.warn('Could not delete physical file:', fileError);
        // Try legacy path as fallback
        const legacyPath = path.join(process.cwd(), 'public', image.url);
        try {
          await fs.unlink(legacyPath);
        } catch (legacyError) {
          console.warn('Could not delete from legacy path either:', legacyError);
        }
      }

      const success = await storage.deleteImage(id);
      res.json({ success });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  });

  // Image consistency check and repair endpoint
  app.post('/api/cms/images/consistency-check', async (req, res) => {
    try {
      const images = await storage.getAllImages();
      const uploadsDir = path.join(process.cwd(), 'uploads/images');
      const backupDir = path.join(process.cwd(), 'persistent-uploads');
      const results = {
        checked: 0,
        orphaned: 0,
        repaired: 0,
        cleaned: [] as Array<{ id: number; filename: string }>,
        restored: [] as Array<{ id: number; filename: string }>
      };

      // Ensure uploads directory exists
      await fs.mkdir(uploadsDir, { recursive: true });

      for (const image of images) {
        results.checked++;
        const filename = path.basename(image.url);
        const filePath = path.join(uploadsDir, filename);
        const backupPath = path.join(backupDir, filename);

        try {
          await fs.access(filePath);
          console.log(`✓ Image file exists: ${filename}`);
        } catch (error) {
          console.log(`✗ Missing image file: ${filename} (ID: ${image.id})`);
          
          // Try to restore from backup
          try {
            await fs.access(backupPath);
            await fs.copyFile(backupPath, filePath);
            results.repaired++;
            results.restored.push({ id: image.id, filename });
            console.log(`  ✓ Restored from backup: ${filename}`);
          } catch (backupError) {
            console.log(`  ✗ No backup found for: ${filename}`);
            results.orphaned++;
            
            // Remove orphaned database record
            await storage.deleteImage(image.id);
            results.cleaned.push({ id: image.id, filename });
            console.log(`  → Removed orphaned database record for ID: ${image.id}`);
          }
        }
      }

      res.json(results);
    } catch (error) {
      console.error('Error during consistency check:', error);
      res.status(500).json({ error: 'Failed to perform consistency check' });
    }
  });

  // Add GET endpoint for easier testing
  app.get('/api/cms/images/consistency-check', async (req, res) => {
    try {
      const images = await storage.getAllImages();
      const uploadsDir = path.join(process.cwd(), 'uploads/images');
      const backupDir = path.join(process.cwd(), 'persistent-uploads');
      const missingFiles = [];
      const existingFiles = [];
      
      for (const image of images) {
        const filename = path.basename(image.url);
        const filePath = path.join(uploadsDir, filename);
        const backupPath = path.join(backupDir, filename);
        
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
        const backupExists = await fs.access(backupPath).then(() => true).catch(() => false);
        
        if (fileExists) {
          existingFiles.push({ id: image.id, filename, hasBackup: backupExists });
        } else {
          missingFiles.push({ id: image.id, filename, hasBackup: backupExists });
        }
      }
      
      res.json({
        totalImages: images.length,
        existingCount: existingFiles.length,
        missingCount: missingFiles.length,
        existingFiles,
        missingFiles
      });
    } catch (error) {
      console.error('Error checking image consistency:', error);
      res.status(500).json({ error: 'Failed to check image consistency' });
    }
  });

  // Reading time calculation endpoint
  app.post('/api/cms/calculate-reading-time', async (req, res) => {
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
  app.post('/api/cms/analytics/:postId/view', async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      await storage.trackView(postId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking view:', error);
      res.status(500).json({ error: 'Failed to track view' });
    }
  });

  app.post('/api/cms/analytics/:postId/lead', async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      await storage.trackLead(postId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error tracking lead:', error);
      res.status(500).json({ error: 'Failed to track lead' });
    }
  });

  app.post('/api/cms/analytics/:postId/share', async (req, res) => {
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

  // User management
  app.post('/api/cms/users', async (req, res) => {
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
      
      const { passwordHash, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, message: 'Login successful' });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login failed' });
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
