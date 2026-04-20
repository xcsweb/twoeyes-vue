const fs = require('fs');

const files = [
  'src/views/exercises/BoxesExercise.vue',
  'src/views/exercises/BrockStringExercise.vue',
  'src/views/exercises/ParticlesExercise.vue',
  'src/views/exercises/SaccadicTrackingExercise.vue',
  'src/views/exercises/ShuffleExercise.vue',
  'src/views/exercises/SpiralExercise.vue',
  'src/views/exercises/StereopsisExercise.vue',
  'src/views/exercises/TetrisExercise.vue',
  'src/views/exercises/VergenceCardsExercise.vue',
  'src/views/exam/StereopsisTestLevel.vue',
  'src/views/exercises/AlignmentExercise.vue'
];

files.forEach(file => {
  const filePath = `/workspace/${file}`;
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/settingsStore\.leftEyeColorStr/g, 'settingsStore.leftEyeFinalColorStr');
    content = content.replace(/settingsStore\.rightEyeColorStr/g, 'settingsStore.rightEyeFinalColorStr');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
