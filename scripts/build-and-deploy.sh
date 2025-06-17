#!/bin/bash

echo "Starting deployment build..."

# Build the frontend
echo "Building frontend..."
npm run build

# Generate blog pages  
echo "Generating blog pages..."
tsx scripts/generate-sitemap.ts

echo "Deployment build complete!"