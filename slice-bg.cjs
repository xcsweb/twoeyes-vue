const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

async function sliceBackground() {
  const url = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&h=1080&q=100'; // High res earth/stars
  const tmpFile = '/tmp/hq_bg.jpg';
  const outDir = 'src/assets/images/bg_tiles';

  console.log('Downloading high-res background...');
  execSync(`curl -sL "${url}" -o ${tmpFile}`);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const cols = 4;
  const rows = 4;
  const width = 1920;
  const height = 1080;
  const tileW = width / cols; // 480
  const tileH = height / rows; // 270

  console.log('Slicing image into 16 tiles...');
  const image = sharp(tmpFile);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tileName = `bg_tile_${r}_${c}.webp`;
      const tilePath = path.join(outDir, tileName);
      
      await image.clone()
        .extract({ left: c * tileW, top: r * tileH, width: tileW, height: tileH })
        .webp({ quality: 60 }) // High compression for fast load
        .toFile(tilePath);
        
      console.log(`Created ${tileName}`);
    }
  }
  
  fs.unlinkSync(tmpFile);
  console.log('✅ Background slicing complete.');
}

sliceBackground();