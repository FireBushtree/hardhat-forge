import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// 开发阶段代理 API -> Express
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  build: {
    outDir: './dist',
  },
})
