<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

type Phase = 'idle' | 'wait' | 'go' | 'early'
const phase = ref<Phase>('idle')
const best = ref<number | null>(null)
const last = ref<number | null>(null)
let startAt = 0
let timeoutId: ReturnType<typeof setTimeout> | null = null

function clearT() {
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = null
}

function startRound() {
  clearT()
  phase.value = 'wait'
  last.value = null
  const delay = 1500 + Math.random() * 2500
  timeoutId = setTimeout(() => {
    phase.value = 'go'
    startAt = performance.now()
  }, delay)
}

function tap() {
  if (phase.value === 'idle') {
    startRound()
    return
  }
  if (phase.value === 'wait') {
    clearT()
    phase.value = 'early'
    last.value = null
    return
  }
  if (phase.value === 'go') {
    const ms = Math.round(performance.now() - startAt)
    last.value = ms
    if (best.value === null || ms < best.value) best.value = ms
    phase.value = 'idle'
    return
  }
  if (phase.value === 'early') {
    phase.value = 'idle'
  }
}
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>반응 속도</h1>
    <p class="hint">화면이 초록색이 되면 클릭하세요. 너무 빠르면 실패입니다.</p>
    <div class="stats">
      <span>최고 {{ best == null ? '—' : best + 'ms' }}</span>
      <span>직전 {{ last == null ? '—' : last + 'ms' }}</span>
    </div>
    <button
      type="button"
      class="pad"
      :class="phase"
      @click="tap"
    >
      <span v-if="phase === 'idle'">클릭해서 시작</span>
      <span v-else-if="phase === 'wait'">기다리세요…</span>
      <span v-else-if="phase === 'go'">지금!</span>
      <span v-else-if="phase === 'early'">너무 빨랐어요</span>
    </button>
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
.stats {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 0.75rem;
  font-variant-numeric: tabular-nums;
}
.pad {
  width: 100%;
  max-width: 360px;
  min-height: 160px;
  border: none;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  transition: background 0.12s ease;
}
.pad.idle {
  background: #64748b;
  color: #f8fafc;
}
.pad.wait {
  background: #dc2626;
  color: #fff;
}
.pad.go {
  background: #22c55e;
  color: #052e16;
}
.pad.early {
  background: #eab308;
  color: #422006;
}
</style>
