/**
 * GitHub Pages는 존재하지 않는 경로 요청 시 404.html을 제공한다.
 * SPA 새로고침 시에도 index와 동일한 엔트리를 쓰도록 복사한다.
 */
import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const dist = join(process.cwd(), 'dist')
const index = join(dist, 'index.html')
const notFound = join(dist, '404.html')

if (!existsSync(index)) {
  console.error('copy-404: dist/index.html 이 없습니다. 먼저 vite build 를 실행하세요.')
  process.exit(1)
}
copyFileSync(index, notFound)
console.log('copy-404: dist/404.html 생성됨')
