import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, updateBlogPostSchema } from "@shared/schema";
import path from "path";
import fetch from "node-fetch";

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
  
  // Blog API Routes
  
  // Get all blog posts with optional filters
  app.get('/api/blog-posts', async (req, res) => {
    try {
      const { category, tag, status = 'published', limit = '10', offset = '0', search } = req.query;
      
      let posts;
      if (search) {
        posts = await storage.searchBlogPosts(search as string);
      } else {
        posts = await storage.getBlogPosts({
          category: category as string,
          tag: tag as string,
          status: status as string,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        });
      }
      
      res.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  // Get a single blog post by slug
  app.get('/api/blog-posts/slug/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      // Increment view count
      await storage.incrementBlogPostViews(post.id);
      
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });

  // Get a single blog post by ID
  app.get('/api/blog-posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPost(id);
      
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });

  // Create a new blog post
  app.post('/api/blog-posts', async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(400).json({ error: 'Invalid blog post data' });
    }
  });

  // Update a blog post
  app.patch('/api/blog-posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateBlogPostSchema.parse(req.body);
      const post = await storage.updateBlogPost(id, validatedData);
      
      if (!post) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      res.json(post);
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.status(400).json({ error: 'Invalid blog post data' });
    }
  });

  // Delete a blog post
  app.delete('/api/blog-posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBlogPost(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.status(500).json({ error: 'Failed to delete blog post' });
    }
  });

  // Get popular posts
  app.get('/api/blog-posts/popular/list', async (req, res) => {
    try {
      const { limit = '5' } = req.query;
      const posts = await storage.getPopularPosts(parseInt(limit as string));
      res.json(posts);
    } catch (error) {
      console.error('Error fetching popular posts:', error);
      res.status(500).json({ error: 'Failed to fetch popular posts' });
    }
  });

  // Get recent posts
  app.get('/api/blog-posts/recent/list', async (req, res) => {
    try {
      const { limit = '5' } = req.query;
      const posts = await storage.getRecentPosts(parseInt(limit as string));
      res.json(posts);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      res.status(500).json({ error: 'Failed to fetch recent posts' });
    }
  });

  // Increment lead count for a blog post
  app.post('/api/blog-posts/:id/lead', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementBlogPostLeads(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error incrementing lead count:', error);
      res.status(500).json({ error: 'Failed to increment lead count' });
    }
  });

  // Increment share count for a blog post
  app.post('/api/blog-posts/:id/share', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementBlogPostShares(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error incrementing share count:', error);
      res.status(500).json({ error: 'Failed to increment share count' });
    }
  });
  
  // Admin authentication middleware
  const requireAuth = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== 'Bearer admin123') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };

  // Admin login endpoint
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'swimai2024') {
      res.json({ token: 'admin123', success: true });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  });

  // Admin blog post routes (protected)
  app.get('/api/admin/blog-posts', requireAuth, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts({ status: 'all', limit: 100 });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching admin blog posts:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  // Proxy endpoint for form submissions
  app.post('/api/contact-form', async (req, res) => {
    console.log('Contact form endpoint hit!');
    try {
      console.log('Sending form data to n8n webhook:', req.body);
      
      // Forward the request to the webhook using POST
      const webhookUrl = 'https://n8n.srv863333.hstgr.cloud/webhook/onSwimFormSubmit';
      console.log('Sending POST request to webhook URL:', webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      const statusCode = response.status;
      console.log('Webhook response status:', statusCode);
      
      // Try to get response body if available
      let responseBody;
      try {
        responseBody = await response.text();
        console.log('Webhook response body:', responseBody);
      } catch (e) {
        console.log('Could not parse webhook response body');
      }
      
      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
      res.status(200).json({ 
        success: true,
        message: 'Form submitted successfully to n8n webhook' 
      });
    } catch (error) {
      console.error('Webhook proxy error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to forward request to webhook' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
