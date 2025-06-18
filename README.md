# AI Marketing Landing Page with CMS

A sophisticated AI marketing landing page with integrated content management system, built with React, TypeScript, and PostgreSQL.

## Features

### 🎯 Marketing Landing Page
- Responsive design with mobile-first approach
- Animated particle background with interactive elements
- Service showcase with hover effects
- AI solutions grid with categorized offerings
- Workflow automation timeline
- Case studies with metrics and testimonials
- Contact forms with privacy compliance

### 📝 Content Management System
- Database-driven blog system with PostgreSQL
- Full CRUD operations for posts, images, and users
- Server-side rendering for SEO optimization
- Analytics tracking (views, leads, shares)
- Rich text editor with markdown support
- Image upload and management
- Author management system

### 🔧 Technical Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + Framer Motion
- **Data Fetching**: TanStack Query
- **Routing**: Wouter (client-side) + Express (server-side)

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database connection:
```
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
NODE_ENV=development
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and API clients
│   │   └── types/        # TypeScript type definitions
├── server/               # Express backend
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database operations
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
└── scripts/              # Build and deployment scripts
```

## API Endpoints

### Blog Management
- `GET /api/blog/posts/database/all` - Get all published posts
- `GET /api/blog/posts/database/slug/:slug` - Get post by slug
- `POST /api/blog/posts` - Create new post (authenticated)
- `PUT /api/blog/posts/:id` - Update post (authenticated)
- `DELETE /api/blog/posts/:id` - Delete post (authenticated)

### Content Management
- `GET /cms/login` - CMS login page
- `GET /cms/dashboard` - Content management dashboard
- `POST /api/images` - Upload images
- `GET /api/analytics` - View analytics data

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Manual Deployment
1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Environment Variables

Required environment variables:

```
DATABASE_URL=postgresql://...
NODE_ENV=production
```

Optional variables:
```
PORT=5000
```

## Recent Updates

### Latest Fixes (June 2025)
- ✅ Resolved drizzle-orm module resolution error
- ✅ Fixed client-server dependency separation
- ✅ Implemented consistent visual styling
- ✅ Optimized direct blog post URL navigation
- ✅ Enhanced SEO with server-side rendering

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions, please contact the development team.