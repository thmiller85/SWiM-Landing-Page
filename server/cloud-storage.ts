/**
 * Cloud Storage Service for Production Image Uploads
 * Handles image storage in production environments where local file systems are ephemeral
 */

import { createHash } from 'crypto';

export interface CloudStorageConfig {
  provider: 'local' | 'cloudinary' | 's3';
  apiKey?: string;
  apiSecret?: string;
  cloudName?: string;
  bucket?: string;
  region?: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
  size: number;
  format: string;
}

export class CloudStorageService {
  private config: CloudStorageConfig;

  constructor(config: CloudStorageConfig) {
    this.config = config;
  }

  /**
   * Upload image buffer to cloud storage
   */
  async uploadImage(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<UploadResult> {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (!isProduction || this.config.provider === 'local') {
      // Development: use local storage
      return this.uploadToLocal(buffer, filename, mimeType);
    }

    // Production: use cloud storage
    switch (this.config.provider) {
      case 'cloudinary':
        return this.uploadToCloudinary(buffer, filename, mimeType);
      case 's3':
        return this.uploadToS3(buffer, filename, mimeType);
      default:
        throw new Error(`Unsupported storage provider: ${this.config.provider}`);
    }
  }

  /**
   * Delete image from cloud storage
   */
  async deleteImage(publicId: string): Promise<boolean> {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (!isProduction || this.config.provider === 'local') {
      return this.deleteFromLocal(publicId);
    }

    switch (this.config.provider) {
      case 'cloudinary':
        return this.deleteFromCloudinary(publicId);
      case 's3':
        return this.deleteFromS3(publicId);
      default:
        return false;
    }
  }

  /**
   * Local storage for development
   */
  private async uploadToLocal(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<UploadResult> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const uploadDir = path.join(process.cwd(), 'persistent-uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    
    return {
      url: `/persistent-uploads/${filename}`,
      publicId: filename,
      size: buffer.length,
      format: mimeType.split('/')[1]
    };
  }

  private async deleteFromLocal(filename: string): Promise<boolean> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    try {
      const filePath = path.join(process.cwd(), 'persistent-uploads', filename);
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.warn('Could not delete local file:', error);
      return false;
    }
  }

  /**
   * Cloudinary storage for production
   */
  private async uploadToCloudinary(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<UploadResult> {
    if (!this.config.apiKey || !this.config.apiSecret || !this.config.cloudName) {
      throw new Error('Cloudinary credentials not configured');
    }

    // Generate public ID from filename
    const publicId = `cms/${filename.replace(/\.[^/.]+$/, '')}`;
    
    // Create upload URL with signature
    const timestamp = Math.round(Date.now() / 1000);
    const signature = this.generateCloudinarySignature(publicId, timestamp);
    
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: mimeType }));
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', this.config.apiKey);
    formData.append('signature', signature);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      format: result.format
    };
  }

  private async deleteFromCloudinary(publicId: string): Promise<boolean> {
    if (!this.config.apiKey || !this.config.apiSecret || !this.config.cloudName) {
      return false;
    }

    try {
      const timestamp = Math.round(Date.now() / 1000);
      const signature = this.generateCloudinarySignature(publicId, timestamp, 'destroy');

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', this.config.apiKey);
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/destroy`,
        {
          method: 'POST',
          body: formData
        }
      );

      const result = await response.json();
      return result.result === 'ok';
    } catch (error) {
      console.warn('Could not delete from Cloudinary:', error);
      return false;
    }
  }

  private generateCloudinarySignature(
    publicId: string, 
    timestamp: number, 
    action: string = 'upload'
  ): string {
    const paramsString = action === 'destroy' 
      ? `public_id=${publicId}&timestamp=${timestamp}${this.config.apiSecret}`
      : `public_id=${publicId}&timestamp=${timestamp}${this.config.apiSecret}`;
    
    return createHash('sha1').update(paramsString).digest('hex');
  }

  /**
   * S3 storage for production (placeholder - requires AWS SDK)
   */
  private async uploadToS3(
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<UploadResult> {
    // This would require AWS SDK implementation
    throw new Error('S3 storage not yet implemented. Please use Cloudinary for production.');
  }

  private async deleteFromS3(publicId: string): Promise<boolean> {
    // This would require AWS SDK implementation
    return false;
  }
}

// Create configured instance - always use local storage for cost-free operation
export const cloudStorage = new CloudStorageService({
  provider: 'local', // Always use local storage to avoid external costs
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME
});