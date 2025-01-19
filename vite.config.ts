import { resolve } from 'path'
import { defineConfig } from 'vite'
import { configDotenv } from 'dotenv'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths';

configDotenv({
  // path: `.env.${process.env.NODE_ENV}`,
  path: `.env.dev`,
})

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: process.env.SERVER_PORT as unknown as number,
    host: process.env.SERVER_HOST as string,
  },
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
