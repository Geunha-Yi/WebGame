<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

type Hand = 'rock' | 'paper' | 'scissors'
const labels: Record<Hand, string> = {
  rock: '바위 ✊',
  paper: '보 ✋',
  scissors: '가위 ✌️',
}

const player = ref<Hand | null>(null)
const cpu = ref<Hand | null>(null)
const wins = ref(0)
const losses = ref(0)
const draws = ref(0)
const last = ref<'win' | 'lose' | 'draw' | null>(null)

function play(p: Hand) {
  const choices: Hand[] = ['rock', 'paper', 'scissors']
  const c = choices[Math.floor(Math.random() * 3)]
  player.value = p
  cpu.value = c
  if (p === c) {
    last.value = 'draw'
    draws.value++
  } else if (
    (p === 'rock' && c === 'scissors') ||
    (p === 'paper' && c === 'rock') ||
    (p === 'scissors' && c === 'paper')
  ) {
    last.value = 'win'
    wins.value++
  } else {
    last.value = 'lose'
    losses.value++
  }
}

const msg = computed(() => {
  if (!last.value) return '아래에서 선택하세요.'
  if (last.value === 'draw') return '무승부'
  if (last.value === 'win') return '승리!'
  return '패배'
})
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>가위바위보</h1>
    <p class="hint">컴퓨터와 무작위 대결 — 통계가 쌓입니다.</p>
    <div class="stats">
      <span>승 {{ wins }}</span>
      <span>무 {{ draws }}</span>
      <span>패 {{ losses }}</span>
    </div>
    <div class="hands" v-if="player && cpu">
      <div>
        <div class="lab">나</div>
        <div class="big">{{ labels[player] }}</div>
      </div>
      <div>
        <div class="lab">CPU</div>
        <div class="big">{{ labels[cpu] }}</div>
      </div>
    </div>
    <p class="result" :class="last">{{ msg }}</p>
    <div class="btns">
      <button v-for="h in (['rock','paper','scissors'] as Hand[])" :key="h" type="button" @click="play(h)">
        {{ labels[h] }}
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
.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
}
.hands {
  display: flex;
  gap: 2rem;
  margin-bottom: 0.75rem;
}
.lab {
  font-size: 0.75rem;
  color: #8b95ad;
  margin-bottom: 0.25rem;
}
.big {
  font-size: 1.15rem;
  font-weight: 700;
}
.result {
  font-weight: 700;
  margin-bottom: 0.75rem;
}
.result.win {
  color: #4ade80;
}
.result.lose {
  color: #f87171;
}
.result.draw {
  color: #eab308;
}
.btns {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.btns button {
  padding: 0.5rem 0.85rem;
  border-radius: 10px;
  border: 1px solid rgba(126, 203, 255, 0.35);
  background: #1a243c;
  color: #e8edf7;
}
</style>
