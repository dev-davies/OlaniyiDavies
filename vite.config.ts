import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import Prism from 'markdown-it-prism'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // allow Vue to process .md files
    }),
    Markdown({
      wrapperClasses: 'prose',
      markdownItSetup(md) {
        md.use(Prism)
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
