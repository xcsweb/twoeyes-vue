import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'
import path from 'path'

const appVersion = Date.now().toString()

function versionPlugin() {
  return {
    name: 'version-plugin',
    buildStart() {
      const dir = path.resolve(__dirname, 'public')
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(
        path.resolve(dir, 'version.json'),
        JSON.stringify({ version: appVersion })
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/twoeyes-vue/', // 适配 GitHub Pages 仓库路径
  define: {
    __APP_VERSION__: JSON.stringify(appVersion)
  },
  plugins: [vue(), versionPlugin()],
})
