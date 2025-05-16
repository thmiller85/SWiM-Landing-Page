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
      // Forward the request to the webhook
      const response = await fetch('https://thmiller85.app.n8n.cloud/webhook/onSwimFormSubmit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
      const data = await response.json().catch(() => ({}));
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Webhook proxy error:', error);
      res.status(500).json({ success: false, error: 'Failed to forward request to webhook' });
    }
  });
  
  // put other application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
