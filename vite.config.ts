import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 프로덕션: GitHub Pages 프로젝트 사이트 https://<user>.github.io/WebGame/
// 개발: base를 '/'로 두어 http://localhost:5173/ 에서 바로 동작하게 함
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/WebGame/' : '/',
  plugins: [vue()],
}))
