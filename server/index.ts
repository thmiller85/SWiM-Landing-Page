import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { getClientAssets } from "./html-utils";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register blog SSR route first to prevent Vite interception
  const { storage } = await import("./storage");
  
  // Add direct route handlers for main pages to prevent redirects
  // Handle static pages with proper canonical URLs and meta tags
  app.get('/', (req, res, next) => {
    // For homepage, ensure proper meta tags in production
    if (process.env.NODE_ENV === 'production') {
      const baseUrl = req.protocol + '://' + req.get('host');
      // Check if we have a static file to serve
      const distPath = path.resolve('dist/public/index.html');
      const fs = require('fs');
      if (fs.existsSync(distPath)) {
        let html = fs.readFileSync(distPath, 'utf-8');
        // Ensure canonical URL is present
        if (!html.includes('<link rel="canonical"')) {
          html = html.replace('</head>', `    <link rel="canonical" href="${baseUrl}/" />\n</head>`);
        }
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
      }
    }
    next();
  });
  
  app.get('/blog', (req, res, next) => {
    // For blog index, ensure proper meta tags in production
    if (process.env.NODE_ENV === 'production') {
      const baseUrl = req.protocol + '://' + req.get('host');
      const distPath = path.resolve('dist/public/index.html');
      const fs = require('fs');
      if (fs.existsSync(distPath)) {
        let html = fs.readFileSync(distPath, 'utf-8');
        // Update meta tags for blog page
        html = html.replace(/<title>.*?<\/title>/, '<title>Blog | SWiM AI - AI Marketing Insights</title>');
        html = html.replace(/<meta name="description" content=".*?"/, '<meta name="description" content="Discover AI marketing strategies, automation insights, and business transformation tips from SWiM AI experts."');
        // Ensure canonical URL is present
        if (!html.includes('<link rel="canonical"')) {
          html = html.replace('</head>', `    <link rel="canonical" href="${baseUrl}/blog" />\n</head>`);
        }
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
      }
    }
    next();
  });

  // Service pages handlers to prevent redirects
  const servicePages = [
    { path: '/services/ai-powered-marketing', title: 'AI-Powered Marketing Services | SWiM AI', description: 'Transform your marketing with AI-powered strategies, automation, and data-driven insights from SWiM AI experts.' },
    { path: '/services/workflow-automation', title: 'Workflow Automation Services | SWiM AI', description: 'Streamline your business operations with custom workflow automation solutions designed for maximum efficiency.' },
    { path: '/services/b2b-saas-development', title: 'B2B SaaS Development | SWiM AI', description: 'Expert B2B SaaS development services with AI integration, scalable architecture, and user-focused design.' },
    { path: '/services/data-intelligence', title: 'Data Intelligence Services | SWiM AI', description: 'Unlock actionable insights from your data with advanced analytics, AI-powered reporting, and intelligent dashboards.' },
    { path: '/services/ai-strategy-consulting', title: 'AI Strategy Consulting | SWiM AI', description: 'Strategic AI consulting to help your business adopt and implement artificial intelligence effectively.' },
    { path: '/services/ai-security-ethics', title: 'AI Security & Ethics | SWiM AI', description: 'Ensure responsible AI implementation with security best practices and ethical AI frameworks.' }
  ];

  servicePages.forEach(({ path: servicePath, title, description }) => {
    app.get(servicePath, (req, res, next) => {
      if (process.env.NODE_ENV === 'production') {
        const baseUrl = req.protocol + '://' + req.get('host');
        const distPath = path.resolve('dist/public/index.html');
        const fs = require('fs');
        if (fs.existsSync(distPath)) {
          let html = fs.readFileSync(distPath, 'utf-8');
          // Update meta tags for service page
          html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
          html = html.replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${description}"`);
          // Ensure canonical URL is present
          if (!html.includes('<link rel="canonical"')) {
            html = html.replace('</head>', `    <link rel="canonical" href="${baseUrl}${servicePath}" />\n</head>`);
          }
          res.setHeader('Content-Type', 'text/html');
          return res.send(html);
        }
      }
      next();
    });
  });

  // Team pages handlers
  const teamPages = [
    { path: '/team', title: 'Our Team | SWiM AI', description: 'Meet the SWiM AI team of experts in AI marketing, automation, and business transformation.' },
    { path: '/team/ross-stockdale', title: 'Ross Stockdale | SWiM AI Team', description: 'Ross Stockdale, AI marketing expert and co-founder of SWiM AI, specializing in business transformation.' },
    { path: '/team/tom-miller', title: 'Tom Miller | SWiM AI Team', description: 'Tom Miller, technical lead at SWiM AI, expert in AI development and workflow automation.' },
    { path: '/team/steve-wurster', title: 'Steve Wurster | SWiM AI Team', description: 'Steve Wurster, strategy consultant at SWiM AI, focused on AI implementation and business growth.' }
  ];

  teamPages.forEach(({ path: teamPath, title, description }) => {
    app.get(teamPath, (req, res, next) => {
      if (process.env.NODE_ENV === 'production') {
        const baseUrl = req.protocol + '://' + req.get('host');
        const distPath = path.resolve('dist/public/index.html');
        const fs = require('fs');
        if (fs.existsSync(distPath)) {
          let html = fs.readFileSync(distPath, 'utf-8');
          // Update meta tags for team page
          html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
          html = html.replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${description}"`);
          // Ensure canonical URL is present
          if (!html.includes('<link rel="canonical"')) {
            html = html.replace('</head>', `    <link rel="canonical" href="${baseUrl}${teamPath}" />\n</head>`);
          }
          res.setHeader('Content-Type', 'text/html');
          return res.send(html);
        }
      }
      next();
    });
  });

  // Legal pages handlers
  const legalPages = [
    { path: '/privacy', title: 'Privacy Policy | SWiM AI', description: 'SWiM AI privacy policy - how we collect, use, and protect your personal information.' },
    { path: '/terms', title: 'Terms of Service | SWiM AI', description: 'SWiM AI terms of service - the legal agreement for using our AI marketing services.' }
  ];

  legalPages.forEach(({ path: legalPath, title, description }) => {
    app.get(legalPath, (req, res, next) => {
      if (process.env.NODE_ENV === 'production') {
        const baseUrl = req.protocol + '://' + req.get('host');
        const distPath = path.resolve('dist/public/index.html');
        const fs = require('fs');
        if (fs.existsSync(distPath)) {
          let html = fs.readFileSync(distPath, 'utf-8');
          // Update meta tags for legal page
          html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
          html = html.replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${description}"`);
          // Ensure canonical URL is present
          if (!html.includes('<link rel="canonical"')) {
            html = html.replace('</head>', `    <link rel="canonical" href="${baseUrl}${legalPath}" />\n</head>`);
          }
          res.setHeader('Content-Type', 'text/html');
          return res.send(html);
        }
      }
      next();
    });
  });
  
  app.get('/blog/:slug', async (req, res, next) => {
    try {
      const { slug } = req.params;
      console.log(`SSR: Attempting to render blog post with slug: ${slug}`);
      
      const post = await storage.getPostBySlug(slug);
      
      if (!post || post.status !== 'published') {
        console.log(`SSR: Post not found or not published for slug: ${slug}`);
        return next();
      }

      console.log(`SSR: Found published post: ${post.title}`);
      
      // Manual conversion to avoid drizzle-orm dependencies in client bundle
      const blogPost = {
        title: post.title,
        metaTitle: post.metaTitle || post.title,
        metaDescription: post.metaDescription || post.excerpt || '',
        slug: post.slug,
        publishedAt: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        author: post.author,
        status: post.status,
        ctaType: post.ctaType,
        targetKeywords: post.targetKeywords,
        excerpt: post.excerpt || '',
        featuredImage: post.featuredImage,
        category: post.category,
        tags: post.tags,
        readingTime: post.readingTime,
        content: post.content
      };
      
      const baseUrl = req.protocol + '://' + req.get('host');
      const postUrl = `${baseUrl}/blog/${slug}`;
      
      const isDev = process.env.NODE_ENV === 'development';
      
      const escapeHtml = (str: string) => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      const safeTitle = escapeHtml(blogPost.title);
      const safeDescription = escapeHtml(blogPost.metaDescription);
      const safeAuthor = escapeHtml(blogPost.author);
      const safeCategory = escapeHtml(blogPost.category);
      
      // Get the correct client assets for production
      const { scripts, styles } = isDev ? { scripts: '', styles: '' } : getClientAssets();
      
      const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    ${isDev ? `
    <script type="module">
import { createHotContext } from "/@vite/client";
const hot = createHotContext("/__dummy__runtime-error-plugin");

function sendError(error) {
  if (!(error instanceof Error)) {
    error = new Error("(unknown runtime error)");
  }
  const serialized = {
    message: error.message,
    stack: error.stack,
  };
  hot.send("runtime-error-plugin:error", serialized);
}

window.addEventListener("error", (evt) => {
  sendError(evt.error);
});

window.addEventListener("unhandledrejection", (evt) => {
  sendError(evt.reason);
});
</script>

    <script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>

    <script type="module" src="/@vite/client"></script>` : ''}

    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>${safeTitle} | SWiM AI Blog</title>
    <meta name="description" content="${safeDescription}" />
    <meta name="keywords" content="${blogPost.tags.map(escapeHtml).join(', ')}" />
    <meta name="author" content="${safeAuthor}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${blogPost.featuredImage || baseUrl + '/og-image-final.jpg'}" />
    <meta property="og:site_name" content="SWiM AI" />
    <meta property="article:published_time" content="${blogPost.publishedAt}" />
    <meta property="article:modified_time" content="${blogPost.updatedAt}" />
    <meta property="article:author" content="${safeAuthor}" />
    <meta property="article:section" content="${safeCategory}" />
    ${blogPost.tags.map(tag => `<meta property="article:tag" content="${escapeHtml(tag)}" />`).join('\n    ')}
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="${postUrl}" />
    <meta property="twitter:title" content="${safeTitle}" />
    <meta property="twitter:description" content="${safeDescription}" />
    <meta property="twitter:image" content="${blogPost.featuredImage || baseUrl + '/og-image-final.jpg'}" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${postUrl}" />
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${safeTitle}",
      "description": "${safeDescription}",
      "image": "${blogPost.featuredImage || baseUrl + '/og-image-final.jpg'}",
      "author": {
        "@type": "Organization",
        "name": "${safeAuthor}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SWiM AI",
        "logo": {
          "@type": "ImageObject",
          "url": "${baseUrl}/favicon-512x512.png"
        }
      },
      "datePublished": "${blogPost.publishedAt}",
      "dateModified": "${blogPost.updatedAt}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${postUrl}"
      },
      "articleSection": "${safeCategory}",
      "keywords": "${blogPost.tags.map(escapeHtml).join(', ')}",
      "wordCount": ${blogPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length},
      "timeRequired": "PT${Math.ceil(blogPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)}M"
    }
    </script>
    
    ${isDev ? '' : styles}
  </head>
  <body>
    <div id="root"></div>
    ${isDev ? '<script type="module" src="/src/main.tsx"></script>' : scripts}
  </body>
</html>`;

      console.log(`SSR: Successfully rendered blog post: ${safeTitle}`);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
      
      // Track view
      await storage.trackView(post.id);
    } catch (error) {
      console.error('Error rendering blog post:', error);
      next();
    }
  });

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
