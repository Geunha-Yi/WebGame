<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const ROWS = 9
const COLS = 9
const MINES = 10

type Cell = { mine: boolean; rev: boolean; flag: boolean; n: number }
const grid = ref<Cell[][]>([])
const lost = ref(false)
const won = ref(false)
const first = ref(true)

function neighbors(x: number, y: number) {
  const out: [number, number][] = []
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) out.push([nx, ny])
    }
  return out
}

function placeMines(safeX: number, safeY: number) {
  const mines = new Set<string>()
  while (mines.size < MINES) {
    const x = Math.floor(Math.random() * COLS)
    const y = Math.floor(Math.random() * ROWS)
    if (Math.abs(x - safeX) <= 1 && Math.abs(y - safeY) <= 1) continue
    mines.add(`${x},${y}`)
  }
  const g: Cell[][] = []
  for (let y = 0; y < ROWS; y++) {
    g[y] = []
    for (let x = 0; x < COLS; x++) {
      const m = mines.has(`${x},${y}`)
      let n = 0
      if (!m) for (const [nx, ny] of neighbors(x, y)) if (mines.has(`${nx},${ny}`)) n++
      g[y][x] = { mine: m, rev: false, flag: false, n }
    }
  }
  grid.value = g
}

function reveal(x: number, y: number) {
  if (lost.value || won.value) return
  if (first.value) {
    placeMines(x, y)
    first.value = false
  }
  const cell = grid.value[y][x]
  if (cell.rev || cell.flag) return
  if (cell.mine) {
    lost.value = true
    for (let yy = 0; yy < ROWS; yy++)
      for (let xx = 0; xx < COLS; xx++) if (grid.value[yy][xx].mine) grid.value[yy][xx].rev = true
    return
  }
  cell.rev = true
  if (cell.n === 0) {
    for (const [nx, ny] of neighbors(x, y)) reveal(nx, ny)
  }
  checkWin()
}

function checkWin() {
  let hidden = 0
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) {
      const c = grid.value[y][x]
      if (!c.mine && !c.rev) hidden++
    }
  if (hidden === 0) won.value = true
}

function flag(x: number, y: number, e: MouseEvent) {
  e.preventDefault()
  if (lost.value || won.value) return
  const c = grid.value[y][x]
  if (c.rev) return
  c.flag = !c.flag
}

function reset() {
  grid.value = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      rev: false,
      flag: false,
      n: 0,
    })),
  )
  lost.value = false
  won.value = false
  first.value = true
}

reset()
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>지뢰찾기</h1>
    <p class="hint">좌클릭 열기 · 우클릭 깃발 ({{ MINES }}개 지뢰)</p>
    <p v-if="won" class="end win">승리!</p>
    <p v-if="lost" class="end lose">지뢰를 밟았습니다.</p>
    <button class="again" type="button" @click="reset">새 판</button>
    <div class="board">
      <div v-for="(row, y) in grid" :key="y" class="row">
        <button
          v-for="(c, x) in row"
          :key="x"
          type="button"
          class="cell"
          :class="{
            rev: c.rev,
            flag: c.flag && !c.rev,
            mine: c.rev && c.mine,
            n0: c.rev && !c.mine && c.n === 0,
          }"
          @click="reveal(x, y)"
          @contextmenu="flag(x, y, $event)"
        >
          <span v-if="c.rev && !c.mine && c.n">{{ c.n }}</span>
          <span v-if="c.flag && !c.rev">🚩</span>
          <span v-if="c.rev && c.mine">💣</span>
        </button>
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
  margin: 0 0 0.5rem;
  color: #8b95ad;
  font-size: 0.85rem;
}
.end {
  font-weight: 700;
}
.end.win {
  color: #4ade80;
}
.end.lose {
  color: #f87171;
}
.again {
  margin-bottom: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.4);
  background: rgba(126, 203, 255, 0.12);
  color: #e8edf7;
}
.board {
  display: inline-flex;
  flex-direction: column;
  gap: 3px;
  background: #1e293b;
  padding: 6px;
  border-radius: 8px;
}
.row {
  display: flex;
  gap: 3px;
}
.cell {
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  border-radius: 4px;
  background: #334155;
  color: #e2e8f0;
}
.cell.rev {
  background: #1e293b;
}
.cell.rev.n0 {
  color: transparent;
}
.cell.flag {
  background: #475569;
}
.cell.mine {
  background: #7f1d1d;
}
</style>
