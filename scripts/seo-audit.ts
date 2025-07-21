#!/usr/bin/env tsx

/**
 * SEO Audit Script - Validates site for Google Search Console compliance
 * This script helps prevent "Page with redirect" and other indexing issues
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

interface SEOCheck {
  url: string;
  name: string;
  checks: {
    noRedirects: boolean;
    hasCanonical?: boolean;
    hasTitle?: boolean;
    hasDescription?: boolean;
    hasStructuredData?: boolean;
  };
}

const pagesToAudit = [
  { url: '/', name: 'Homepage' },
  { url: '/blog', name: 'Blog Index' },
  { url: '/sitemap.xml', name: 'XML Sitemap' },
  { url: '/robots.txt', name: 'Robots.txt' },
];

async function auditPage(url: string, name: string): Promise<SEOCheck> {
  const result: SEOCheck = {
    url,
    name,
    checks: {
      noRedirects: false,
      hasCanonical: false,
      hasTitle: false,
      hasDescription: false,
      hasStructuredData: false,
    }
  };

  try {
    // Check for redirects
    const headResponse = await fetch(`${BASE_URL}${url}`, {
      method: 'HEAD',
      redirect: 'manual',
    });
    result.checks.noRedirects = headResponse.status === 200;

    // For HTML pages, check content
    if (url.endsWith('.xml') || url.endsWith('.txt')) {
      return result; // Skip HTML checks for XML/TXT files
    }

    const response = await fetch(`${BASE_URL}${url}`);
    const html = await response.text();

    // Check for canonical URL
    result.checks.hasCanonical = html.includes('<link rel="canonical"');
    
    // Check for title
    result.checks.hasTitle = html.includes('<title>') && !html.includes('<title></title>');
    
    // Check for meta description
    result.checks.hasDescription = html.includes('name="description"') && html.includes('content=');
    
    // Check for JSON-LD structured data
    result.checks.hasStructuredData = html.includes('"@type":') && html.includes('"@context"');

  } catch (error) {
    console.error(`Error auditing ${url}:`, error);
  }

  return result;
}

async function runSEOAudit() {
  console.log('🔍 Running SEO Audit for Google Search Console compliance...\n');
  
  const results = await Promise.all(
    pagesToAudit.map(page => auditPage(page.url, page.name))
  );

  let overallScore = 0;
  let maxScore = 0;

  for (const result of results) {
    console.log(`📄 ${result.name} (${result.url})`);
    
    const checks = Object.entries(result.checks);
    let pageScore = 0;
    
    for (const [check, passed] of checks) {
      const icon = passed ? '✅' : '❌';
      const checkName = check.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase());
      console.log(`   ${icon} ${checkName}`);
      if (passed) pageScore++;
      maxScore++;
    }
    
    overallScore += pageScore;
    console.log(`   Score: ${pageScore}/${checks.length}\n`);
  }

  console.log('📊 Overall SEO Score:');
  console.log(`${overallScore}/${maxScore} checks passed (${Math.round(overallScore/maxScore*100)}%)\n`);

  // Specific recommendations
  const redirectIssues = results.filter(r => !r.checks.noRedirects);
  if (redirectIssues.length === 0) {
    console.log('🎉 No redirect issues found - Google Search Console indexing should work properly!');
  } else {
    console.log('⚠️  Redirect issues that need attention:');
    redirectIssues.forEach(r => console.log(`   • ${r.name}: Has redirects`));
  }

  const missingCanonical = results.filter(r => r.checks.hasCanonical === false);
  if (missingCanonical.length > 0) {
    console.log('\n📝 Pages missing canonical URLs:');
    missingCanonical.forEach(r => console.log(`   • ${r.name}`));
  }
}

if (process.argv[1] === import.meta.filename) {
  runSEOAudit().catch(console.error);
}

export { runSEOAudit };