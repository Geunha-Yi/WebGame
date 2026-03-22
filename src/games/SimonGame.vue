<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'] as const
const seq = ref<number[]>([])
const playing = ref(false)
const inputIdx = ref(0)
const highlight = ref<number | null>(null)
const msg = ref('')
let lock = false

function flash(i: number, ms = 420) {
  return new Promise<void>((resolve) => {
    highlight.value = i
    setTimeout(() => {
      highlight.value = null
      setTimeout(resolve, 120)
    }, ms)
  })
}

async function playSequence() {
  lock = true
  playing.value = true
  inputIdx.value = 0
  msg.value = '잘 보세요…'
  for (const s of seq.value) {
    await flash(s)
  }
  msg.value = '따라 누르세요'
  lock = false
}

function start() {
  seq.value = []
  msg.value = ''
  nextRound()
}

function nextRound() {
  seq.value.push(Math.floor(Math.random() * 4))
  playSequence()
}

async function press(i: number) {
  if (lock || !playing.value) return
  await flash(i, 200)
  const expected = seq.value[inputIdx.value]
  if (i !== expected) {
    msg.value = '틀렸습니다! 다시 시작하려면 시작 버튼을 누르세요.'
    playing.value = false
    return
  }
  inputIdx.value++
  if (inputIdx.value >= seq.value.length) {
    msg.value = `레벨 ${seq.value.length} 통과!`
    lock = true
    setTimeout(() => nextRound(), 700)
  }
}
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>사이먼</h1>
    <p class="hint">순서를 기억했다가 같은 순서로 클릭하세요.</p>
    <p class="msg">{{ msg }}</p>
    <div class="simon">
      <button
        v-for="(c, i) in colors"
        :key="i"
        type="button"
        class="btn"
        :style="{ background: c, filter: highlight === i ? 'brightness(1.35)' : 'brightness(0.65)' }"
        @click="press(i)"
      />
    </div>
    <button class="start" type="button" @click="start">시작 / 리셋</button>
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
.msg {
  min-height: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.simon {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  max-width: 260px;
}
.btn {
  aspect-ratio: 1;
  border: none;
  border-radius: 12px;
  transition: filter 0.08s ease;
}
.start {
  margin-top: 1rem;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.4);
  background: rgba(126, 203, 255, 0.12);
  color: #e8edf7;
}
</style>
