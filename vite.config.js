import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  // 锁死端口：被占用时直接报错，不再静默跳到 5174/5175 导致 CORS 失败、连错端口
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api/tts': {
        target: 'https://okenglish.site',
        changeOrigin: true,
      },
    },
  },
  preview: { host: '127.0.0.1', port: 5173, strictPort: true },
})
