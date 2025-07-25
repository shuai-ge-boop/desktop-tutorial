import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 移除 additionalData 配置，避免与 @use 语法冲突
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  }
}) 