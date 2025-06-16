
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

## Content Management

### WordPress CMS
- **External WordPress Site** - Full content management via WordPress admin dashboard
- **WordPress REST API** - Blog posts fetched directly from WordPress
- **SEO Integration** - Yoast SEO plugin handles meta tags and optimization

## API Endpoints

### Public APIs
- **/api/health** - Health check endpoint
- **/api/contact-form** - Contact form submission

### WordPress Integration
- **External WordPress REST API** - All blog content managed through WordPress
- **Automatic Content Sync** - Frontend fetches posts directly from WordPress REST API
- **No Custom CMS** - Eliminated internal blog management system

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
