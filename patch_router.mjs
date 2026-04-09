import fs from 'fs'
import path from 'path'

const dir = '/workspace/twoeyes-vue/src/views/exercises'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'))

for (const file of files) {
  const filePath = path.join(dir, file)
  let content = fs.readFileSync(filePath, 'utf-8')

  content = content.replace(/const router = useRouter\(\)\n/g, '')
  content = content.replace(/import \{ useRouter \} from 'vue-router'/g, '')
  content = content.replace(/import \{ useRoute, useRouter \} from 'vue-router'/g, "import { useRoute } from 'vue-router'")
  
  fs.writeFileSync(filePath, content, 'utf-8')
}
