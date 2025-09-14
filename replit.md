# AI Marketing Landing Page with WordPress CMS

## Overview
This project delivers a sophisticated AI marketing landing page integrated with WordPress as its Content Management System. It enables businesses to showcase AI marketing services while leveraging WordPress for dynamic blog content and robust content management. The application is designed as a database-first production system, featuring real-time content updates, comprehensive SEO through server-side rendering, and a clean architecture for high performance and maintainability.

The vision is to provide a comprehensive, high-performance platform for AI marketing agencies to establish a strong online presence, manage content efficiently, and generate leads effectively, positioning them competitively in the rapidly evolving AI services market.

## Recent Changes
- **September 3, 2025**: Fixed Google Search Console indexing issues by implementing direct route handlers for all static pages (services, team, legal), eliminating redirect chains that prevented proper indexing. Added canonical URL support and proper meta tags for all pages to ensure Google can crawl and index the site effectively.

## User Preferences
- Use authentic data from database rather than placeholder content
- Maintain professional tone in communications
- Focus on actionable results and system functionality
- Document architectural changes for future reference

## System Architecture
The project is built with a modern full-stack architecture using React with TypeScript for the frontend, Express.js for the backend, and PostgreSQL for persistent data storage, all deployed via Node.js.

### Frontend
- **UI/UX**: Responsive design with a mobile-first approach, leveraging Tailwind CSS for styling and Framer Motion for animations. Features include a hero section, services showcase, AI solutions, workflow automation timelines, case studies, and contact forms.
- **Blog System**: Public blog with individual post pages, integrated with the WordPress REST API for content. Designed for SEO optimization and social sharing.
- **Interactive Content**: Integration of interactive elements like automation checklists, embedded via a blog shortcode system, which also track engagement and generate leads.

### Backend and Data Management
- **Content Management System (CMS)**: Utilizes WordPress as the primary CMS, providing an admin interface for full content creation, editing, and publishing workflows (draft, review, publish, scheduling). It supports Gutenberg editor, Yoast SEO, media management, and custom fields for lead magnets.
- **Database**: PostgreSQL serves as the persistent content storage, supporting full CRUD operations.
- **Server-Side Rendering (SSR)**: Blog posts are server-side rendered to generate complete HTML with meta tags, Open Graph, and JSON-LD structured data for enhanced SEO and social media sharing. This ensures optimal search engine crawling and indexing.
- **Image Management**: Images are stored in Replit Object Storage (cloud-based) ensuring persistent storage across deployments and eliminating the need for manual file management. The system provides robust upload verification, automatic file serving via `/objects/*` routes, and proper ACL management.
- **Analytics**: Database-tracked engagement metrics (views, leads, shares) are integrated.
- **Performance**: Optimized data fetching via TanStack Query caching and robust cache invalidation mechanisms ensure real-time content updates.

### Core Design Principles
- **Database-First Approach**: All content is loaded directly from the database, enabling real-time updates and dynamic content generation (e.g., sitemaps).
- **Clean Architecture**: Emphasis on clear separation of concerns, particularly between client-side and server-side modules, to ensure stability and maintainability.
- **SEO Optimization**: Comprehensive server-side rendering, dynamic sitemap generation, rich metadata injection (Open Graph, JSON-LD), and proper URL handling are prioritized.
- **Deployment Robustness**: The system is configured for full-stack Node.js deployment, designed to preserve data across deployments and handle build-time complexities gracefully.

## External Dependencies
- **WordPress**: Used as the Content Management System (CMS) for managing blog posts, pages, and media. Integration is via the WordPress REST API.
- **PostgreSQL**: The primary relational database for persistent storage of application content and analytics data.
- **Express.js**: Backend web application framework for Node.js, handling API endpoints, server-side rendering, and static file serving.
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Superset of JavaScript that adds static types.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Framer Motion**: Library for production-ready motion and animation in React.
- **TanStack Query (React Query)**: Data fetching library for React, used for efficient server state management.
- **Multer**: Node.js middleware for handling `multipart/form-data`, primarily used for file uploads.
- **ReactMarkdown**: Component for rendering Markdown as React components.