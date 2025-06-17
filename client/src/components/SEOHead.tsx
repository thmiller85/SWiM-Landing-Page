import { useEffect } from 'react';
import { BlogPost } from '@shared/blog';

interface SEOHeadProps {
  post?: BlogPost;
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  url?: string;
}

const SEOHead = ({ 
  post, 
  title = "SWiM AI - AI-Powered Marketing & Automation",
  description = "Transform your business with AI-powered marketing automation, workflow optimization, and data-driven growth strategies.",
  image = "/og-image-final.jpg",
  type = "website",
  url
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Set document title
    const pageTitle = post ? `${post.title} | SWiM AI Blog` : title;
    document.title = pageTitle;
    
    // Set or update meta tags
    const setMetaTag = (name: string, content: string, property?: string) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    const metaDescription = post?.metaDescription || description;
    const metaImage = post?.featuredImage || image;
    const currentUrl = url || window.location.href;
    
    setMetaTag('description', metaDescription);
    setMetaTag('keywords', post?.tags.join(', ') || 'AI, automation, marketing, workflow, business intelligence');
    setMetaTag('author', post?.author || 'SWiM AI Team');
    
    // Open Graph tags
    setMetaTag('', pageTitle, 'og:title');
    setMetaTag('', metaDescription, 'og:description');
    setMetaTag('', metaImage, 'og:image');
    setMetaTag('', currentUrl, 'og:url');
    setMetaTag('', type, 'og:type');
    setMetaTag('', 'SWiM AI', 'og:site_name');
    
    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', pageTitle);
    setMetaTag('twitter:description', metaDescription);
    setMetaTag('twitter:image', metaImage);
    
    // Article-specific tags
    if (post && type === 'article') {
      setMetaTag('', post.publishedAt, 'article:published_time');
      setMetaTag('', post.updatedAt, 'article:modified_time');
      setMetaTag('', post.author, 'article:author');
      setMetaTag('', post.category, 'article:section');
      
      post.tags.forEach(tag => {
        const tagMeta = document.createElement('meta');
        tagMeta.setAttribute('property', 'article:tag');
        tagMeta.setAttribute('content', tag);
        document.head.appendChild(tagMeta);
      });
    }
    
    // JSON-LD structured data
    const structuredData = post ? {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.metaDescription,
      "image": post.featuredImage,
      "author": {
        "@type": "Organization",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "SWiM AI",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/favicon-512x512.png`
        }
      },
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      },
      "articleSection": post.category,
      "keywords": post.tags.join(', '),
      "wordCount": post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
      "timeRequired": `PT${Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)}M`
    } : {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SWiM AI",
      "description": description,
      "url": currentUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/blog?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
    
    // Remove existing JSON-LD
    const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }
    
    // Add new JSON-LD
    const jsonLdScript = document.createElement('script');
    jsonLdScript.type = 'application/ld+json';
    jsonLdScript.textContent = JSON.stringify(structuredData);
    document.head.appendChild(jsonLdScript);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
    
  }, [post, title, description, image, type, url]);

  return null; // This component only manages head tags
};

export default SEOHead;