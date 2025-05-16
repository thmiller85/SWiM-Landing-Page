import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'client/public/sitemap.xml'));
  });
  
  // Proxy endpoint for form submissions
  app.post('/api/contact-form', async (req, res) => {
    try {
      console.log('Sending form data to n8n webhook:', req.body);
      
      // Convert request body to query parameters
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(req.body)) {
        params.append(key, String(value));
      }
      
      // Forward the request to the webhook using GET with query parameters
      const webhookUrl = `https://thmiller85.app.n8n.cloud/webhook/onSwimFormSubmit?${params.toString()}`;
      console.log('Sending request to webhook URL:', webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: 'GET'
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
