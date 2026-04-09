import fs from 'fs'
import path from 'path'

const dir = '/workspace/twoeyes-vue/src/views/exercises'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'))

for (const file of files) {
  const filePath = path.join(dir, file)
  let content = fs.readFileSync(filePath, 'utf-8')

  content = content.replace(/\.exit-btn\s*\{[\s\S]*?\}/g, '')
  content = content.replace(/const exitExercise = \(\) => \{\n\s+router\.push\(\{ name: 'TrainingMenu' \}\)\n\}\n*/g, '')
  
  fs.writeFileSync(filePath, content, 'utf-8')
}
