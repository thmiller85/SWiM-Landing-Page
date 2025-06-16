
# SWiM AI Website Sitemap

## Public Pages (Marketing & Content)

### Main Landing Page
- **/** - Homepage with Hero, Services, AI Solutions, Workflow, Case Studies, About, Contact sections

### Team Pages
- **/team** - Team overview page
- **/team/ross-stockdale** - Ross Stockdale profile
- **/team/tom-miller** - Tom Miller profile  
- **/team/steve-wurster** - Steve Wurster profile
- **/team/david-stockdale** - David Stockdale profile

### Service Pages
- **/services/ai-powered-marketing** - AI-Powered Marketing service
- **/services/workflow-automation** - Workflow Automation service
- **/services/b2b-saas-development** - B2B SaaS Development service
- **/services/data-intelligence** - Data Intelligence service
- **/services/ai-strategy-consulting** - AI Strategy Consulting service
- **/services/ai-security-ethics** - AI Security & Ethics service

### Blog System
- **/blog** - Blog listing page
- **/blog/:slug** - Individual blog post pages (dynamic)

### Legal Pages
- **/privacy-policy** - Privacy Policy
- **/terms-of-service** - Terms of Service

## Admin Pages (CMS)

### Authentication
- **/admin/login** - Admin login page

### Content Management (Protected)
- **/admin/dashboard** - Admin dashboard with analytics
- **/admin/blog-posts/new** - Create new blog post
- **/admin/blog-posts/edit/:id** - Edit existing blog post
- **/admin/blog-posts/preview/:id** - Preview blog post

## API Endpoints

### Public APIs
- **/api/health** - Health check endpoint
- **/api/blog-posts** - Get all blog posts (with filters)
- **/api/blog-posts/slug/:slug** - Get blog post by slug
- **/api/blog-posts/:id** - Get blog post by ID
- **/api/blog-posts/popular/list** - Get popular posts
- **/api/blog-posts/recent/list** - Get recent posts
- **/api/blog-posts/:id/lead** - Increment lead count
- **/api/blog-posts/:id/share** - Increment share count
- **/api/contact-form** - Contact form submission

### Admin APIs (Protected)
- **/api/admin/login** - Admin authentication
- **/api/admin/blog-posts** - Admin blog post management
- **/api/blog-posts** (POST) - Create blog post
- **/api/blog-posts/:id** (PATCH) - Update blog post
- **/api/blog-posts/:id** (DELETE) - Delete blog post

## Static Assets

### SEO & Meta
- **/sitemap.xml** - XML sitemap for search engines
- **/robots.txt** - Search engine crawling instructions

### Error Pages
- **404** - Not found page (handled by NotFound component)

## Pre-rendered Routes (SEO Optimized)

The following routes are pre-rendered for better SEO performance:
- Homepage (/)
- All team pages
- All service pages

## Navigation Flow

1. **Homepage** → Services/About/Contact sections (smooth scroll)
2. **Services** → Individual service pages
3. **Team** → Individual team member pages
4. **Blog** → Individual blog posts
5. **Admin** → Login → Dashboard → Blog management

## Route Protection

- **Public Routes**: All marketing pages, blog, legal pages
- **Protected Routes**: All `/admin/*` routes (except login) require authentication
- **API Protection**: Admin APIs require Bearer token authentication

## Dynamic Content

- Blog posts are dynamically generated based on database content
- Team member pages use predefined data
- Service pages use predefined content
- Admin dashboard shows real-time analytics

This sitemap reflects the current state of your React application using Wouter for routing, with a full-featured CMS and blog system.
