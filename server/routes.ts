import type { Express, Request, Response } from "express";
import express from "express";
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

  // Server-side rendered blog post pages for SEO optimization
  app.get('/blog/:slug', async (req, res, next) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getPostBySlug(slug);
      
      if (!post) {
        // If post not found, continue to SPA fallback
        return next();
      }
      
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com' 
        : 'http://localhost:5000';
      
      // Generate server-side rendered HTML with complete meta tags
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.metaTitle || post.title}</title>
  <meta name="description" content="${post.metaDescription || post.excerpt || ''}">
  <meta name="keywords" content="${post.targetKeywords?.join(', ') || ''}">
  <meta name="author" content="${post.author}">
  <link rel="canonical" href="${baseUrl}/blog/${post.slug}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${baseUrl}/blog/${post.slug}">
  <meta property="og:title" content="${post.metaTitle || post.title}">
  <meta property="og:description" content="${post.metaDescription || post.excerpt || ''}">
  ${post.featuredImage ? `<meta property="og:image" content="${baseUrl}${post.featuredImage}">` : ''}
  <meta property="og:site_name" content="SWiM AI">
  <meta property="article:author" content="${post.author}">
  <meta property="article:published_time" content="${post.publishedAt?.toISOString() || post.createdAt.toISOString()}">
  <meta property="article:modified_time" content="${post.updatedAt.toISOString()}">
  <meta property="article:section" content="${post.category}">
  ${post.tags?.map(tag => `<meta property="article:tag" content="${tag}">`).join('\n  ') || ''}
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${baseUrl}/blog/${post.slug}">
  <meta property="twitter:title" content="${post.metaTitle || post.title}">
  <meta property="twitter:description" content="${post.metaDescription || post.excerpt || ''}">
  ${post.featuredImage ? `<meta property="twitter:image" content="${baseUrl}${post.featuredImage}">` : ''}
  
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${post.title}",
    "description": "${post.metaDescription || post.excerpt || ''}",
    "image": "${post.featuredImage ? baseUrl + post.featuredImage : ''}",
    "author": {
      "@type": "Person",
      "name": "${post.author}"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SWiM AI",
      "logo": {
        "@type": "ImageObject",
        "url": "${baseUrl}/logo.png"
      }
    },
    "datePublished": "${post.publishedAt?.toISOString() || post.createdAt.toISOString()}",
    "dateModified": "${post.updatedAt.toISOString()}",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${baseUrl}/blog/${post.slug}"
    },
    "keywords": "${post.targetKeywords?.join(', ') || ''}",
    "articleSection": "${post.category}",
    "wordCount": "${post.content.split(' ').length}",
    "timeRequired": "PT${post.readingTime}M"
  }
  </script>
  
  <link rel="stylesheet" href="/src/index.css">
</head>
<body>
  <div id="root"></div>
  <script>
    // Set the blog post slug for client-side fetching
    window.__BLOG_POST_SLUG__ = "${slug}";
  </script>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (error) {
      console.error('Error rendering blog post:', error);
      next(); // Continue to SPA fallback
    }
  });

  // Serve uploaded images
  app.get('/images/*', (req, res) => {
    const imagePath = path.join(process.cwd(), 'public', req.path);
    res.sendFile(imagePath, (err) => {
      if (err && !res.headersSent) {
        res.status(404).json({ error: 'Image not found' });
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
        featuredImage: z.string().nullable().optional(),
        author: z.string().min(1),
        status: z.enum(['draft', 'published']).default('draft'),
        ctaType: z.enum(['consultation', 'download', 'newsletter', 'demo']).default('consultation'),
        category: z.string().min(1),
        tags: z.array(z.string()).default([]),
        targetKeywords: z.array(z.string()).default([]),
        readingTime: z.number().optional().default(0),
        publishedAt: z.string().nullable().optional(),
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
      
      // Create update schema that matches the create schema
      const updatePostSchema = z.object({
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        content: z.string().optional(),
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        excerpt: z.string().optional(),
        featuredImage: z.string().nullable().optional(),
        author: z.string().min(1).optional(),
        status: z.enum(['draft', 'published']).optional(),
        ctaType: z.enum(['consultation', 'download', 'newsletter', 'demo']).optional(),
        category: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
        targetKeywords: z.array(z.string()).optional(),
        readingTime: z.number().optional(),
        publishedAt: z.string().nullable().optional(),
      });

      const validatedData = updatePostSchema.parse(req.body);
      
      // Convert publishedAt string to Date if provided
      const updateData: any = {
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
