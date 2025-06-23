import fs from 'fs/promises';
import path from 'path';

/**
 * Persistent storage utility for handling file uploads across deployments
 * Uses multiple strategies to ensure files persist
 */

export interface PersistentStorageConfig {
  localPath: string;
  fallbackPaths: string[];
  enableVersioning: boolean;
}

export class PersistentStorage {
  private config: PersistentStorageConfig;
  
  constructor(config: PersistentStorageConfig) {
    this.config = config;
  }

  /**
   * Ensure storage directory exists with proper structure
   */
  async ensureStorageStructure(): Promise<void> {
    const localDir = this.config.localPath;
    
    try {
      await fs.mkdir(localDir, { recursive: true });
      
      // Create .gitkeep to ensure directory is tracked
      const gitkeepPath = path.join(localDir, '.gitkeep');
      const gitkeepExists = await fs.access(gitkeepPath).then(() => true).catch(() => false);
      
      if (!gitkeepExists) {
        await fs.writeFile(gitkeepPath, '# Ensures uploads directory is tracked by git\n');
      }
      
      console.log(`✓ Storage structure ensured at: ${localDir}`);
    } catch (error) {
      console.error('Error ensuring storage structure:', error);
      throw error;
    }
  }

  /**
   * Save file with persistence guarantees
   */
  async saveFile(filename: string, buffer: Buffer): Promise<string> {
    await this.ensureStorageStructure();
    
    const filePath = path.join(this.config.localPath, filename);
    
    try {
      await fs.writeFile(filePath, buffer);
      
      // Verify file was saved correctly
      const saved = await fs.readFile(filePath);
      if (saved.length !== buffer.length) {
        throw new Error('File size mismatch after save');
      }
      
      console.log(`✓ File saved successfully: ${filename} (${buffer.length} bytes)`);
      return filePath;
    } catch (error) {
      console.error(`Error saving file ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Check if file exists in any of the configured locations
   */
  async fileExists(filename: string): Promise<{ exists: boolean; path?: string }> {
    const primaryPath = path.join(this.config.localPath, filename);
    
    // Check primary location first
    try {
      await fs.access(primaryPath);
      return { exists: true, path: primaryPath };
    } catch {
      // Check fallback locations
      for (const fallbackPath of this.config.fallbackPaths) {
        const fallbackFilePath = path.join(fallbackPath, filename);
        try {
          await fs.access(fallbackFilePath);
          return { exists: true, path: fallbackFilePath };
        } catch {
          continue;
        }
      }
    }
    
    return { exists: false };
  }

  /**
   * Get file stats including size and modification time
   */
  async getFileStats(filename: string): Promise<{ size: number; modified: Date } | null> {
    const { exists, path: filePath } = await this.fileExists(filename);
    
    if (!exists || !filePath) {
      return null;
    }
    
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        modified: stats.mtime
      };
    } catch (error) {
      console.error(`Error getting file stats for ${filename}:`, error);
      return null;
    }
  }

  /**
   * Delete file from all locations
   */
  async deleteFile(filename: string): Promise<boolean> {
    let deleted = false;
    
    // Delete from primary location
    const primaryPath = path.join(this.config.localPath, filename);
    try {
      await fs.unlink(primaryPath);
      deleted = true;
      console.log(`✓ Deleted from primary location: ${filename}`);
    } catch (error) {
      console.warn(`Could not delete from primary location: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Delete from fallback locations
    for (const fallbackPath of this.config.fallbackPaths) {
      const fallbackFilePath = path.join(fallbackPath, filename);
      try {
        await fs.unlink(fallbackFilePath);
        deleted = true;
        console.log(`✓ Deleted from fallback location: ${filename}`);
      } catch (error) {
        // Silent fail for fallback locations
      }
    }
    
    return deleted;
  }

  /**
   * List all files in storage
   */
  async listFiles(): Promise<string[]> {
    await this.ensureStorageStructure();
    
    try {
      const files = await fs.readdir(this.config.localPath);
      return files.filter(file => file !== '.gitkeep');
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  /**
   * Migrate files from fallback locations to primary location
   */
  async migrateFiles(): Promise<{ migrated: number; errors: string[] }> {
    await this.ensureStorageStructure();
    
    let migrated = 0;
    const errors: string[] = [];
    
    for (const fallbackPath of this.config.fallbackPaths) {
      try {
        const fallbackExists = await fs.access(fallbackPath).then(() => true).catch(() => false);
        if (!fallbackExists) continue;
        
        const fallbackFiles = await fs.readdir(fallbackPath);
        
        for (const file of fallbackFiles) {
          if (file === '.gitkeep') continue;
          
          const sourcePath = path.join(fallbackPath, file);
          const destPath = path.join(this.config.localPath, file);
          
          // Only migrate if file doesn't exist in primary location
          const destExists = await fs.access(destPath).then(() => true).catch(() => false);
          if (destExists) continue;
          
          try {
            await fs.copyFile(sourcePath, destPath);
            migrated++;
            console.log(`✓ Migrated: ${file}`);
          } catch (error) {
            const errorMsg = `Failed to migrate ${file}: ${error instanceof Error ? error.message : String(error)}`;
            errors.push(errorMsg);
            console.warn(errorMsg);
          }
        }
      } catch (error) {
        console.warn(`Could not access fallback path ${fallbackPath}:`, error.message);
      }
    }
    
    return { migrated, errors };
  }
}

// Default persistent storage instance for images
export const imagePersistentStorage = new PersistentStorage({
  localPath: path.join(process.cwd(), 'uploads/images'),
  fallbackPaths: [
    path.join(process.cwd(), 'persistent-uploads')
  ],
  enableVersioning: false
});