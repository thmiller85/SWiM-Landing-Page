#!/usr/bin/env tsx

/**
 * Export current database blog posts to static JSON files
 * This ensures production deployment has access to all current posts
 */

import fs from 'fs';
import path from 'path';
import { storage } from '../server/storage.js';

async function exportBlogData() {
  console.log('🔄 Exporting current blog data...');
  
  try {
    // Get all published posts from database
    const posts = await storage.getPublishedPosts();
    console.log(`Found ${posts.length} published posts in database`);
    
    // Convert to client format
    const clientPosts = posts.map(post => storage.convertToClientFormat(post));
    
    // Ensure data directory exists in multiple locations
    const dataDirs = [
      path.resolve('dist/public/data'),
      path.resolve('client/dist/data'),
      path.resolve('client/public/data')
    ];
    
    for (const dataDir of dataDirs) {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Export posts
      const postsFile = path.join(dataDir, 'posts.json');
      fs.writeFileSync(postsFile, JSON.stringify(clientPosts, null, 2));
      console.log(`✓ Exported ${clientPosts.length} posts to ${postsFile}`);
      
      // Export metadata
      const metadata = {
        totalPosts: clientPosts.length,
        categories: [...new Set(clientPosts.map(p => p.category))],
        tags: [...new Set(clientPosts.flatMap(p => p.tags))],
        lastExported: new Date().toISOString()
      };
      
      const metadataFile = path.join(dataDir, 'metadata.json');
      fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
      console.log(`✓ Exported metadata to ${metadataFile}`);
    }
    
    console.log('✅ Blog data export completed successfully');
    
    // List all exported posts for verification
    console.log('\n📋 Exported posts:');
    clientPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title} (${post.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Failed to export blog data:', error);
    process.exit(1);
  }
}

exportBlogData();