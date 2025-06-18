import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

// Define routes that need to be pre-rendered for SEO (marketing pages only)
// Blog posts are handled by SSR, so we don't need to prerender them
const routes = [
  "/",
  "/team",
  "/team/ross-stockdale",
  "/team/tom-miller",
  "/team/steve-wurster",
  "/team/david-stockdale",
  "/services/ai-powered-marketing",
  "/services/workflow-automation",
  "/services/b2b-saas-development",
  "/services/data-intelligence",
  "/services/ai-strategy-consulting",
  "/services/ai-security-ethics",
];

// Try multiple possible build output paths
const possibleDistPaths = [
  path.resolve("dist/public"), // Vite default output
  path.resolve("dist"), // Alternative output
  path.resolve("client/dist"), // Another possible output
];

let distPath: string;
let templatePath: string;

// Find the correct build output directory
for (const possiblePath of possibleDistPaths) {
  const possibleTemplate = path.join(possiblePath, "index.html");
  if (fs.existsSync(possibleTemplate)) {
    distPath = possiblePath;
    templatePath = possibleTemplate;
    break;
  }
}

async function prerenderRoutes() {
  if (!templatePath || !fs.existsSync(templatePath)) {
    console.warn(
      "⚠️ Build files not found in any expected location. Skipping prerender to continue deployment.",
    );
    console.log(
      "Searched paths:",
      possibleDistPaths.map((p) => path.join(p, "index.html")),
    );
    console.log(
      '💡 Run "npm run build" first, or deployment will continue without prerendered pages.',
    );
    return; // Don't exit, just skip prerendering
  }

  console.log(`✅ Found build files at: ${distPath}`);

  const template = fs.readFileSync(templatePath, "utf-8");

  // Keep the original index.html for the SPA fallback
  console.log("✓ Keeping SPA fallback: /");

  for (const route of routes) {
    if (route === "/") continue; // Skip root, we'll handle it separately

    const filePath = path.join(distPath, route, "index.html");

    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate static HTML with proper meta tags and content
    let html = template;

    // Add route-specific meta tags and content
    html = addRouteSpecificContent(html, route);

    fs.writeFileSync(filePath, html);
    console.log(`✓ Pre-rendered: ${route}`);
  }

  // Create SEO-optimized homepage while keeping SPA functionality
  const homepageHtml = addRouteSpecificContent(template, "/");
  fs.writeFileSync(path.join(distPath, "index.html"), homepageHtml);
  console.log("✓ Updated homepage with SEO content");

  // Create admin route fallbacks to the SPA
  const adminRoutes = [
    "/admin",
    "/admin/login",
    "/admin/dashboard",
    "/admin/blog-posts",
  ];

  for (const adminRoute of adminRoutes) {
    const adminPath = path.join(distPath, adminRoute, "index.html");
    const adminDir = path.dirname(adminPath);

    if (!fs.existsSync(adminDir)) {
      fs.mkdirSync(adminDir, { recursive: true });
    }

    // Copy the main SPA template for admin routes
    fs.writeFileSync(adminPath, template);
    console.log(`✓ Created SPA fallback: ${adminRoute}`);
  }

  console.log(
    `\n🎉 Successfully pre-rendered ${routes.length} marketing pages`,
  );
  console.log(`✓ Created ${adminRoutes.length} admin route fallbacks`);
  console.log("💡 Blog posts are handled by server-side rendering (SSR)");
  console.log("💡 Contact form and interactive features remain client-side");

  // Copy frontend files to correct location for server
  console.log("\n📁 Copying frontend files...");
  const { execSync } = await import("child_process");
  try {
    execSync("node scripts/copy-frontend.js", { stdio: "inherit" });
  } catch (error) {
    console.warn(
      "Frontend files copy skipped (files may already be in correct location)",
    );
  }

  // Sitemap is handled dynamically by the server at /sitemap.xml
  console.log(
    "\n💡 Sitemap is generated dynamically by the server at /sitemap.xml",
  );
}

function addRouteSpecificContent(html: string, route: string): string {
  let title = "SWiM | AI-Powered Marketing & Business Solutions";
  let description =
    "Transform your business with AI-powered marketing, workflow automation, and custom SaaS solutions. Founder-led team of AI specialists delivering transparent, results-driven implementations for B2B companies. Expert AI integration, data intelligence, and ethical AI consulting.";
  let additionalContent = "";

  switch (route) {
    case "/":
      additionalContent = `
        <div style="display: none;" id="seo-content">
          <h1>Transform your business with AI-Powered Solutions</h1>
          <p>SWiM helps B2B companies leverage artificial intelligence to automate workflows, optimize marketing strategies, and create cutting-edge SaaS solutions that drive results.</p>
          <div>AI-Powered Marketing, Workflow Automation, B2B SaaS Development, Data Intelligence, AI Strategy Consulting, AI Security & Ethics</div>
          <div>24+ AI Experts, 12+ Years Experience, 200+ Projects, 98% Client Retention</div>
          <div>Founder-Led Delivery, Lean By Design, U.S.-Based Team, Cross-Industry Experience</div>
        </div>
      `;
      break;
    case "/team":
      title = "Meet the SWiM Team | AI & Marketing Experts";
      description =
        "Meet our team of AI specialists, marketing experts, and technical engineers who transform businesses through technology.";
      additionalContent = `
        <div style="display: none;" id="seo-content">
          <h1>Meet the SWiM Team</h1>
          <div>Ross Stockdale - Chief Marketing Officer</div>
          <div>Tom Miller - Chief Product Officer</div>
          <div>Steve Wurster - Chief Growth Officer</div>
          <div>David Stockdale - Chief Technology Officer</div>
        </div>
      `;
      break;
    case "/team/ross-stockdale":
      title = "Ross Stockdale - Chief Marketing Officer | SWiM";
      description =
        "Fractional CMO and founder of Thunder Stock Marketing, helping B2B service companies craft data-driven campaigns.";
      break;
    case "/team/tom-miller":
      title = "Tom Miller - Chief Product Officer | SWiM";
      description =
        "Finance veteran and AI innovator creating bespoke technology solutions and transforming business challenges.";
      break;
    case "/team/steve-wurster":
      title = "Steve Wurster - Chief Growth Officer | SWiM";
      description =
        "Founder of Wurster Digital Group with 15+ years experience in performance media strategy.";
      break;
    case "/team/david-stockdale":
      title = "David Stockdale - Chief Technology Officer | SWiM";
      description =
        "Self-taught technician with a decade of experience in network infrastructure and systems integration.";
      break;
    case "/services/ai-powered-marketing":
      title = "AI-Powered Marketing Solutions | SWiM";
      description =
        "Leverage machine learning algorithms to optimize marketing campaigns, predict customer behavior, and increase ROI.";
      additionalContent = `
        <div style="display: none;" id="seo-content">
          <h1>AI-Powered Marketing</h1>
          <p>Leverage machine learning algorithms to optimize your marketing campaigns, predict customer behavior, and increase ROI.</p>
          <div>Lead Generation, Customer Segmentation, Content Optimization</div>
        </div>
      `;
      break;
    case "/services/workflow-automation":
      title = "Workflow Automation Solutions | SWiM";
      description =
        "Streamline operations with intelligent automation systems that reduce manual tasks and optimize resource allocation.";
      additionalContent = `
        <div style="display: none;" id="seo-content">
          <h1>Workflow Automation</h1>
          <p>Streamline your operations with intelligent automation systems that reduce manual tasks and optimize resource allocation.</p>
          <div>Process Optimization, Task Automation, Efficiency Analysis</div>
        </div>
      `;
      break;
    case "/services/b2b-saas-development":
      title = "B2B SaaS Development | Custom AI Solutions | SWiM";
      description =
        "Create custom software solutions that integrate AI capabilities to solve specific business challenges and drive growth.";
      additionalContent = `
        <div style="display: none;" id="seo-content">
          <h1>B2B SaaS Development</h1>
          <p>Create custom software solutions that integrate AI capabilities to solve specific business challenges and drive growth.</p>
          <div>Custom Software, API Integration, Scalable Solutions</div>
        </div>
      `;
      break;
    case "/services/data-intelligence":
      title = "Data Intelligence & Analytics | SWiM";
      description =
        "Transform raw data into actionable insights through advanced analytics, visualization, and predictive modeling.";
      additionalContent = `
        <div style="display: none;" id="seo-content">
          <h1>Data Intelligence</h1>
          <p>Transform raw data into actionable insights through advanced analytics, visualization, and predictive modeling.</p>
          <div>Business Intelligence, Data Visualization, Predictive Models</div>
        </div>
      `;
      break;
    case "/services/ai-strategy-consulting":
      title = "AI Strategy Consulting | Implementation Planning | SWiM";
      description =
        "Develop a comprehensive AI roadmap tailored to your business goals, technical infrastructure, and market positioning.";
      additionalContent = `
        <div style="display: none;" id="seo-content">
          <h1>AI Strategy Consulting</h1>
          <p>Develop a comprehensive AI roadmap tailored to your business goals, technical infrastructure, and market positioning.</p>
          <div>Technology Assessment, Implementation Planning, ROI Analysis</div>
        </div>
      `;
      break;
    case "/services/ai-security-ethics":
      title = "AI Security & Ethics | Compliance Solutions | SWiM";
      description =
        "Ensure your AI implementations are secure, compliant with regulations, and aligned with ethical business practices.";
      additionalContent = `
        <div style="display: none;" id="seo-content">
          <h1>AI Security & Ethics</h1>
          <p>Ensure your AI implementations are secure, compliant with regulations, and aligned with ethical business practices.</p>
          <div>Risk Assessment, Compliance, Ethical AI</div>
        </div>
      `;
      break;
  }

  // Update title and description
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta name="description" content=".*?"/,
    `<meta name="description" content="${description}"`,
  );

  // Add structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: `https://swimsolutions.ai${route}`,
    isPartOf: {
      "@type": "WebSite",
      name: "SWiM Agency",
      url: "https://swimsolutions.ai",
    },
  };

  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>\n</head>`,
  );

  // Add SEO content in hidden div
  if (additionalContent) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"></div>${additionalContent}`,
    );
  }

  return html;
}

// Execute prerendering with comprehensive error handling
async function main() {
  try {
    await prerenderRoutes();
    console.log("✅ Prerender completed successfully");
  } catch (error) {
    console.warn("⚠️ Prerender failed, but deployment will continue:");
    console.warn(error.message);
    console.log("💡 The site will still work as a Single Page Application");
    // Don't exit with error - let deployment continue
    process.exit(0);
  }
}

main();
