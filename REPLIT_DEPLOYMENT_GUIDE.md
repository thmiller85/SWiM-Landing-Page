# Replit Deployment Guide

## Quick Deployment Steps

Your project is now configured for seamless static deployment from Replit. Here's how to deploy:

### 1. Export Your Content (if you've made changes)
```bash
tsx scripts/export-content.ts
```

### 2. Deploy from Replit
1. Click the "Deploy" button in Replit
2. Choose "Static" deployment type
3. The build will automatically:
   - Export your database content to JSON files
   - Build the static site
   - Deploy to Replit's static hosting

### 3. Your Site is Live!
Your site will be available at your Replit deployment URL with:
- Full blog functionality
- All your CMS-created content
- Professional design and SEO optimization
- No database required in production

## How It Works

### Development Workflow
- Use the CMS at `/cms` to create and edit blog posts
- All content is stored in your PostgreSQL database
- The site runs in full-stack mode during development

### Deployment Workflow
- The build script automatically exports database content to JSON files
- Frontend switches to static mode, reading from exported JSON
- Deployment includes only static files - no server required

### Files Created for Static Deployment
- `client/public/data/posts.json` - All blog posts
- `client/public/data/metadata.json` - Blog metadata
- `client/public/data/[slug].json` - Individual post files

## Content Management

### Adding New Posts
1. Start your development server: `npm run dev`
2. Visit `/cms` to access the content management interface
3. Create new posts with featured images, markdown content, and metadata
4. When ready to deploy, the build process exports everything automatically

### Updating Existing Content
1. Edit posts in the CMS
2. Export content: `tsx scripts/export-content.ts`
3. Redeploy from Replit

## Technical Details

### Static Blog Service
The frontend automatically detects whether to use:
- Database API (development mode)
- Static JSON files (production/deployed mode)

### SEO & Performance
- All metadata preserved in static export
- Optimized images and assets
- Fast loading with static file serving
- Search engine friendly URLs

### Deployment Configuration
- `vercel.json` configured for static hosting
- Build script handles content export automatically
- Compatible with Vercel, Netlify, and other static hosts

## Troubleshooting

### If Export Fails
The build script includes fallback content to ensure deployment succeeds even if database export fails.

### If Blog Posts Don't Appear
1. Check that `client/public/data/posts.json` exists
2. Verify the JSON structure matches the expected format
3. Ensure the static blog service is being used in production

### Performance Issues
- Static deployment is optimized for speed
- All blog content is pre-exported and cached
- No database queries in production