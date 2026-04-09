import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 确保在 GitHub Pages 上的静态资源路径引用正确
  plugins: [vue()],
})
