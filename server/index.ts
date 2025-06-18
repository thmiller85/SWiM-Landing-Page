import express, { type Request, Response, NextFunction } from "express";
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
