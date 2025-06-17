# Production Deployment Guide

## Overview
This application supports **two deployment modes**:

### 1. Static Deployment (Recommended for simplicity)
- Uses exported JSON files for blog content
- Works with any static hosting (Vercel, Netlify, GitHub Pages)
- No database required in production
- CMS still available for development content management

### 2. Full-Stack Deployment (Advanced)
- Real-time database integration
- Requires PostgreSQL database
- Server-side hosting required
- Dynamic content updates

## Option 1: Static Deployment (Simple)

### Quick Setup
1. Export content: `tsx scripts/export-content.ts`
2. Build static site: `vite build`
3. Replace `vercel.json` with `vercel-static.json`
4. Deploy to any static hosting

### Benefits
- Simple deployment to Vercel, Netlify, GitHub Pages
- No database configuration required
- Fast loading and high availability
- Preserves your original static site preference

### Content Management Workflow
1. Run development server locally with database
2. Use CMS at `http://localhost:5000/cms` to create/edit content
3. Export content: `tsx scripts/export-content.ts`
4. Deploy updated static files

### Vercel Static Deployment
```bash
# Replace deployment config
cp vercel-static.json vercel.json

# Export content from your local database
tsx scripts/export-content.ts

# Build and deploy
vite build
# Deploy client/dist folder
```

---

## Option 2: Full-Stack Deployment (Advanced)

### Requirements
- PostgreSQL database instance
- Server-side hosting platform
- Environment variables configuration

### Environment Variables
```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
PGDATABASE=your_database_name
PGHOST=your_database_host
PGPASSWORD=your_database_password
PGPORT=5432
PGUSER=your_database_user
NODE_ENV=production
```

### Database Providers
- **Vercel Postgres**: Automatic integration with Vercel projects
- **Supabase**: Full-featured PostgreSQL with dashboard
- **Neon**: Serverless PostgreSQL for modern apps
- **Railway**: Simple PostgreSQL deployment

### Full-Stack Vercel Deployment
```bash
# Use full-stack config (already configured)
# vercel.json is set up for this mode

# Ensure database is provisioned
# Set environment variables in Vercel dashboard
# Deploy normally - Vercel will handle the rest
```

---

## Recommended Approach

**For your use case, I recommend Option 1 (Static Deployment):**

1. Maintains your original static hosting preference
2. Eliminates deployment complexity
3. Keeps CMS functionality for content management
4. Zero database costs in production
5. Maximum performance and reliability

### Content Update Workflow
```bash
# 1. Create content locally using CMS
npm run dev
# Visit http://localhost:5000/cms

# 2. Export content to static files
tsx scripts/export-content.ts

# 3. Build and deploy
cp vercel-static.json vercel.json
vite build
# Deploy client/dist
```

This preserves your original static site vision while providing the content management capabilities you need.