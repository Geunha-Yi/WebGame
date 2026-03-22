<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const canvas = ref<HTMLCanvasElement | null>(null)
const score = ref(0)
const lives = ref(3)
const msg = ref('')
let raf = 0
let running = false

const W = 400
const H = 480
let paddleX = W / 2 - 50
const paddleW = 100
const paddleH = 10
let ballX = W / 2
let ballY = H - 60
let vx = 3.2
let vy = -3.2
const ballR = 7
const rows = 5
const cols = 8
const brickW = (W - 20) / cols - 4
const brickH = 22
let bricks: boolean[][] = []

function initBricks() {
  bricks = []
  for (let r = 0; r < rows; r++) {
    bricks[r] = []
    for (let c = 0; c < cols; c++) bricks[r][c] = true
  }
}

function resetBall() {
  ballX = W / 2
  ballY = H - 60
  const angle = (Math.random() * 0.5 + 0.25) * Math.PI
  vx = 3.5 * Math.cos(angle) * (Math.random() < 0.5 ? -1 : 1)
  vy = -Math.abs(3.5 * Math.sin(angle))
}

function loop() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx || !running) return
  if (keys.left) paddleX = Math.max(0, paddleX - 8)
  if (keys.right) paddleX = Math.min(W - paddleW, paddleX + 8)

  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, W, H)

  ballX += vx
  ballY += vy

  if (ballX < ballR || ballX > W - ballR) vx *= -1
  if (ballY < ballR) vy *= -1

  if (ballY > H - ballR - paddleH - 5 && ballX > paddleX && ballX < paddleX + paddleW && vy > 0) {
    vy *= -1
    ballY = H - ballR - paddleH - 5
    const hit = (ballX - (paddleX + paddleW / 2)) / (paddleW / 2)
    vx += hit * 2
  }

  if (ballY > H) {
    lives.value--
    if (lives.value <= 0) {
      running = false
      msg.value = '게임 오버'
      return
    }
    resetBall()
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!bricks[r][c]) continue
      const bx = 10 + c * (brickW + 4)
      const by = 40 + r * (brickH + 4)
      if (
        ballX > bx &&
        ballX < bx + brickW &&
        ballY - ballR < by + brickH &&
        ballY + ballR > by
      ) {
        bricks[r][c] = false
        score.value += 10
        vy *= -1
        break
      }
    }
  }

  let left = 0
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (bricks[r][c]) left++
  if (left === 0) {
    running = false
    msg.value = '클리어!'
    return
  }

  ctx.fillStyle = '#38bdf8'
  ctx.fillRect(paddleX, H - 30, paddleW, paddleH)

  ctx.beginPath()
  ctx.arc(ballX, ballY, ballR, 0, Math.PI * 2)
  ctx.fillStyle = '#fbbf24'
  ctx.fill()

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!bricks[r][c]) continue
      const bx = 10 + c * (brickW + 4)
      const by = 40 + r * (brickH + 4)
      ctx.fillStyle = `hsl(${r * 40 + c * 8}, 70%, 55%)`
      ctx.fillRect(bx, by, brickW, brickH)
    }
  }

  raf = requestAnimationFrame(loop)
}

const keys = { left: false, right: false } as { left: boolean; right: boolean }

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') keys.left = true
  if (e.key === 'ArrowRight') keys.right = true
}

function onKeyUp(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') keys.left = false
  if (e.key === 'ArrowRight') keys.right = false
}

function start() {
  msg.value = ''
  score.value = 0
  lives.value = 3
  initBricks()
  paddleX = W / 2 - 50
  resetBall()
  running = true
  cancelAnimationFrame(raf)
  loop()
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  start()
})
onUnmounted(() => {
  running = false
  cancelAnimationFrame(raf)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
})
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>브레이크아웃</h1>
    <p class="hint">좌우 방향키로 패들 이동</p>
    <div class="bar">
      <span>점수 {{ score }}</span>
      <span>생명 {{ lives }}</span>
      <button type="button" @click="start">다시 시작</button>
    </div>
    <p v-if="msg" class="msg">{{ msg }}</p>
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
  margin: 0 0 0.75rem;
  color: #8b95ad;
  font-size: 0.85rem;
}
.bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}
.bar button {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.4);
  background: rgba(126, 203, 255, 0.12);
  color: #e8edf7;
}
.msg {
  color: #4ade80;
  font-weight: 600;
}
.cv {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
