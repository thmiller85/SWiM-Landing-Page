#!/usr/bin/env node

/**
 * Favicon Generator Script
 * Generates all required favicon formats from the SWiM logo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Favicon specifications
const faviconSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-192x192.png', size: 192 },
  { name: 'favicon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
];

// Output directory
const outputDir = path.join(path.dirname(__dirname), 'client/public');

async function generateFavicons() {
  console.log('🎨 Generating favicons from SWiM logo...\n');
  
  try {
    // Load the source logo
    const logoPath = path.join(path.dirname(__dirname), 'attached_assets/SWiM Logo Dark_1750451477946.png');
    console.log(`Loading logo from: ${logoPath}`);
    
    const sourceImage = await loadImage(logoPath);
    console.log(`✓ Logo loaded: ${sourceImage.width}x${sourceImage.height}\n`);
    
    // Generate each favicon size
    for (const favicon of faviconSizes) {
      console.log(`Generating ${favicon.name} (${favicon.size}x${favicon.size})...`);
      
      const canvas = createCanvas(favicon.size, favicon.size);
      const ctx = canvas.getContext('2d');
      
      // Fill with transparent background
      ctx.clearRect(0, 0, favicon.size, favicon.size);
      
      // Calculate scaling to fit the logo properly
      const scale = Math.min(favicon.size / sourceImage.width, favicon.size / sourceImage.height);
      const scaledWidth = sourceImage.width * scale;
      const scaledHeight = sourceImage.height * scale;
      
      // Center the logo
      const x = (favicon.size - scaledWidth) / 2;
      const y = (favicon.size - scaledHeight) / 2;
      
      // Draw the logo
      ctx.drawImage(sourceImage, x, y, scaledWidth, scaledHeight);
      
      // Save the favicon
      const outputPath = path.join(outputDir, favicon.name);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`✓ Generated: ${favicon.name} (${buffer.length} bytes)`);
    }
    
    // Generate ICO file (basic PNG-based ICO)
    console.log('\nGenerating favicon.ico...');
    const icoCanvas = createCanvas(32, 32);
    const icoCtx = icoCanvas.getContext('2d');
    
    icoCtx.clearRect(0, 0, 32, 32);
    const icoScale = Math.min(32 / sourceImage.width, 32 / sourceImage.height);
    const icoScaledWidth = sourceImage.width * icoScale;
    const icoScaledHeight = sourceImage.height * icoScale;
    const icoX = (32 - icoScaledWidth) / 2;
    const icoY = (32 - icoScaledHeight) / 2;
    
    icoCtx.drawImage(sourceImage, icoX, icoY, icoScaledWidth, icoScaledHeight);
    
    const icoBuffer = icoCanvas.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, 'favicon.ico'), icoBuffer);
    console.log(`✓ Generated: favicon.ico (${icoBuffer.length} bytes)`);
    
    // Generate SVG favicon
    console.log('\nGenerating favicon.svg...');
    
    // Create a simplified SVG version of the logo
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="swimGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0ea5e9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="32" height="32" fill="#0f172a"/>
  
  <!-- Wave element -->
  <path d="M4 16 Q8 12 12 16 T20 16 Q24 12 28 16 Q24 20 20 16 Q16 20 12 16 Q8 20 4 16" 
        fill="url(#swimGradient)" opacity="0.8"/>
  
  <!-- SWiM text (simplified) -->
  <text x="16" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" 
        font-size="6" font-weight="bold">SWiM</text>
</svg>`;
    
    fs.writeFileSync(path.join(outputDir, 'favicon.svg'), svgContent);
    console.log(`✓ Generated: favicon.svg (${svgContent.length} bytes)`);
    
    console.log('\n🎉 All favicons generated successfully!');
    console.log('\nGenerated files:');
    faviconSizes.forEach(favicon => {
      const filePath = path.join(outputDir, favicon.name);
      const stats = fs.statSync(filePath);
      console.log(`  ✓ ${favicon.name} - ${Math.round(stats.size / 1024)}KB`);
    });
    console.log(`  ✓ favicon.ico - ${Math.round(fs.statSync(path.join(outputDir, 'favicon.ico')).size / 1024)}KB`);
    console.log(`  ✓ favicon.svg - ${Math.round(fs.statSync(path.join(outputDir, 'favicon.svg')).size / 1024)}KB`);
    
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

// Run the generator
generateFavicons();