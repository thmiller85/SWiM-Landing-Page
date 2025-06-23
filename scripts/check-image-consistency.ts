/**
 * Image Consistency Checker
 * Ensures database image records match physical files on startup
 */

import { db } from '../server/db';
import { images } from '../shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs/promises';
import path from 'path';

async function checkImageConsistency() {
  console.log('Checking image consistency...');
  
  try {
    // Get all images from database
    const dbImages = await db.select().from(images);
    const uploadsDir = path.join(process.cwd(), 'uploads/images');
    
    // Ensure uploads directory exists
    await fs.mkdir(uploadsDir, { recursive: true });
    
    // Check each database image for file existence
    for (const image of dbImages) {
      const filename = path.basename(image.url);
      const filePath = path.join(uploadsDir, filename);
      
      try {
        await fs.access(filePath);
        console.log(`✓ Image file exists: ${filename}`);
      } catch (error) {
        console.log(`✗ Orphaned image record found: ${filename} (ID: ${image.id})`);
        
        // Check persistent backup location for restoration
        const backupPath = path.join(process.cwd(), 'persistent-uploads', filename);
        
        let restored = false;
        try {
          await fs.access(backupPath);
          console.log(`  → Restoring from backup: ${backupPath}`);
          await fs.copyFile(backupPath, filePath);
          restored = true;
        } catch (backupError) {
          // File not found in backup location
        }
        
        if (!restored) {
          console.log(`  → Removing orphaned database record for ID: ${image.id}`);
          await db.delete(images).where(eq(images.id, image.id));
        }
      }
    }
    
    console.log('Image consistency check completed.');
  } catch (error) {
    console.error('Error during image consistency check:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkImageConsistency().then(() => process.exit(0));
}

export { checkImageConsistency };