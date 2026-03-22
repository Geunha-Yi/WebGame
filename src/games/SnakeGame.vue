<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const GRID = 15
const cell = ref(0)
const snake = ref<{ x: number; y: number }[]>([{ x: 7, y: 7 }])
const dir = ref({ x: 1, y: 0 })
const nextDir = ref({ x: 1, y: 0 })
const food = ref({ x: 3, y: 3 })
const score = ref(0)
const gameOver = ref(false)
const running = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

function placeFood() {
  const occupied = new Set(snake.value.map((s) => `${s.x},${s.y}`))
  let x = 0
  let y = 0
  do {
    x = Math.floor(Math.random() * GRID)
    y = Math.floor(Math.random() * GRID)
  } while (occupied.has(`${x},${y}`))
  food.value = { x, y }
}

function reset() {
  if (timer) clearInterval(timer)
  timer = null
  snake.value = [{ x: 7, y: 7 }]
  dir.value = { x: 1, y: 0 }
  nextDir.value = { x: 1, y: 0 }
  score.value = 0
  gameOver.value = false
  placeFood()
  running.value = true
  timer = setInterval(tick, 120)
}

function tick() {
  if (gameOver.value) return
  dir.value = { ...nextDir.value }
  const head = snake.value[0]
  const nx = head.x + dir.value.x
  const ny = head.y + dir.value.y
  if (nx < 0 || nx >= GRID || ny < 0 || ny >= GRID) {
    end()
    return
  }
  if (snake.value.some((s) => s.x === nx && s.y === ny)) {
    end()
    return
  }
  const newHead = { x: nx, y: ny }
  snake.value = [newHead, ...snake.value]
  if (nx === food.value.x && ny === food.value.y) {
    score.value += 10
    placeFood()
  } else {
    snake.value.pop()
  }
}

function end() {
  gameOver.value = true
  running.value = false
  if (timer) clearInterval(timer)
  timer = null
}

function onKey(e: KeyboardEvent) {
  const k = e.key
  if (k === 'ArrowUp' && dir.value.y !== 1) nextDir.value = { x: 0, y: -1 }
  else if (k === 'ArrowDown' && dir.value.y !== -1) nextDir.value = { x: 0, y: 1 }
  else if (k === 'ArrowLeft' && dir.value.x !== 1) nextDir.value = { x: -1, y: 0 }
  else if (k === 'ArrowRight' && dir.value.x !== -1) nextDir.value = { x: 1, y: 0 }
}

onMounted(() => {
  reset()
  window.addEventListener('keydown', onKey)
  cell.value = Math.min(24, Math.floor((window.innerWidth - 48) / GRID))
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>스네이크</h1>
    <p class="hint">방향키로 이동 · 벽이나 자신에게 닿으면 종료</p>
    <div class="bar">
      <span>점수 {{ score }}</span>
      <button type="button" @click="reset">다시 시작</button>
    </div>
    <div
      class="board"
      :style="{
        gridTemplateColumns: `repeat(${GRID}, ${cell}px)`,
        gridTemplateRows: `repeat(${GRID}, ${cell}px)`,
      }"
    >
      <template v-for="y in GRID" :key="y">
        <div
          v-for="x in GRID"
          :key="`${x}-${y}`"
          class="cell"
          :class="{
            head: snake[0]?.x === x - 1 && snake[0]?.y === y - 1,
            body: snake.some((s, i) => i > 0 && s.x === x - 1 && s.y === y - 1),
            food: food.x === x - 1 && food.y === y - 1,
          }"
        />
      </template>
    </div>
    <p v-if="gameOver" class="over">게임 오버!</p>
  </div>
</template>

<style scoped>
.game-page {
  max-width: 100%;
}
.back {
  color: #7ecbff;
  text-decoration: none;
  font-size: 0.9rem;
}
.back:hover {
  text-decoration: underline;
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
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.bar button {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.4);
  background: rgba(126, 203, 255, 0.12);
  color: #e8edf7;
}
.board {
  display: grid;
  gap: 2px;
  background: #1e2a48;
  padding: 4px;
  border-radius: 8px;
  width: fit-content;
}
.cell {
  background: #141c30;
  border-radius: 3px;
}
.cell.head {
  background: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.5);
}
.cell.body {
  background: #22c55e;
}
.cell.food {
  background: #f87171;
  border-radius: 50%;
}
.over {
  color: #f87171;
  font-weight: 600;
  margin-top: 0.75rem;
}
</style>
