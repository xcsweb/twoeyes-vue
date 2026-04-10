import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/twoeyes-vue/', // 适配 GitHub Pages 仓库路径
  plugins: [vue()],
})
