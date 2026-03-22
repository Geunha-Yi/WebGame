<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const canvas = ref<HTMLCanvasElement | null>(null)
const W = 400
const H = 300
const scoreP = ref(0)
const scoreAi = ref(0)
let raf = 0
let running = true

let py = H / 2 - 35
const ph = 70
const pw = 10
let aiY = H / 2 - 35
let bx = W / 2
let by = H / 2
let bvx = 4.2
let bvy = 2.8

const keys = { up: false, down: false }

function resetBall(dir: number) {
  bx = W / 2
  by = H / 2
  bvx = 4.2 * dir
  bvy = (Math.random() * 2 - 1) * 3
}

function loop() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx || !running) return

  if (keys.up) py = Math.max(0, py - 6)
  if (keys.down) py = Math.min(H - ph, py + 6)

  const target = by - ph / 2
  aiY += Math.sign(target - aiY) * Math.min(4.8, Math.abs(target - aiY))

  bx += bvx
  by += bvy

  if (by < 8 || by > H - 8) bvy *= -1

  if (bx < 24 + pw && by > py && by < py + ph && bvx < 0) {
    bvx *= -1.05
    bx = 24 + pw
  }
  if (bx > W - 24 - pw && by > aiY && by < aiY + ph && bvx > 0) {
    bvx *= -1.05
    bx = W - 24 - pw
  }

  if (bx < 0) {
    scoreAi.value++
    resetBall(1)
  } else if (bx > W) {
    scoreP.value++
    resetBall(-1)
  }

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)
  ctx.setLineDash([6, 10])
  ctx.strokeStyle = '#334155'
  ctx.beginPath()
  ctx.moveTo(W / 2, 0)
  ctx.lineTo(W / 2, H)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#38bdf8'
  ctx.fillRect(16, py, pw, ph)
  ctx.fillStyle = '#f472b6'
  ctx.fillRect(W - 16 - pw, aiY, pw, ph)

  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(bx, by, 7, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#e8edf7'
  ctx.font = '24px sans-serif'
  ctx.fillText(String(scoreP.value), W / 2 - 40, 32)
  ctx.fillText(String(scoreAi.value), W / 2 + 24, 32)

  raf = requestAnimationFrame(loop)
}

function onDown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') keys.up = true
  if (e.key === 'ArrowDown') keys.down = true
}
function onUp(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') keys.up = false
  if (e.key === 'ArrowDown') keys.down = false
}

onMounted(() => {
  window.addEventListener('keydown', onDown)
  window.addEventListener('keyup', onUp)
  resetBall(Math.random() < 0.5 ? 1 : -1)
  loop()
})
onUnmounted(() => {
  running = false
  cancelAnimationFrame(raf)
  window.removeEventListener('keydown', onDown)
  window.removeEventListener('keyup', onUp)
})
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>퐁</h1>
    <p class="hint">↑↓ 키로 왼쪽 패들. 먼저 5점을 내면 승리에 가까워집니다.</p>
    <p class="score">플레이어 {{ scoreP }} — AI {{ scoreAi }}</p>
    <canvas ref="canvas" :width="W" :height="H" class="cv" />
  </div>
</template>

<style scoped>
.back {
  color: #7ecbff;
  text-decoration: none;
  font-size: 0.9rem;
}
h1 {
  margin: 0.5rem 0 0.25rem;
  font-size: 1.35rem;
}
.hint {
  margin: 0 0 0.35rem;
  color: #8b95ad;
  font-size: 0.85rem;
}
.score {
  margin: 0 0 0.5rem;
  font-weight: 600;
}
.cv {
  max-width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
