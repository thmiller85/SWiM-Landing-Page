# Replit Full-Stack Deployment Guide

## Deployment Type Required: Reserved VM or Autoscale

**Important**: This application now requires a **Reserved VM** or **Autoscale** deployment, not static deployment.

### Why Full-Stack Deployment?
- Server-side rendering for blog posts (perfect SEO)
- PostgreSQL database for content management
- Dynamic content generation
- API endpoints for CMS functionality

## Deployment Steps

### 1. Change Deployment Type in Replit
1. Go to your Repl settings
2. Navigate to the "Deployment" tab
3. Switch from "Static" to either:
   - **Reserved VM** (recommended for consistent performance)
   - **Autoscale** (for variable traffic)

### 2. Environment Variables
Ensure these are set in your Repl secrets:
- `DATABASE_URL` (automatically provided by Replit PostgreSQL)
- `NODE_ENV=production` (set automatically in deployment)

### 3. Deploy
1. Click the "Deploy" button in Replit
2. Your app will be built and deployed with full-stack capabilities

## How the Hybrid Architecture Works

### Static Content (Fast & Efficient)
- **Landing page** (`/`)
- **About page** (`/about`)
- **Services** (`/services`)
- **Contact** (`/contact`)

These are served as a React SPA with excellent performance.

### Server-Side Rendered Content (Perfect SEO)
- **Blog listings** (`/blog`)
- **Individual blog posts** (`/blog/[slug]`)
- **CMS interface** (`/cms`)

These are rendered server-side with complete HTML, meta tags, and structured data.

## Performance Benefits
- **Best of Both Worlds**: Static speed for marketing pages, SSR SEO for blog
- **Perfect SEO**: Blog posts have complete meta tags when shared or crawled
- **Fast Loading**: Static assets cached, dynamic content optimized
- **Search Engine Friendly**: All content accessible to crawlers immediately

## Database Management
- PostgreSQL database automatically managed by Replit
- Content persists between deployments
- No manual database setup required

## Monitoring
- Check deployment logs in Replit dashboard
- Monitor database performance through Replit tools
- View application metrics in deployment settings

## Cost Considerations
- Reserved VM: Fixed monthly cost, consistent performance
- Autoscale: Pay per usage, scales automatically
- Choose based on your traffic patterns and budget

## Troubleshooting
- If deployment fails, check environment variables
- Ensure PostgreSQL database is properly connected
- Review logs for any missing dependencies or configuration issues