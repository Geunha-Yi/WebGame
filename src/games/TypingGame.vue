<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const phrases = [
  'VUE IS GREAT',
  'TYPE FAST BUT ACCURATE',
  'GITHUB PAGES DEPLOY',
  'MINI GAMES IN BROWSER',
  'DARK MODE ARCADE',
]
const target = ref('')
const input = ref('')
const started = ref(false)
const done = ref(false)
const t0 = ref(0)
const wpm = ref<number | null>(null)

function pick() {
  target.value = phrases[Math.floor(Math.random() * phrases.length)]
  input.value = ''
  started.value = false
  done.value = false
  wpm.value = null
}

function onInput() {
  if (!started.value && input.value.length) {
    started.value = true
    t0.value = performance.now()
  }
  if (input.value === target.value) {
    done.value = true
    const sec = (performance.now() - t0.value) / 1000
    const words = target.value.split(' ').length
    wpm.value = Math.round((words / sec) * 60)
  }
}

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => pick())

function focusBox() {
  inputRef.value?.focus()
}
</script>

<template>
  <div class="game-page" @click="focusBox">
    <RouterLink class="back" to="/">← 목록</RouterLink>
    <h1>타자 연습</h1>
    <p class="hint">아래 문장을 정확히 입력하세요. 완료 시 분당 단어 수를 표시합니다.</p>
    <p class="target">
      <span
        v-for="(ch, i) in target"
        :key="i"
        :class="{
          ok: i < input.length && input[i] === ch,
          bad: i < input.length && input[i] !== ch,
          dim: i >= input.length,
        }"
        >{{ ch === ' ' ? '·' : ch }}</span
      >
    </p>
    <input
      ref="inputRef"
      v-model="input"
      class="field"
      type="text"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      :disabled="done"
      @input="onInput"
    />
    <p v-if="done" class="result">완료! 대략 {{ wpm }} WPM</p>
    <button type="button" class="again" @click="pick">다음 문장</button>
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
.target {
  font-family: ui-monospace, monospace;
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  line-height: 1.6;
  margin: 0 0 0.75rem;
  word-break: break-all;
}
.target .ok {
  color: #4ade80;
}
.target .bad {
  color: #f87171;
}
.target .dim {
  color: #475569;
}
.field {
  width: 100%;
  max-width: 420px;
  padding: 0.5rem 0.65rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.35);
  background: #0f172a;
  color: #e8edf7;
  font-family: ui-monospace, monospace;
  font-size: 1rem;
}
.result {
  color: #7ecbff;
  font-weight: 600;
  margin-top: 0.75rem;
}
.again {
  margin-top: 0.75rem;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  border: 1px solid rgba(126, 203, 255, 0.4);
  background: rgba(126, 203, 255, 0.12);
  color: #e8edf7;
}
</style>
