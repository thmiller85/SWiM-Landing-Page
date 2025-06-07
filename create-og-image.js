import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

async function createOGImage() {
  // Create canvas
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#002348');
  gradient.addColorStop(0.5, '#0A3A5A');
  gradient.addColorStop(1, '#1A8CB7');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Load and draw logo
  try {
    const logo = await loadImage('./client/public/swim-logo-proper.png');
    ctx.drawImage(logo, 70, 40, 240, 120);
  } catch (error) {
    console.log('Logo not found, creating text-based version');
  }

  // Set font and draw text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 56px Arial';
  ctx.fillText('AI-Powered Marketing', 70, 220);
  ctx.fillText('& Business Solutions', 70, 290);

  // Subtitle
  ctx.fillStyle = '#4BCBF2';
  ctx.font = '26px Arial';
  ctx.fillText('Transform your business with cutting-edge AI technology', 70, 340);

  // Service bullets and text
  const services = [
    { text: 'Workflow Automation', x: 95 },
    { text: 'AI Strategy', x: 380 },
    { text: 'SaaS Development', x: 580 }
  ];

  ctx.font = '22px Arial';
  services.forEach((service, index) => {
    const bulletX = service.x - 20;
    const bulletY = 390;
    
    // Draw bullet
    ctx.fillStyle = '#4BCBF2';
    ctx.beginPath();
    ctx.arc(bulletX, bulletY, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw text
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(service.text, service.x, 400);
  });

  // Save the image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync('./client/public/og-image-final.jpg', buffer);
  console.log('Created og-image-final.jpg with SWiM branding');
}

createOGImage().catch(console.error);