import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { blogService } from "./blog";
import { storage } from "./storage";
import { insertPostSchema, insertImageSchema, insertUserSchema } from "../shared/schema";
import z from "zod";
import multer from "multer";
import fs from "fs/promises";

// Configure multer for image uploads
const storage_config = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public/images/blog');
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

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('Registering routes...');
  
  // Debug endpoint to test if API routes are working
  app.get('/api/health', (req, res) => {
    console.log('Health check endpoint hit');
    res.json({ status: 'ok', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV });
  });
  
  // Serve sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'client/public/sitemap.xml'));
  });
  
  // Blog API routes
  app.get("/api/blog/posts", (req, res) => {
    try {
      const { category, tag, search, limit } = req.query;
      
      let posts = blogService.getAllPosts();
      
      if (search && typeof search === 'string') {
        posts = blogService.searchPosts(search);
      } else if (category && typeof category === 'string') {
        posts = blogService.getPostsByCategory(category);
      } else if (tag && typeof tag === 'string') {
        posts = blogService.getPostsByTag(tag);
      }
      
      if (limit && typeof limit === 'string') {
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum) && limitNum > 0) {
          posts = posts.slice(0, limitNum);
        }
      }
      
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:slug", (req, res) => {
    try {
      const { slug } = req.params;
      const post = blogService.getPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      
      res.json(post);
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

  app.get("/api/blog/recent", (req, res) => {
    try {
      const { limit } = req.query;
      const limitNum = limit && typeof limit === 'string' ? parseInt(limit) : 5;
      const posts = blogService.getRecentPosts(limitNum);
      res.json(posts);
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
      // Create a custom validation schema for the API request
      const createPostSchema = z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        excerpt: z.string().optional(),
        featuredImage: z.string().optional(),
        author: z.string().min(1),
        status: z.enum(['draft', 'published']).default('draft'),
        ctaType: z.enum(['consultation', 'download', 'newsletter', 'demo']).default('consultation'),
        category: z.string().min(1),
        tags: z.array(z.string()).default([]),
        targetKeywords: z.array(z.string()).default([]),
        readingTime: z.number().optional().default(0),
        publishedAt: z.string().optional(),
      });

      const validatedData = createPostSchema.parse(req.body);
      
      // Convert publishedAt string to Date if provided
      const postData: any = {
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
      const validatedData = insertPostSchema.partial().parse(req.body);
      const post = await storage.updatePost(id, validatedData);
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
  app.post('/api/cms/images', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const imageData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/images/blog/${req.file.filename}`,
        size: req.file.size,
        mimeType: req.file.mimetype,
        altText: req.body.altText || '',
        caption: req.body.caption || '',
        width: null,
        height: null,
      };

      const image = await storage.createImage(imageData);
      res.status(201).json(image);
    } catch (error) {
      console.error('Error uploading image:', error);
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

      // Delete physical file
      const filePath = path.join(process.cwd(), 'public', image.url);
      try {
        await fs.unlink(filePath);
      } catch (fileError) {
        console.warn('Could not delete physical file:', fileError);
      }

      const success = await storage.deleteImage(id);
      res.json({ success });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Failed to delete image' });
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

  // User management
  app.post('/api/cms/users', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
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

  // Update blog routes to use database when available
  app.get('/api/blog/posts/database', async (req, res) => {
    try {
      const posts = await storage.getPublishedPosts();
      const convertedPosts = posts.map(post => storage.convertToClientFormat(post));
      res.json(convertedPosts);
    } catch (error) {
      console.error('Error fetching database posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts from database' });
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

  // SPA fallback route - must be last to catch all non-API routes
  app.get('*', (req, res, next) => {
    // Skip API routes and let them 404 properly
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For all other routes (including /admin/login), serve the React app
    // This will be handled by the Vite middleware in development
    // or by the static file server in production
    next();
  });

  const httpServer = createServer(app);

  return httpServer;
}
