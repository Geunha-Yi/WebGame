import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages project site: https://<user>.github.io/WebGame/
export default defineConfig({
  base: '/WebGame/',
  plugins: [vue()],
})
