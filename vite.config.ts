import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@mixins': fileURLToPath(new URL('./src/mixins', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@panel': fileURLToPath(new URL('./src/components/panel', import.meta.url)),
      '@panes': fileURLToPath(new URL('./src/components/panel/main/panes', import.meta.url)),
      '@game': fileURLToPath(new URL('./src/components/panel/game', import.meta.url)),
      '@about': fileURLToPath(new URL('./src/components/panel/about', import.meta.url)),
      '@main': fileURLToPath(new URL('./src/components/panel/main', import.meta.url)),
      '@models': fileURLToPath(new URL('./src/models', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "public/_variables.scss";
          @import "public/_global.scss";
        `
      }
    }
  }
})
