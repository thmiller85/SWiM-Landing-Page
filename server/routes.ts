import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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
  
  // Proxy endpoint for form submissions
  app.post('/api/contact-form', async (req, res) => {
    console.log('Contact form endpoint hit!');
    try {
      console.log('Sending form data to n8n webhook:', req.body);
      
      // Forward the request to the webhook using POST
      const webhookUrl = 'https://thmiller85.app.n8n.cloud/webhook/onSwimFormSubmit';
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
  
  // put other application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
