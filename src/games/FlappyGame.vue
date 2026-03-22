<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const canvas = ref<HTMLCanvasElement | null>(null)
const W = 360
const H = 480
const score = ref(0)
const over = ref(false)
let raf = 0
let running = false

let birdY = H / 2
let vel = 0
const g = 0.45
const flap = -7.5
let pipes: { x: number; gapY: number }[] = []
let frame = 0

function reset() {
  birdY = H / 2
  vel = 0
  pipes = [
    { x: W + 40, gapY: 120 + Math.random() * (H - 240) },
    { x: W + 220, gapY: 120 + Math.random() * (H - 240) },
  ]
  score.value = 0
  over.value = false
  frame = 0
  running = true
  loop()
}

function loop() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx || !running) return
  frame++
  vel += g
  birdY += vel

  ctx.fillStyle = '#0c1222'
  ctx.fillRect(0, 0, W, H)

  for (const p of pipes) {
    p.x -= 2.2
    const gap = 110
    const w = 44
    ctx.fillStyle = '#22c55e'
    ctx.fillRect(p.x, 0, w, p.gapY - gap / 2)
    ctx.fillRect(p.x, p.gapY + gap / 2, w, H)
    if (p.x + w < 0) {
      p.x = W + 40 + Math.random() * 60
      p.gapY = 120 + Math.random() * (H - 240)
      score.value++
    }
    if (
      p.x < 70 &&
      p.x + w > 34 &&
      (birdY < p.gapY - gap / 2 || birdY > p.gapY + gap / 2)
    ) {
      running = false
      over.value = true
      return
    }
  }

  if (birdY < 8 || birdY > H - 8) {
    running = false
    over.value = true
    return
  }

  ctx.fillStyle = '#fbbf24'
  ctx.beginPath()
  ctx.arc(48, birdY, 10, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#e8edf7'
  ctx.font = 'bold 20px sans-serif'
  ctx.fillText(String(score.value), 16, 28)

  raf = requestAnimationFrame(loop)
}

function jump() {
  if (!running && over.value) {
    reset()
    return
  }
  vel = flap
}

function onKey(e: KeyboardEvent) {
  if (e.code === 'Space') {
    e.preventDefault()
    jump()
  }
}

onMounted(() => {
  reset()
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  running = false
  cancelAnimationFrame(raf)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>플래피</h1>
    <p class="hint">클릭 또는 스페이스로 위로 — 장애물을 피하세요.</p>
    <canvas
      ref="canvas"
      :width="W"
      :height="H"
      class="cv"
      @click="jump"
    />
    <p v-if="over" class="over">충돌! 캔버스를 눌러 재시작</p>
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
  margin: 0 0 0.75rem;
  color: #8b95ad;
  font-size: 0.85rem;
}
.cv {
  max-width: 100%;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.over {
  color: #f87171;
  font-weight: 600;
}
</style>
