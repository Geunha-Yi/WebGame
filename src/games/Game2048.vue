<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const SIZE = 4
const grid = ref<number[][]>([])
const score = ref(0)
const lost = ref(false)

function empty(): number[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
}

function addRandom() {
  const empties: [number, number][] = []
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) if (grid.value[y][x] === 0) empties.push([x, y])
  if (!empties.length) return false
  const [x, y] = empties[Math.floor(Math.random() * empties.length)]
  grid.value[y][x] = Math.random() < 0.9 ? 2 : 4
  return true
}

function newGame() {
  grid.value = empty()
  score.value = 0
  lost.value = false
  addRandom()
  addRandom()
}

function slideLine(line: number[]): { line: number[]; gained: number } {
  const filtered = line.filter((n) => n !== 0)
  const out: number[] = []
  let gained = 0
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const v = filtered[i] * 2
      out.push(v)
      gained += v
      i++
    } else out.push(filtered[i])
  }
  while (out.length < SIZE) out.push(0)
  return { line: out, gained }
}

function move(dir: 'left' | 'right' | 'up' | 'down') {
  const before = JSON.stringify(grid.value)
  let gained = 0
  if (dir === 'left' || dir === 'right') {
    for (let y = 0; y < SIZE; y++) {
      let row = [...grid.value[y]]
      if (dir === 'right') row.reverse()
      const { line, gained: g } = slideLine(row)
      gained += g
      if (dir === 'right') line.reverse()
      grid.value[y] = line
    }
  } else {
    for (let x = 0; x < SIZE; x++) {
      let col = [0, 1, 2, 3].map((y) => grid.value[y][x])
      if (dir === 'down') col.reverse()
      const { line, gained: g } = slideLine(col)
      gained += g
      if (dir === 'down') line.reverse()
      for (let y = 0; y < SIZE; y++) grid.value[y][x] = line[y]
    }
  }
  score.value += gained
  if (JSON.stringify(grid.value) === before) return
  if (!addRandom()) checkLose()
}

function checkLose() {
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) {
      if (grid.value[y][x] === 0) return
      if (x < SIZE - 1 && grid.value[y][x] === grid.value[y][x + 1]) return
      if (y < SIZE - 1 && grid.value[y][x] === grid.value[y + 1][x]) return
    }
  lost.value = true
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') move('left')
  else if (e.key === 'ArrowRight') move('right')
  else if (e.key === 'ArrowUp') move('up')
  else if (e.key === 'ArrowDown') move('down')
}

const hasWon = computed(() => grid.value.some((row) => row.some((c) => c >= 2048)))

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})

newGame()
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>2048</h1>
    <p class="hint">방향키로 블록을 밀어 같은 숫자를 합치세요.</p>
    <div class="bar">
      <span>점수 {{ score }}</span>
      <button type="button" @click="newGame">새 게임</button>
    </div>
    <p v-if="hasWon" class="msg win">2048 달성!</p>
    <p v-if="lost" class="msg lose">더 이상 움직일 수 없습니다.</p>
    <div class="board">
      <div v-for="(row, y) in grid" :key="y" class="row">
        <div
          v-for="(cell, x) in row"
          :key="x"
          class="cell"
          :class="cell ? `n${Math.min(cell, 2048)}` : 'empty'"
        >
          {{ cell || '' }}
        </div>
      </div>
    </div>
    <div class="touch">
      <button type="button" @click="move('up')">↑</button>
      <div>
        <button type="button" @click="move('left')">←</button>
        <button type="button" @click="move('down')">↓</button>
        <button type="button" @click="move('right')">→</button>
      </div>
    </div>
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
.msg {
  font-weight: 600;
  margin: 0 0 0.5rem;
}
.msg.win {
  color: #4ade80;
}
.msg.lose {
  color: #f87171;
}
.board {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: #1a243c;
  border-radius: 10px;
}
.row {
  display: flex;
  gap: 6px;
}
.cell {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.35rem;
  color: #0f172a;
}
.cell.empty {
  background: #243352;
}
.cell.n2 {
  background: #eee4da;
}
.cell.n4 {
  background: #ede0c8;
}
.cell.n8 {
  background: #f2b179;
  color: #fff;
}
.cell.n16 {
  background: #f59563;
  color: #fff;
}
.cell.n32 {
  background: #f67c5f;
  color: #fff;
}
.cell.n64 {
  background: #f65e3b;
  color: #fff;
}
.cell.n128,
.cell.n256,
.cell.n512 {
  background: #edcf72;
  color: #fff;
  font-size: 1.1rem;
}
.cell.n1024,
.cell.n2048 {
  background: #edc22e;
  color: #fff;
  font-size: 1rem;
}
.touch {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}
.touch button {
  min-width: 48px;
  min-height: 44px;
  margin: 0.15rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.35);
  background: rgba(126, 203, 255, 0.1);
  color: #e8edf7;
  font-size: 1.1rem;
}
</style>
