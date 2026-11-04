const fs = require('fs');
const path = require('path');

// 1. Ensure dist directory exists
fs.mkdirSync('dist', { recursive: true });

// 2. Copy index.html into dist/
fs.copyFileSync('index.html', path.join('dist', 'index.html'));

// 3. Copy metadata.json if present
if (fs.existsSync('metadata.json')) {
  fs.copyFileSync('metadata.json', path.join('dist', 'metadata.json'));
}

// 4. Create .vercel/output/static as foolproof Build Output API fallback
const vercelStaticDir = path.join('.vercel', 'output', 'static');
fs.mkdirSync(vercelStaticDir, { recursive: true });
fs.copyFileSync('index.html', path.join(vercelStaticDir, 'index.html'));

console.log('Build completed successfully: dist/ and .vercel/output/static ready for Vercel deployment.');

