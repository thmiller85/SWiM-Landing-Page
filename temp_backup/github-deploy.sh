#!/bin/bash

# GitHub Deployment Script for AI Marketing Landing Page
# Run this script locally after downloading your Replit project

echo "🚀 Setting up GitHub repository for AI Marketing Landing Page..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Configure git (replace with your actual details)
echo "🔧 Configuring Git..."
read -p "Enter your GitHub username: " github_username
read -p "Enter your email: " github_email
read -p "Enter your GitHub repository URL: " repo_url

git config user.name "$github_username"
git config user.email "$github_email"

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Database
*.sqlite
*.db

# Temporary files
tmp/
temp/
EOL
fi

# Add all files
echo "📁 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: AI Marketing Landing Page with CMS

Features:
- React + TypeScript frontend with Tailwind CSS
- Express.js backend with PostgreSQL integration
- Complete CMS system with blog management
- Server-side rendering for SEO optimization
- Mobile-responsive design with animations
- Analytics tracking and lead generation

Recent fixes:
- Resolved drizzle-orm module resolution errors
- Fixed client-server dependency conflicts
- Implemented consistent visual styling
- Optimized direct blog post URL navigation"

# Add remote origin
echo "🌐 Adding GitHub remote..."
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Successfully deployed to GitHub!"
echo "🌍 Your repository is now available at: $repo_url"
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database for production"
echo "2. Configure environment variables in your hosting platform"
echo "3. Deploy to Vercel, Netlify, or your preferred platform"