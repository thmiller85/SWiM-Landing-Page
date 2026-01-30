import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";

const WIDTH = 1200;
const HEIGHT = 630;

async function generateOGImage() {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Background gradient (brand colors: #002348 → #0A3A5A → #1A8CB7)
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, "#002348");
  gradient.addColorStop(0.4, "#0A3A5A");
  gradient.addColorStop(1, "#1A8CB7");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle decorative radial glow (bottom-right)
  const radial = ctx.createRadialGradient(
    WIDTH * 0.85, HEIGHT * 0.8, 0,
    WIDTH * 0.85, HEIGHT * 0.8, 350
  );
  radial.addColorStop(0, "rgba(75, 203, 242, 0.12)");
  radial.addColorStop(1, "transparent");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Secondary glow (top-left, subtle)
  const radial2 = ctx.createRadialGradient(
    WIDTH * 0.1, HEIGHT * 0.15, 0,
    WIDTH * 0.1, HEIGHT * 0.15, 250
  );
  radial2.addColorStop(0, "rgba(26, 140, 183, 0.08)");
  radial2.addColorStop(1, "transparent");
  ctx.fillStyle = radial2;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Load and draw logo
  const logoPath = path.resolve("client/src/assets/swim-logo-transparent.png");
  try {
    const logo = await loadImage(logoPath);
    const logoHeight = 80;
    const logoWidth = (logo.width / logo.height) * logoHeight;
    ctx.drawImage(logo, 70, 45, logoWidth, logoHeight);
  } catch (err) {
    console.warn("Could not load logo, continuing without it:", err);
  }

  // Headline: "AI as Your Operating Layer"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 56px sans-serif";
  ctx.fillText("AI as Your", 70, 210);
  ctx.fillText("Operating Layer", 70, 275);

  // Subtitle
  ctx.fillStyle = "#4BCBF2";
  ctx.font = "400 24px sans-serif";
  ctx.fillText(
    "Enterprise-grade intelligence for the businesses that need it most",
    70,
    330
  );

  // Thin divider line
  ctx.strokeStyle = "rgba(75, 203, 242, 0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(70, 365);
  ctx.lineTo(1130, 365);
  ctx.stroke();

  // Service bullets
  const services = [
    "Retail Intelligence",
    "Storage Operations AI",
    "EOS Implementer Growth",
  ];
  const bulletY = 405;
  let bulletX = 70;

  ctx.font = "500 22px sans-serif";
  for (let i = 0; i < services.length; i++) {
    // Bullet dot
    ctx.fillStyle = "#4BCBF2";
    ctx.beginPath();
    ctx.arc(bulletX + 5, bulletY - 6, 5, 0, Math.PI * 2);
    ctx.fill();

    // Service text
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(services[i], bulletX + 20, bulletY);

    // Measure text width for spacing
    const textWidth = ctx.measureText(services[i]).width;
    bulletX += textWidth + 65;
  }

  // Bottom tagline
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "400 18px sans-serif";
  ctx.fillText("Founder-Led  ·  U.S.-Based  ·  See It Work Before You Sign", 70, 560);

  // Bottom accent line
  const accentGradient = ctx.createLinearGradient(0, HEIGHT - 4, WIDTH, HEIGHT - 4);
  accentGradient.addColorStop(0, "#1A8CB7");
  accentGradient.addColorStop(0.5, "#4BCBF2");
  accentGradient.addColorStop(1, "#1A8CB7");
  ctx.fillStyle = accentGradient;
  ctx.fillRect(0, HEIGHT - 4, WIDTH, 4);

  // Write output
  const outputPath = path.resolve("client/public/og-image.png");
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(outputPath, buffer);
  console.log(`OG image generated: ${outputPath} (${buffer.length} bytes)`);
}

generateOGImage().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
