const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const queries = [
  { file: 'src/assets/images/cards/intro.webp', id: '1451187580459-43490279c0fa' },
  { file: 'src/assets/images/cards/vision.webp', id: '1446776811953-b23d57bd21aa' },
  { file: 'src/assets/images/cards/exam.webp', id: '1462331940025-496dfbfc7564' },
  { file: 'src/assets/images/cards/amblyopia.webp', id: '1419242902214-272b3f66ee7a' },
  { file: 'src/assets/images/cards/training.webp', id: '1464802686167-b939a6910659' },
  { file: 'src/assets/images/cards/theory.webp', id: '1506703719100-a0f3a48c0f86' },
  { file: 'src/assets/images/cards/profile.webp', id: '1436891620584-47fd0e565afb' },
  
  { file: 'src/assets/images/stages/stage1.webp', id: '1444703686981-a3abbc4d4fe3' },
  { file: 'src/assets/images/stages/stage2.webp', id: '1484589065579-248aad0d8f13' },
  { file: 'src/assets/images/stages/stage3.webp', id: '1534447677768-be436bb09401' },
  { file: 'src/assets/images/stages/stage4.webp', id: '1543722530-d2c3201371e7' },

  { file: 'src/assets/images/games/shuffle.webp', id: '1518066000714-58c45f1a2c0a' },
  { file: 'src/assets/images/games/boxes.webp', id: '1550684848-fac1c5b4e853' },
  { file: 'src/assets/images/games/saccadic.webp', id: '1451187580459-43490279c0fa' },
  { file: 'src/assets/images/games/spiral.webp', id: '1446776811953-b23d57bd21aa' },
  { file: 'src/assets/images/games/particles.webp', id: '1462331940025-496dfbfc7564' },
  { file: 'src/assets/images/games/vergence-cards.webp', id: '1419242902214-272b3f66ee7a' },
  { file: 'src/assets/images/games/brock-string.webp', id: '1464802686167-b939a6910659' },
  { file: 'src/assets/images/games/stereopsis.webp', id: '1506703719100-a0f3a48c0f86' },
  { file: 'src/assets/images/games/tetris.webp', id: '1436891620584-47fd0e565afb' }
];

for (const item of queries) {
  try {
    console.log(`Downloading pure cosmic image: ${item.id}`);
    const url = `https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=800&q=75&fm=webp`;
    
    fs.mkdirSync(path.dirname(item.file), { recursive: true });
    execSync(`curl -sL "${url}" -o ${item.file}`);
    
    console.log(`✅ Saved ${item.file}`);
    
  } catch (e) {
    console.error(`❌ Failed for ${item.id}: ${e.message}`);
  }
}
