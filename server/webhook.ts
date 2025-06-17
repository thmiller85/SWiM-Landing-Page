/**
 * Webhook endpoint for automatic blog data updates
 * This allows external systems to trigger blog data refresh
 */

import { Request, Response } from 'express';
import { execSync } from 'child_process';
import fs from 'fs';

export async function handleBlogUpdateWebhook(req: Request, res: Response) {
  try {
    console.log('📋 Blog update webhook triggered');
    
    // Verify webhook authenticity (optional - add secret verification)
    const secret = req.headers['x-webhook-secret'];
    const expectedSecret = process.env.WEBHOOK_SECRET;
    
    if (expectedSecret && secret !== expectedSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Export current blog data
    execSync('tsx scripts/export-blog-data.ts', { stdio: 'inherit' });
    
    console.log('✅ Blog data updated successfully via webhook');
    res.json({ 
      success: true, 
      message: 'Blog data updated successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Webhook processing failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update blog data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function handleBlogStatusCheck(req: Request, res: Response) {
  try {
    // Check if static blog data exists and get info
    const staticDataPath = 'client/public/data/posts.json';
    let staticInfo = null;
    
    if (fs.existsSync(staticDataPath)) {
      const staticData = JSON.parse(fs.readFileSync(staticDataPath, 'utf8'));
      staticInfo = {
        postsCount: staticData.length,
        lastModified: fs.statSync(staticDataPath).mtime
      };
    }
    
    res.json({
      status: 'healthy',
      staticData: staticInfo,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}