import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";

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
