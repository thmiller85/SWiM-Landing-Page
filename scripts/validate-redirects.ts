#!/usr/bin/env tsx

/**
 * Script to validate that our site doesn't have redirect chains
 * This helps identify and fix Google Search Console "Page with redirect" issues
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

interface RedirectCheck {
  url: string;
  expectedStatus?: number;
  maxRedirects?: number;
}

const urlsToCheck: RedirectCheck[] = [
  { url: '/', expectedStatus: 200 },
  { url: '/blog', expectedStatus: 200 },
  { url: '/api/health', expectedStatus: 200 },
  { url: '/sitemap.xml', expectedStatus: 200 },
  { url: '/robots.txt', expectedStatus: 200 },
  { url: '/team', expectedStatus: 200 },
  { url: '/team/ross-stockdale', expectedStatus: 200 },
  { url: '/team/tom-miller', expectedStatus: 200 },
  { url: '/team/steve-wurster', expectedStatus: 200 },
  { url: '/services/ai-powered-marketing', expectedStatus: 200 },
  { url: '/services/workflow-automation', expectedStatus: 200 },
  { url: '/services/b2b-saas-development', expectedStatus: 200 },
  { url: '/services/data-intelligence', expectedStatus: 200 },
  { url: '/services/ai-strategy-consulting', expectedStatus: 200 },
  { url: '/services/ai-security-ethics', expectedStatus: 200 },
  { url: '/privacy', expectedStatus: 200 },
  { url: '/terms', expectedStatus: 200 },
];

async function checkUrl(check: RedirectCheck): Promise<{
  url: string;
  status: number;
  redirectCount: number;
  finalUrl: string;
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(`${BASE_URL}${check.url}`, {
      method: 'HEAD',
      redirect: 'manual', // Don't follow redirects automatically
    });

    let redirectCount = 0;
    let currentUrl = `${BASE_URL}${check.url}`;
    let currentResponse = response;

    // Follow redirects manually to count them
    while ([301, 302, 303, 307, 308].includes(currentResponse.status)) {
      redirectCount++;
      if (redirectCount > 10) { // Prevent infinite loops
        return {
          url: check.url,
          status: currentResponse.status,
          redirectCount,
          finalUrl: currentUrl,
          success: false,
          error: 'Too many redirects (>10)'
        };
      }

      const location = currentResponse.headers.get('location');
      if (!location) {
        break;
      }

      currentUrl = location.startsWith('http') ? location : `${BASE_URL}${location}`;
      currentResponse = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual',
      });
    }

    const expectedStatus = check.expectedStatus || 200;
    const success = currentResponse.status === expectedStatus && redirectCount === 0;

    return {
      url: check.url,
      status: currentResponse.status,
      redirectCount,
      finalUrl: currentUrl,
      success,
      error: success ? undefined : `Expected status ${expectedStatus} with 0 redirects, got ${currentResponse.status} with ${redirectCount} redirects`
    };

  } catch (error) {
    return {
      url: check.url,
      status: 0,
      redirectCount: 0,
      finalUrl: '',
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function validateRedirects() {
  console.log('🔍 Validating redirect behavior...\n');
  
  const results = await Promise.all(urlsToCheck.map(checkUrl));
  
  let hasIssues = false;
  
  for (const result of results) {
    const statusIcon = result.success ? '✅' : '❌';
    const redirectInfo = result.redirectCount > 0 ? ` (${result.redirectCount} redirects)` : '';
    
    console.log(`${statusIcon} ${result.url} → ${result.status}${redirectInfo}`);
    
    if (!result.success) {
      hasIssues = true;
      console.log(`   Error: ${result.error}`);
      if (result.finalUrl !== `${BASE_URL}${result.url}`) {
        console.log(`   Final URL: ${result.finalUrl}`);
      }
    }
  }
  
  console.log('\n📊 Summary:');
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  console.log(`${successCount}/${totalCount} URLs pass redirect validation`);
  
  if (hasIssues) {
    console.log('\n⚠️  Issues found that may cause Google indexing problems:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   • ${r.url}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('\n🎉 All URLs are properly configured without redirects!');
  }
}

if (process.argv[1] === import.meta.filename) {
  validateRedirects().catch(console.error);
}

export { validateRedirects };