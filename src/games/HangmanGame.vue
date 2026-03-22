<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const words = [
  'VUE',
  'SCRIPT',
  'BROWSER',
  'ARCADE',
  'PIXEL',
  'GITHUB',
  'ROUTER',
  'CANVAS',
]
const word = ref('')
const guessed = ref<Record<string, boolean>>({})
const wrong = ref(0)
const maxWrong = 7
const won = ref(false)
const lost = ref(false)

const display = computed(() =>
  [...word.value].map((ch) => (guessed.value[ch] ? ch : '_')).join(' '),
)

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function newGame() {
  word.value = words[Math.floor(Math.random() * words.length)]
  guessed.value = {}
  wrong.value = 0
  won.value = false
  lost.value = false
}

function guess(ch: string) {
  if (won.value || lost.value || guessed.value[ch]) return
  guessed.value = { ...guessed.value, [ch]: true }
  if (!word.value.includes(ch)) wrong.value++
  const all = [...word.value].every((c) => guessed.value[c])
  if (all) won.value = true
  if (wrong.value >= maxWrong) lost.value = true
}

newGame()
</script>

<template>
  <div class="game-page">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>행맨</h1>
    <p class="hint">영어 대문자 단어를 맞혀 보세요.</p>
    <p class="word">{{ display }}</p>
    <p class="meta">틀린 횟수 {{ wrong }} / {{ maxWrong }}</p>
    <p v-if="won" class="end win">정답!</p>
    <p v-if="lost" class="end lose">정답은 {{ word }}</p>
    <div class="keys">
      <button
        v-for="ch in alphabet"
        :key="ch"
        type="button"
        class="key"
        :disabled="!!guessed[ch] || won || lost"
        @click="guess(ch)"
      >
        {{ ch }}
      </button>
    </div>
    <button class="again" type="button" @click="newGame">새 단어</button>
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
.word {
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.meta {
  color: #8b95ad;
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
.keys {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 1rem 0;
  max-width: 360px;
}
.key {
  width: 32px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid rgba(126, 203, 255, 0.25);
  background: #1a243c;
  color: #e8edf7;
  font-size: 0.8rem;
}
.key:disabled {
  opacity: 0.35;
}
.again {
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.4);
  background: rgba(126, 203, 255, 0.12);
  color: #e8edf7;
}
</style>
