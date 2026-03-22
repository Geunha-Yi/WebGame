<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const holes = 9
const active = ref<number | null>(null)
const score = ref(0)
const timeLeft = ref(30)
const playing = ref(false)
let spawnTimer: ReturnType<typeof setInterval> | null = null
let countdown: ReturnType<typeof setInterval> | null = null

function randomHole() {
  return Math.floor(Math.random() * holes)
}

function spawn() {
  active.value = randomHole()
  setTimeout(() => {
    if (playing.value) active.value = null
  }, 600)
}

function start() {
  stop()
  score.value = 0
  timeLeft.value = 30
  playing.value = true
  spawnTimer = setInterval(spawn, 900)
  countdown = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) stop()
  }, 1000)
}

function stop() {
  playing.value = false
  active.value = null
  if (spawnTimer) clearInterval(spawnTimer)
  if (countdown) clearInterval(countdown)
  spawnTimer = null
  countdown = null
}

function hit(i: number) {
  if (!playing.value || active.value !== i) return
  score.value++
  active.value = null
}

onUnmounted(() => stop())
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>두더지 잡기</h1>
    <p class="hint">30초 안에 최대한 많이 클릭하세요.</p>
    <div class="bar">
      <span>점수 {{ score }}</span>
      <span>남은 시간 {{ timeLeft }}초</span>
      <button v-if="!playing" type="button" @click="start">시작</button>
      <button v-else type="button" @click="stop">중지</button>
    </div>
    <div class="field">
      <button
        v-for="i in holes"
        :key="i"
        type="button"
        class="hole"
        :class="{ up: active === i - 1 }"
        @click="hit(i - 1)"
      >
        <span class="mole">🦫</span>
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
  gap: 0.75rem 1rem;
  align-items: center;
  margin-bottom: 1rem;
}
.bar button {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.4);
  background: rgba(126, 203, 255, 0.12);
  color: #e8edf7;
}
.field {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
  max-width: 280px;
}
.hole {
  aspect-ratio: 1;
  border-radius: 50%;
  border: 3px solid #3d4f73;
  background: radial-gradient(circle at 30% 30%, #2a3755, #141c30);
  position: relative;
  overflow: hidden;
  padding: 0;
}
.mole {
  display: block;
  font-size: 2rem;
  transform: translateY(110%);
  transition: transform 0.12s ease;
}
.hole.up .mole {
  transform: translateY(15%);
}
</style>
