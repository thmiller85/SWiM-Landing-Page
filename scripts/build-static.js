#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building static site with exported content...');

try {
  // Create a minimal data structure for when database isn't available
  const dataDir = path.join(__dirname, '../client/public/data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Create fallback data if export script fails (e.g., no database in build environment)
  const fallbackPost = {
    title: "The Complete Guide to Workflow Automation for B2B Companies",
    metaTitle: "The Complete Guide to Workflow Automation for B2B Companies | SWiM AI",
    metaDescription: "Transform your B2B operations with workflow automation. Learn implementation strategies, best practices, and proven results. Expert guidance from SWiM AI.",
    slug: "the-complete-guide-to-workflow-automation-for-b2b-companies",
    publishedAt: "2025-06-17T16:50:05.300Z",
    updatedAt: "2025-06-17T17:03:35.223Z",
    author: "Tom Miller",
    status: "published",
    ctaType: "consultation",
    targetKeywords: ["workflow automation"],
    excerpt: "**In today's fast-moving B2B landscape, workflow automation is no longer optional—it's essential.** This guide breaks down what automation really means in 2025, why AI-first solutions are driving measurable results, and how your business can achieve scalable growth through smarter systems.",
    featuredImage: "",
    category: "AI, Automation, Strategy",
    tags: ["AI", "Automation", "B2B Strategy"],
    readingTime: 11,
    content: `# The Complete Guide to Workflow Automation for B2B Companies

In 2025, B2B companies are under relentless pressure to do more with less. Manual processes, fragmented systems, and slow approvals are no longer sustainable in an era where digital transformation is the norm, not the exception. Yet, many organizations still struggle to define what workflow automation really means for their business, or how to leverage it for maximum ROI.

If you're looking for a practical, AI-driven roadmap to streamlined operations, this guide is for you.

## What is Workflow Automation in 2025?

Workflow automation isn't just about eliminating paperwork—it's about transforming how your business operates at every level. Modern workflow automation combines artificial intelligence, machine learning, and intelligent process optimization to create systems that don't just follow rules—they adapt, learn, and improve over time.

The key differentiator in 2025? AI-first solutions that can handle complex decision-making, not just simple task routing.

## The Business Case for Workflow Automation

Companies implementing comprehensive workflow automation are seeing:

- **40-60% reduction in processing time** for routine approvals
- **85% decrease in manual data entry errors**
- **3x faster onboarding** for new employees and clients
- **$2.4M average annual savings** for mid-market companies

These aren't just efficiency gains—they're competitive advantages that compound over time.

## Ready to Get Started?

Workflow automation success starts with understanding your current processes and identifying the highest-impact opportunities for improvement. Our team specializes in AI-driven workflow solutions that deliver measurable results from day one.`,
    publishedDate: new Date("2025-06-17T16:50:05.300Z"),
    updatedDate: new Date("2025-06-17T17:03:35.223Z")
  };

  const fallbackMetadata = {
    totalPosts: 1,
    categories: ["AI, Automation, Strategy"],
    tags: ["AI", "Automation", "B2B Strategy"],
    lastExported: new Date().toISOString()
  };

  // Try to export from database if available, otherwise use fallback
  try {
    console.log('Attempting to export content from database...');
    execSync('tsx scripts/export-content.ts', { stdio: 'inherit' });
    console.log('✅ Content exported from database');
  } catch (error) {
    console.log('⚠️  Database not available, using pre-exported content');
    
    // Write fallback data
    fs.writeFileSync(
      path.join(dataDir, 'posts.json'),
      JSON.stringify([fallbackPost], null, 2)
    );
    
    fs.writeFileSync(
      path.join(dataDir, `${fallbackPost.slug}.json`),
      JSON.stringify(fallbackPost, null, 2)
    );
    
    fs.writeFileSync(
      path.join(dataDir, 'metadata.json'),
      JSON.stringify(fallbackMetadata, null, 2)
    );
    
    console.log('✅ Fallback content prepared');
  }

  // Build the static site
  console.log('Building static site...');
  execSync('vite build', { stdio: 'inherit' });
  
  console.log('✅ Static build complete!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}