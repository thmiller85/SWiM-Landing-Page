# Production Deployment Guide

## Overview
This application is a full-stack Node.js/Express application with PostgreSQL database integration. It requires server-side deployment (not static hosting) to function properly.

## Deployment Requirements

### Database Setup
1. **PostgreSQL Database**: You need a PostgreSQL database instance
2. **Environment Variables**: The following environment variables must be set in your deployment platform:
   - `DATABASE_URL` - PostgreSQL connection string
   - `PGDATABASE` - Database name
   - `PGHOST` - Database host
   - `PGPASSWORD` - Database password
   - `PGPORT` - Database port (usually 5432)
   - `PGUSER` - Database username
   - `NODE_ENV=production`

### Vercel Deployment
The `vercel.json` file is configured for full-stack deployment:
- Server-side rendering with Express.js
- API routes handling (`/api/*`)
- Static file serving (`/images/*`)
- CMS routes (`/cms*`)

### Database Migration
Before first deployment, run:
```bash
npm run db:push
```

### Build Process
The application uses a unified build process that:
1. Builds the frontend with Vite
2. Bundles the server with esbuild
3. Prerenders static content
4. Generates sitemap

## Required Environment Variables in Production

Set these in your deployment platform (Vercel, Netlify, Railway, etc.):

```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
PGDATABASE=your_database_name
PGHOST=your_database_host
PGPASSWORD=your_database_password
PGPORT=5432
PGUSER=your_database_user
NODE_ENV=production
```

## Database Provider Options

### Option 1: Vercel Postgres (Recommended for Vercel deployment)
1. Go to Vercel dashboard
2. Add PostgreSQL database to your project
3. Environment variables are automatically configured

### Option 2: Supabase
1. Create a Supabase project
2. Get connection details from Settings > Database
3. Use connection string for `DATABASE_URL`

### Option 3: Neon
1. Create a Neon project
2. Copy connection string
3. Set as `DATABASE_URL`

### Option 4: Railway
1. Add PostgreSQL service to Railway project
2. Copy environment variables to your deployment

## Troubleshooting

### 404 Errors on API Routes
- Ensure your deployment platform supports server-side rendering
- Verify environment variables are set
- Check that `vercel.json` routing is correctly configured

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure SSL is properly configured for production databases
- Run `npm run db:push` to sync schema

### Missing Static Files
- Ensure build process completes successfully
- Check that uploaded images are served from `/images/*` route

## Post-Deployment Steps

1. **Database Schema**: Run `npm run db:push` to create tables
2. **Admin User**: Create admin user through CMS interface
3. **Content**: Add blog posts through CMS dashboard
4. **Images**: Upload images through CMS for featured images

## CMS Access

After deployment:
- CMS Dashboard: `https://yourdomain.com/cms`
- Default login: admin/admin (change immediately)
- Blog management: Create, edit, and publish posts
- Image management: Upload and manage featured images