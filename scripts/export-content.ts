#!/usr/bin/env tsx
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { storage } from '../server/storage';

/**
 * Export blog content from database to static JSON files
 * This allows the CMS to manage content while maintaining static deployment
 */
async function exportContent() {
  console.log('🚀 Exporting blog content from database...');
  
  try {
    // Ensure export directory exists
    const exportDir = join(process.cwd(), 'client/public/data');
    if (!existsSync(exportDir)) {
      mkdirSync(exportDir, { recursive: true });
    }

    // Export published posts
    const posts = await storage.getPublishedPosts();
    const formattedPosts = posts.map(post => storage.convertToClientFormat(post));
    
    // Write posts data
    writeFileSync(
      join(exportDir, 'posts.json'),
      JSON.stringify(formattedPosts, null, 2)
    );

    // Export individual post files for direct access
    for (const post of formattedPosts) {
      writeFileSync(
        join(exportDir, `${post.slug}.json`),
        JSON.stringify(post, null, 2)
      );
    }

    // Export blog metadata
    const categories = [...new Set(posts.map(p => p.category))];
    const tags = [...new Set(posts.flatMap(p => p.tags || []))];
    
    const metadata = {
      totalPosts: posts.length,
      categories,
      tags,
      lastExported: new Date().toISOString()
    };

    writeFileSync(
      join(exportDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log(`✅ Exported ${posts.length} posts successfully`);
    console.log(`📊 Categories: ${categories.join(', ')}`);
    console.log(`🏷️  Tags: ${tags.join(', ')}`);
    console.log(`📁 Files written to: ${exportDir}`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

// Run export if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exportContent();
}

export { exportContent };