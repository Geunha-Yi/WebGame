<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const symbols = ['🍎', '🍌', '🍇', '🍊', '🥝', '🍓', '🍑', '🥥']
const cards = ref<{ id: number; sym: string; flipped: boolean; matched: boolean }[]>([])
const first = ref<number | null>(null)
const lock = ref(false)
const moves = ref(0)

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function newGame() {
  const pairs = [...symbols, ...symbols]
  const syms = shuffle(pairs)
  cards.value = syms.map((sym, id) => ({ id, sym, flipped: false, matched: false }))
  first.value = null
  lock.value = false
  moves.value = 0
}

function onCard(i: number) {
  const c = cards.value[i]
  if (lock.value || c.flipped || c.matched) return
  c.flipped = true
  if (first.value === null) {
    first.value = i
    return
  }
  moves.value++
  const j = first.value
  first.value = null
  if (cards.value[j].sym === c.sym) {
    cards.value[j].matched = true
    c.matched = true
  } else {
    lock.value = true
    setTimeout(() => {
      cards.value[j].flipped = false
      c.flipped = false
      lock.value = false
    }, 550)
  }
}

const done = computed(() => cards.value.length > 0 && cards.value.every((c) => c.matched))

newGame()
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>기억력 카드</h1>
    <div class="bar">
      <span>이동 {{ moves }}회</span>
      <button type="button" @click="newGame">새 게임</button>
    </div>
    <p v-if="done" class="win">전부 맞췄습니다!</p>
    <div class="grid">
      <button
        v-for="(c, i) in cards"
        :key="c.id"
        type="button"
        class="card"
        :class="{ flipped: c.flipped || c.matched, matched: c.matched }"
        @click="onCard(i)"
      >
        <span class="front">?</span>
        <span class="back">{{ c.sym }}</span>
      </button>
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
  margin: 0.5rem 0;
  font-size: 1.35rem;
}
.bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
}
.bar button {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.4);
  background: rgba(126, 203, 255, 0.12);
  color: #e8edf7;
}
.win {
  color: #4ade80;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  max-width: 320px;
}
.card {
  aspect-ratio: 1;
  position: relative;
  border: none;
  border-radius: 10px;
  background: #1e2a48;
  color: #e8edf7;
  font-size: 1.75rem;
  perspective: 400px;
  transform-style: preserve-3d;
  transition: transform 0.35s ease;
}
.card.flipped {
  transform: rotateY(180deg);
}
.card.matched {
  opacity: 0.85;
  outline: 2px solid #4ade80;
}
.front,
.back {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border-radius: 10px;
}
.front {
  background: linear-gradient(160deg, #2a3f6b, #1a2744);
  font-weight: 700;
  color: #7ecbff;
}
.back {
  transform: rotateY(180deg);
  background: #243352;
}
</style>
