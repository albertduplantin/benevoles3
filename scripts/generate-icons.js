/**
 * Script simple pour générer des icônes PWA basiques
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Créer un SVG simple avec le logo 🎬
const generateSVG = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond dégradé bleu -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)" />
  
  <!-- Emoji caméra -->
  <text 
    x="50%" 
    y="50%" 
    font-size="${size * 0.5}" 
    text-anchor="middle" 
    dominant-baseline="central"
  >🎬</text>
</svg>`;
};

console.log('🎬 Génération des icônes PWA...\n');

const publicDir = path.join(process.cwd(), 'public');

sizes.forEach(size => {
  const svg = generateSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(publicDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✅ Créé : ${filename}`);
});

console.log('\n🎉 Toutes les icônes ont été générées dans public/ !');
console.log('\n📝 Note : Ce sont des fichiers SVG qui fonctionnent parfaitement pour les PWA.');
console.log('   Si vous voulez des PNG, utilisez un outil comme https://realfavicongenerator.net');

