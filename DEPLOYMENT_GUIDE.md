# SWiM AI Deployment Guide

## Overview
This application requires a **server deployment** (not static) to support the admin dashboard API endpoints. The admin CMS needs server-side routes for blog management, authentication, and database operations.

## Deployment Configuration

### Current Setup
- **Deployment Type**: Server deployment using CloudRun
- **Build Command**: `npm run build` (includes client build + server compilation)
- **Start Command**: `npm run start` (runs production server)
- **Port**: 5000 (configured for 0.0.0.0 binding)

### Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (automatically provided by Replit)
- `NODE_ENV`: Set to "production" in deployment

## Key Files
- `replit.toml`: Deployment configuration
- `server/index.ts`: Main server entry point
- `dist/`: Build output directory containing both client assets and server bundle

## API Endpoints
The following endpoints are essential for admin functionality:
- `GET /api/admin/blog-posts` - Fetch all blog posts for admin dashboard
- `POST /api/admin/login` - Admin authentication
- `POST /api/blog-posts` - Create new blog posts
- `PATCH /api/blog-posts/:id` - Update blog posts
- `DELETE /api/blog-posts/:id` - Delete blog posts

## Static vs Server Deployment

### Static Deployment (NOT SUPPORTED for Admin)
- ❌ No API endpoints available
- ❌ Admin dashboard will show "No posts found"
- ❌ Contact forms won't work
- ✅ Marketing pages load quickly
- ✅ Good for SEO

### Server Deployment (REQUIRED for Full Functionality)
- ✅ All API endpoints available
- ✅ Admin dashboard fully functional
- ✅ Contact forms work via webhook proxy
- ✅ Database operations supported
- ✅ Marketing pages still work with SEO optimization

## Build Process
1. **Client Build**: Vite builds React app to `dist/public/`
2. **Server Build**: esbuild compiles server to `dist/index.js`
3. **Static Generation**: Pre-renders marketing pages for SEO
4. **File Organization**: Static assets copied to `dist/` for server serving

## Troubleshooting

### Admin Dashboard Shows "No Posts Found"
**Cause**: Deployment configured as static site instead of server
**Solution**: Ensure `replit.toml` has `deploymentTarget = "cloudrun"` and `run = ["npm", "run", "start"]`

### API Endpoints Return 404
**Cause**: Server not running in deployment
**Solution**: Verify deployment is using server mode, not static hosting

### Database Connection Issues
**Cause**: Missing DATABASE_URL or network connectivity
**Solution**: Check environment variables and database status

## Verification Steps
1. Deploy with server configuration
2. Access `/api/health` endpoint - should return status
3. Login to admin at `/admin/login` (password: swimai2024)
4. Verify blog posts load in admin dashboard
5. Test creating/editing blog posts

## Performance Considerations
- Static pages are pre-rendered for SEO
- Dynamic admin functionality requires server
- Database queries are optimized with proper indexing
- Client-side routing handles navigation efficiently