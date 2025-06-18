import fs from 'fs';
import path from 'path';

let clientScripts: string | null = null;
let clientStyles: string | null = null;

/**
 * Extract script and style tags from the built index.html
 */
export function getClientAssets(): { scripts: string; styles: string } {
  if (clientScripts && clientStyles) {
    return { scripts: clientScripts, styles: clientStyles };
  }

  try {
    const indexPath = path.resolve('dist/public/index.html');
    if (!fs.existsSync(indexPath)) {
      console.warn('Built index.html not found, using fallback assets');
      return {
        scripts: '<script type="module" crossorigin src="/assets/index.js"></script>',
        styles: '<link rel="stylesheet" href="/assets/index.css">'
      };
    }

    const html = fs.readFileSync(indexPath, 'utf-8');
    
    // Extract all script tags
    const scriptMatches = html.match(/<script[^>]*>.*?<\/script>/gs) || [];
    clientScripts = scriptMatches.join('\n    ');
    
    // Extract all link tags for stylesheets
    const styleMatches = html.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];
    clientStyles = styleMatches.join('\n    ');
    
    return { scripts: clientScripts, styles: clientStyles };
  } catch (error) {
    console.error('Error reading client assets:', error);
    return {
      scripts: '<script type="module" crossorigin src="/assets/index.js"></script>',
      styles: '<link rel="stylesheet" href="/assets/index.css">'
    };
  }
}