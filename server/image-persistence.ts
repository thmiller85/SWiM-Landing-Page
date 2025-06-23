import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Enhanced Image Persistence System
 * Provides automatic backup, restoration, and monitoring for uploaded images
 */

export class ImagePersistenceManager {
  private uploadsDir: string;
  private backupDir: string;
  private isMonitoring: boolean = false;
  private backupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads/images');
    this.backupDir = path.join(process.cwd(), 'persistent-uploads');
  }

  /**
   * Initialize the persistence system
   */
  async initialize(): Promise<void> {
    console.log('Initializing Image Persistence System...');
    
    // Ensure directories exist
    await this.ensureDirectories();
    
    // Restore any missing files from backup
    await this.restoreFromBackup();
    
    // Start monitoring and periodic backups
    this.startMonitoring();
    
    console.log('✓ Image Persistence System initialized');
  }

  /**
   * Ensure required directories exist
   */
  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.uploadsDir, { recursive: true });
    await fs.mkdir(this.backupDir, { recursive: true });
    
    // Create .gitkeep files to ensure directories are tracked
    const gitkeepContent = '# Ensures directory is tracked by git\n';
    const uploadsGitkeep = path.join(this.uploadsDir, '.gitkeep');
    const backupGitkeep = path.join(this.backupDir, '.gitkeep');
    
    try {
      await fs.access(uploadsGitkeep);
    } catch {
      await fs.writeFile(uploadsGitkeep, gitkeepContent);
    }
    
    try {
      await fs.access(backupGitkeep);
    } catch {
      await fs.writeFile(backupGitkeep, gitkeepContent);
    }
  }

  /**
   * Restore missing files from backup directory
   */
  async restoreFromBackup(): Promise<{ restored: number; errors: string[] }> {
    console.log('Checking for files to restore from backup...');
    
    const restored: string[] = [];
    const errors: string[] = [];
    
    try {
      const backupFiles = await fs.readdir(this.backupDir);
      const uploadsFiles = await fs.readdir(this.uploadsDir);
      const uploadsSet = new Set(uploadsFiles);
      
      for (const file of backupFiles) {
        if (file === '.gitkeep' || file === 'upload-metadata.json') continue;
        
        // If file doesn't exist in uploads, restore it
        if (!uploadsSet.has(file)) {
          try {
            const sourcePath = path.join(this.backupDir, file);
            const destPath = path.join(this.uploadsDir, file);
            
            await fs.copyFile(sourcePath, destPath);
            restored.push(file);
            console.log(`✓ Restored: ${file}`);
          } catch (error) {
            const errorMsg = `Failed to restore ${file}: ${error instanceof Error ? error.message : String(error)}`;
            errors.push(errorMsg);
            console.warn(errorMsg);
          }
        }
      }
      
      if (restored.length > 0) {
        console.log(`✓ Restored ${restored.length} files from backup`);
      } else {
        console.log('✓ All files up to date');
      }
      
    } catch (error) {
      console.warn('Could not read backup directory:', error instanceof Error ? error.message : String(error));
    }
    
    return { restored: restored.length, errors };
  }

  /**
   * Backup a single file immediately
   */
  async backupFile(filename: string): Promise<boolean> {
    try {
      const sourcePath = path.join(this.uploadsDir, filename);
      const destPath = path.join(this.backupDir, filename);
      
      await fs.copyFile(sourcePath, destPath);
      console.log(`✓ Backed up: ${filename}`);
      return true;
    } catch (error) {
      console.warn(`Failed to backup ${filename}:`, error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * Backup all files using the backup script
   */
  async backupAllFiles(): Promise<boolean> {
    try {
      execSync('node scripts/backup-uploads.js backup', { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
      console.log('✓ All files backed up successfully');
      return true;
    } catch (error) {
      console.warn('Backup failed:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * Start monitoring system with periodic backups
   */
  private startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Backup every 10 minutes
    this.backupInterval = setInterval(() => {
      this.backupAllFiles().catch(error => {
        console.warn('Periodic backup failed:', error);
      });
    }, 10 * 60 * 1000); // 10 minutes
    
    console.log('✓ Started periodic backup monitoring (every 10 minutes)');
  }

  /**
   * Stop monitoring system
   */
  stopMonitoring(): void {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
    }
    this.isMonitoring = false;
    console.log('✓ Stopped backup monitoring');
  }

  /**
   * Check file integrity and repair if needed
   */
  async checkAndRepairIntegrity(): Promise<{
    checked: number;
    missing: number;
    restored: number;
    errors: string[];
  }> {
    console.log('Checking file integrity...');
    
    const results = {
      checked: 0,
      missing: 0,
      restored: 0,
      errors: [] as string[]
    };
    
    try {
      // Get list of files that should exist (from database via API)
      const response = await fetch('http://localhost:5000/api/cms/images');
      if (!response.ok) {
        throw new Error('Could not fetch image list from database');
      }
      
      const images = await response.json();
      
      for (const image of images) {
        results.checked++;
        const filename = path.basename(image.url);
        const filePath = path.join(this.uploadsDir, filename);
        
        try {
          await fs.access(filePath);
        } catch {
          results.missing++;
          
          // Try to restore from backup
          const backupPath = path.join(this.backupDir, filename);
          try {
            await fs.access(backupPath);
            await fs.copyFile(backupPath, filePath);
            results.restored++;
            console.log(`✓ Restored missing file: ${filename}`);
          } catch {
            results.errors.push(`Could not restore ${filename} - no backup found`);
          }
        }
      }
      
    } catch (error) {
      results.errors.push(`Integrity check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log(`Integrity check complete: ${results.checked} checked, ${results.restored} restored, ${results.errors.length} errors`);
    return results;
  }

  /**
   * Manual cleanup - remove files that don't exist in database
   */
  async cleanupOrphanedFiles(): Promise<{ removed: number; errors: string[] }> {
    console.log('Cleaning up orphaned files...');
    
    const results = {
      removed: 0,
      errors: [] as string[]
    };
    
    try {
      // Get database images
      const response = await fetch('http://localhost:5000/api/cms/images');
      if (!response.ok) {
        throw new Error('Could not fetch image list from database');
      }
      
      const images = await response.json();
      const dbFilenames = new Set(images.map((img: any) => path.basename(img.url)));
      
      // Get physical files
      const physicalFiles = await fs.readdir(this.uploadsDir);
      
      for (const file of physicalFiles) {
        if (file === '.gitkeep' || file === 'upload-metadata.json') continue;
        
        if (!dbFilenames.has(file)) {
          try {
            const filePath = path.join(this.uploadsDir, file);
            await fs.unlink(filePath);
            results.removed++;
            console.log(`✓ Removed orphaned file: ${file}`);
          } catch (error) {
            results.errors.push(`Could not remove ${file}: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      }
      
    } catch (error) {
      results.errors.push(`Cleanup failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    console.log(`Cleanup complete: ${results.removed} files removed, ${results.errors.length} errors`);
    return results;
  }

  /**
   * Get system status
   */
  getStatus(): {
    isMonitoring: boolean;
    uploadsDir: string;
    backupDir: string;
    hasBackupInterval: boolean;
  } {
    return {
      isMonitoring: this.isMonitoring,
      uploadsDir: this.uploadsDir,
      backupDir: this.backupDir,
      hasBackupInterval: this.backupInterval !== null
    };
  }
}

// Export singleton instance
export const imagePersistence = new ImagePersistenceManager();