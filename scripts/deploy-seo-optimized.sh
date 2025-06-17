#!/bin/bash

# SEO-Optimized Deployment Script
# This script automates the complete build process for perfect SEO

echo "🚀 Starting SEO-optimized deployment build..."

# Step 1: Build the React application
echo "📦 Building React application..."
npm run build:client

if [ $? -ne 0 ]; then
    echo "❌ React build failed"
    exit 1
fi

# Step 2: Generate static blog pages with metadata
echo "📝 Generating static blog pages..."
tsx scripts/generate-blog-pages.ts

if [ $? -ne 0 ]; then
    echo "❌ Blog page generation failed"
    exit 1
fi

# Step 3: Export blog content for fallback
echo "💾 Exporting blog content..."
tsx scripts/build-seo-optimized.ts

if [ $? -ne 0 ]; then
    echo "❌ Content export failed"
    exit 1
fi

# Step 4: Generate sitemap
echo "🗺️ Generating sitemap..."
tsx scripts/generate-sitemap.ts

if [ $? -ne 0 ]; then
    echo "❌ Sitemap generation failed"
    exit 1
fi

echo "✨ SEO-optimized build complete!"
echo ""
echo "📊 Build Summary:"
echo "  ✅ Static HTML pages for all blog posts"
echo "  ✅ Complete SEO metadata (Open Graph, Twitter Cards, JSON-LD)"
echo "  ✅ JSON fallbacks for client-side functionality"
echo "  ✅ Updated sitemap with all URLs"
echo "  ✅ Optimized for search engine crawling"
echo ""
echo "🔍 Next Steps:"
echo "  1. Deploy the client/dist directory"
echo "  2. Test blog post URLs for proper metadata"
echo "  3. Verify social media sharing previews"
echo "  4. Monitor Google Search Console for crawling"