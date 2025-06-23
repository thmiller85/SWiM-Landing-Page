# Production Image Storage Setup Guide

## Overview
This guide explains how to set up image storage for production deployments. The system automatically switches between local storage (development) and cloud storage (production) based on the environment.

## The Problem
Serverless platforms like Vercel have **ephemeral file systems** where uploaded files are lost between function invocations. This is why image uploads work in development but fail in production.

## Solution: Cloud Storage Integration

### Development Environment
- **Local File Storage**: Files stored in `/persistent-uploads/` directory
- **Direct File Serving**: Express static middleware serves files at `/persistent-uploads/` URLs
- **No Additional Setup**: Works out of the box for development

### Production Environment
- **Cloud Storage**: Files uploaded to Cloudinary or AWS S3
- **Persistent URLs**: Images remain accessible across deployments
- **Automatic Failover**: Falls back to local storage if cloud credentials missing

## Cloudinary Setup (Recommended)

### Step 1: Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Note your **Cloud Name**, **API Key**, and **API Secret** from the dashboard

### Step 2: Configure Environment Variables
Add these environment variables to your production deployment:

```bash
# Required for production cloud storage
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Optional: specify storage provider (defaults to cloudinary in production)
CLOUD_STORAGE_PROVIDER=cloudinary
```

### Step 3: Deploy with Cloud Storage
Once environment variables are set, image uploads will automatically:
1. Upload to Cloudinary in production
2. Store URLs in your database
3. Serve images directly from Cloudinary CDN
4. Handle deletions from both database and Cloudinary

## Vercel Deployment

### Environment Variables Setup
In your Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add the following:
   - `CLOUDINARY_CLOUD_NAME` = your_cloud_name
   - `CLOUDINARY_API_KEY` = your_api_key  
   - `CLOUDINARY_API_SECRET` = your_api_secret
   - `DATABASE_URL` = your_postgresql_url

### Automatic Deployment
The system automatically detects production environment and switches to cloud storage.

## Replit Deployment

### Reserved VM Setup
1. Enable Reserved VM for your Replit project
2. Add environment variables in Secrets tab:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Deploy using the "Deploy" button

## Testing the Setup

### Development Testing
```bash
# Should show local storage mode
npm run dev
# Check console logs for: "Local development storage initialized"
```

### Production Testing
```bash
# Should show cloud storage mode
NODE_ENV=production npm start
# Check console logs for: "Production cloud storage mode enabled"
```

## Debugging Production Issues

### Check Environment Variables
Ensure all required Cloudinary credentials are set in production:
```javascript
// Debug endpoint at /api/health shows environment status
{
  "status": "ok",
  "environment": "production",
  "cloudinary_configured": true
}
```

### Monitor Upload Logs
Upload attempts show detailed debugging:
```
=== CLOUD UPLOAD DEBUG ===
File: my-image.png
File size: 1234567 bytes
Environment: production
Generated filename: image-1234567890-123456789.png
✓ Upload successful to: https://res.cloudinary.com/...
```

### Common Issues
1. **Missing Credentials**: Check environment variables are properly set
2. **Network Issues**: Cloudinary API calls may timeout - check connectivity  
3. **File Size Limits**: Default 5MB limit, adjust in multer config if needed
4. **CORS Issues**: Cloudinary handles CORS automatically for image serving

## Benefits of This Approach

### Development
- **Fast Local Development**: No external API calls required
- **Offline Support**: Works without internet connection
- **Debug Friendly**: Files visible in local filesystem

### Production  
- **Persistent Storage**: Images survive deployments and server restarts
- **CDN Performance**: Cloudinary provides global CDN for fast image delivery
- **Automatic Optimization**: Cloudinary can auto-optimize images for web
- **Backup & Recovery**: Cloudinary handles redundancy and backups
- **Scalability**: No local storage limitations

## Migration from Local Storage

If you have existing images in local storage that need to migrate to production:

1. **Export Current Images**: Use the consistency check endpoint to list all images
2. **Manual Upload**: Re-upload critical images through the CMS interface
3. **Bulk Migration**: Use the cloud storage service programmatically to migrate files

The system is designed to handle mixed environments gracefully during migration.