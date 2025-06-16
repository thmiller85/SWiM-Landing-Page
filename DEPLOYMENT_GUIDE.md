# SWiM AI Deployment Guide

## Current Production Setup

### Architecture: Vite + Express (Server Deployment)
The application uses a hybrid architecture:
- **Frontend**: Vite-built React application with static site generation
- **Backend**: Express server with PostgreSQL database
- **Deployment**: CloudRun server deployment (not static site)

### Working Endpoints
- **Public Site**: `/` (landing page, blog, contact)
- **Admin Dashboard**: `/admin/login` → `/admin/dashboard`
- **API Endpoints**: `/api/health`, `/api/admin/blog-posts`, `/api/admin/login`
- **Admin Credentials**: `admin` / `swimai2024`

## Deployment Configuration

### Current replit.toml (Working)
```toml
run = ["npm", "run", "start"]
build = ["npm", "run", "build"]

[deployment]
deploymentTarget = "cloudrun"
```

### Key Technical Decisions
1. **Server Deployment**: Required for admin API endpoints
2. **Database**: PostgreSQL with persistent storage
3. **Authentication**: Simple admin login system
4. **SEO**: Static site generation for marketing pages

## Next.js Migration Option

### Status: Partial Foundation Complete
- Next.js App Router structure created
- Critical API routes migrated
- Complete rollback capability maintained

### Benefits of Next.js Migration
- Simplified deployment (automatic SSR/SSG handling)
- Built-in API routes (no configuration complexity)
- Industry standard full-stack architecture
- Better performance optimizations

### Migration Decision
- **Current State**: Vite + Express is fully functional
- **Next.js Foundation**: Available for future migration
- **Recommendation**: Current setup meets all requirements

## Admin Dashboard Access

### Production URL Structure
- Landing Page: `https://[deployment-url].replit.app/`
- Admin Login: `https://[deployment-url].replit.app/admin/login`
- Admin Dashboard: `https://[deployment-url].replit.app/admin/dashboard`

### Authentication Flow
1. Navigate to `/admin/login`
2. Enter credentials: `admin` / `swimai2024`
3. Access admin dashboard with full blog management
4. Create, edit, publish blog posts with analytics tracking

## Database Operations

### Blog Management
- Full CRUD operations through admin interface
- Real-time analytics tracking (views, leads, shares)
- SEO optimization tools (meta titles, descriptions)
- Google Drive image integration

### Backup & Migrations
- Database schema managed through Drizzle ORM
- Use `npm run db:push` for schema changes
- PostgreSQL handles data persistence across deployments

## Troubleshooting

### Common Issues
1. **Admin Dashboard 404**: Ensure server deployment (not static)
2. **API Endpoints Failing**: Check CloudRun deployment target
3. **Database Connection**: Verify DATABASE_URL environment variable
4. **Admin Login Issues**: Confirm credentials and session handling

### Health Checks
- API Health: `GET /api/health`
- Database: Admin dashboard should load blog posts
- Authentication: Admin login should redirect to dashboard

## Performance Optimization

### Current Optimizations
- Static site generation for marketing pages
- Database query optimization with Drizzle
- Image optimization through Google Drive integration
- Responsive design with mobile-first approach

### SEO Features
- Automatic sitemap generation
- Meta tag optimization
- Structured data for blog posts
- Social sharing integration

## Security Considerations

### Current Implementation
- Admin authentication with session management
- Protected API routes with authorization checks
- Environment variable protection for sensitive data
- CORS configuration for cross-origin requests

### Production Security
- Admin credentials should be changed from default
- Database access restricted to application
- HTTPS enforced through Replit deployment
- Session security with proper cookie settings