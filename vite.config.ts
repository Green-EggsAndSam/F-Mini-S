import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-react',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        screen: resolve(__dirname, 'screen.html'),
        ranks: resolve(__dirname, 'ranks.html'),
      },
      output: {
        format: 'cjs'
      }
    },
  },
  server:{
    port:5123,
    strictPort:true
  },
  base: './',
})
