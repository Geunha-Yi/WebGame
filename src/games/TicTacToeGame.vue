<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

type Cell = 'X' | 'O' | ''
type Result = Cell | 'draw' | null

const board = ref<Cell[]>(Array(9).fill(''))
const human = ref<'X' | 'O'>('X')
const turn = ref<'X' | 'O'>('X')
const gameOver = ref(false)
const winner = ref<Cell | 'draw' | ''>('')

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function checkWin(b: Cell[]): Result {
  for (const [a, c, d] of lines) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]
  }
  if (b.every((x) => x)) return 'draw'
  return null
}

function bestMove(b: Cell[]): number {
  const ai: 'X' | 'O' = human.value === 'X' ? 'O' : 'X'
  const hu = human.value
  let best = -1
  let bestScore = -Infinity
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue
    const nb = [...b] as Cell[]
    nb[i] = ai
    const sc = minimax(nb, false, ai, hu)
    if (sc > bestScore) {
      bestScore = sc
      best = i
    }
  }
  return best
}

function minimax(b: Cell[], isMax: boolean, ai: 'X' | 'O', hu: 'X' | 'O'): number {
  const w = checkWin(b)
  if (w === ai) return 1
  if (w === hu) return -1
  if (w === 'draw') return 0
  let best = isMax ? -Infinity : Infinity
  const cur = isMax ? ai : hu
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue
    const nb = [...b] as Cell[]
    nb[i] = cur
    const sc = minimax(nb, !isMax, ai, hu)
    best = isMax ? Math.max(best, sc) : Math.min(best, sc)
  }
  return best
}

function click(i: number) {
  if (gameOver.value || board.value[i] || turn.value !== human.value) return
  board.value[i] = human.value
  const w = checkWin(board.value)
  if (w) {
    end(w)
    return
  }
  turn.value = human.value === 'X' ? 'O' : 'X'
  setTimeout(aiPlay, 200)
}

function aiPlay() {
  if (gameOver.value) return
  const ai = human.value === 'X' ? 'O' : 'X'
  if (turn.value !== ai) return
  const i = bestMove(board.value)
  if (i < 0) return
  board.value[i] = ai
  const w = checkWin(board.value)
  if (w) {
    end(w)
    return
  }
  turn.value = human.value
}

function end(w: Exclude<Result, null>) {
  gameOver.value = true
  winner.value = w === 'draw' ? 'draw' : w
}

function reset() {
  board.value = Array(9).fill('')
  turn.value = 'X'
  gameOver.value = false
  winner.value = ''
  if (human.value === 'O') setTimeout(aiPlay, 200)
}

const status = computed(() => {
  if (winner.value === 'draw') return '무승부'
  if (winner.value) return `승자: ${winner.value}`
  return turn.value === human.value ? '당신 차례' : '컴퓨터 생각 중…'
})
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>틱택토</h1>
    <p class="hint">당신은 {{ human }}, 컴퓨터는 {{ human === 'X' ? 'O' : 'X' }}</p>
    <div class="opts">
      <label>플레이어: </label>
      <button type="button" :class="{ on: human === 'X' }" @click="human = 'X'; reset()">X</button>
      <button type="button" :class="{ on: human === 'O' }" @click="human = 'O'; reset()">O</button>
    </div>
    <p class="status">{{ status }}</p>
    <div class="grid">
      <button
        v-for="(c, i) in board"
        :key="i"
        type="button"
        class="cell"
        :disabled="!!c || gameOver"
        @click="click(i)"
      >
        {{ c }}
      </button>
    </div>
    <button class="again" type="button" @click="reset">다시 하기</button>
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
.opts {
  margin-bottom: 0.5rem;
}
.opts button {
  margin-left: 0.35rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #3d4f73;
  background: #1e2a48;
  color: #9aa4bc;
}
.opts button.on {
  border-color: #7ecbff;
  color: #7ecbff;
}
.status {
  font-weight: 600;
  margin: 0.5rem 0;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 72px);
  gap: 6px;
}
.cell {
  height: 72px;
  font-size: 1.75rem;
  font-weight: 700;
  border-radius: 10px;
  border: 1px solid rgba(126, 203, 255, 0.25);
  background: #1a243c;
  color: #e8edf7;
}
.cell:disabled {
  opacity: 1;
}
.again {
  margin-top: 1rem;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.4);
  background: rgba(126, 203, 255, 0.12);
  color: #e8edf7;
}
</style>
