import sharp from 'sharp';
import fs from 'fs';

const svgBuffer = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f0ff" />
      <stop offset="100%" stop-color="#b026ff" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="#0a0b10" />
  <rect width="480" height="480" x="16" y="16" rx="84" fill="none" stroke="url(#grad)" stroke-width="8" />
  <text x="256" y="280" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="url(#grad)" text-anchor="middle" alignment-baseline="middle">UCA</text>
  <text x="256" y="400" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="#ffffff" text-anchor="middle">ARENA</text>
</svg>
`);

async function generate() {
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }

  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
    
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');

  console.log('Icons generated successfully!');
}

generate();
