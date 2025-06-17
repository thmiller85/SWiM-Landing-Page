import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { blogService } from "./blog";

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
