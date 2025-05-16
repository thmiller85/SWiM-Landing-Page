import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

// Store form submissions in memory
const contactSubmissions: any[] = [];

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'client/public/sitemap.xml'));
  });
  
  // Endpoint to handle contact form submissions
  app.post('/api/contact-form', (req, res) => {
    try {
      // Get the form data from the request body
      const formData = req.body;
      
      // Add timestamp
      const submission = {
        ...formData,
        timestamp: new Date().toISOString()
      };
      
      // Store the submission
      contactSubmissions.push(submission);
      
      console.log('New contact form submission:', submission);
      
      // Return success response
      res.status(200).json({ 
        success: true, 
        message: 'Form submitted successfully',
        submissionId: contactSubmissions.length
      });
    } catch (error) {
      console.error('Form submission error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process form submission'
      });
    }
  });
  
  // Endpoint to view submissions (would be protected in a real application)
  app.get('/api/contact-submissions', (req, res) => {
    res.json({ submissions: contactSubmissions });
  });
  
  // put other application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
