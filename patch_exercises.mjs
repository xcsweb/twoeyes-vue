import fs from 'fs'
import path from 'path'

const dir = '/workspace/twoeyes-vue/src/views/exercises'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'))

for (const file of files) {
  const filePath = path.join(dir, file)
  let content = fs.readFileSync(filePath, 'utf-8')

  // Remove the <v-btn ... icon="mdi-close" ... class="exit-btn" ... ></v-btn>
  content = content.replace(/<v-btn\s+icon="mdi-close"[\s\S]*?class="exit-btn"[\s\S]*?<\/v-btn>\n*/, '')
  
  // Remove const exitExercise = () => { ... }
  content = content.replace(/const exitExercise = \(\) => \{\n\s+router\.push\(\{ name: 'TrainingMenu' \}\)\n\}\n*/, '')
  content = content.replace(/const exitExercise = \(\) => \{\n\s+router\.push\(\{ name: 'TrainingMenu' \}\)\n\s*\}\n*/, '')
  content = content.replace(/const exitExercise = \(\) => \{\s*router\.push\(\{ name: 'TrainingMenu' \}\)\s*\}\n*/, '')
  
  // Remove .exit-btn CSS
  content = content.replace(/\.exit-btn \{[\s\S]*?z-index: 10;\n\}\n*/, '')
  
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log('Patched', file)
}
