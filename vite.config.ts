import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    tsconfigPaths({
      loose: true,
      root: './',
    })
  ],
})
