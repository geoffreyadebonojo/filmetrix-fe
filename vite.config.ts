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
      '@panel': fileURLToPath(new URL('./src/components/panel', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "public/_variables.scss";`
      }
    }
  }
})
