<script setup lang="ts">
import { RouterLink } from 'vue-router'

const games = [
  { to: '/snake', title: '스네이크', desc: '방향키로 먹이를 먹으며 성장', tag: '아케이드' },
  { to: '/memory', title: '기억력 카드', desc: '같은 그림 짝 맞추기', tag: '퍼즐' },
  { to: '/whack', title: '두더지 잡기', desc: '제한 시간 안에 두더지 클릭', tag: '반응' },
  { to: '/2048', title: '2048', desc: '블록을 합쳐 2048 만들기', tag: '퍼즐' },
  { to: '/breakout', title: '브레이크아웃', desc: '공으로 벽돌 깨기', tag: '아케이드' },
  { to: '/tic-tac-toe', title: '틱택토', desc: '3줄 완성 vs 컴퓨터', tag: '전략' },
  { to: '/reaction', title: '반응 속도', desc: '초록색이 될 때 클릭', tag: '반응' },
  { to: '/simon', title: '사이먼', desc: '빛·소리 순서 기억하기', tag: '기억' },
  { to: '/hangman', title: '행맨', desc: '단어 맞히기', tag: '단어' },
  { to: '/flappy', title: '플래피', desc: '장애물 사이를 통과', tag: '엔드리스' },
  { to: '/pong', title: '퐁', desc: '패들로 공 튕기기', tag: '스포츠' },
  { to: '/minesweeper', title: '지뢰찾기', desc: '숫자 힌트로 지뢰 피하기', tag: '논리' },
  { to: '/typing', title: '타자 연습', desc: '짧은 문장을 빠르게 입력', tag: '타이핑' },
  { to: '/rock-paper-scissors', title: '가위바위보', desc: '운과 통계의 대결', tag: '캐주얼' },
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1>브라우저 미니게임</h1>
      <p class="lead">Vue로 만든 14가지 장르. 클릭해서 바로 플레이하세요.</p>
    </section>
    <ul class="grid">
      <li v-for="g in games" :key="g.to">
        <RouterLink :to="g.to" class="card">
          <span class="tag">{{ g.tag }}</span>
          <h2>{{ g.title }}</h2>
          <p>{{ g.desc }}</p>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.home {
  padding-bottom: 2rem;
}
.hero {
  margin-bottom: 1.75rem;
}
.hero h1 {
  margin: 0 0 0.5rem;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(120deg, #e8edf7, #7ecbff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.lead {
  margin: 0;
  color: #8b95ad;
  font-size: 0.95rem;
}
.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.85rem;
}
.card {
  display: block;
  padding: 1rem 1.1rem;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  background: linear-gradient(145deg, rgba(30, 42, 72, 0.9), rgba(18, 24, 44, 0.95));
  border: 1px solid rgba(126, 203, 255, 0.12);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.card:hover {
  transform: translateY(-3px);
  border-color: rgba(126, 203, 255, 0.35);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}
.tag {
  display: inline-block;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7ecbff;
  margin-bottom: 0.4rem;
}
.card h2 {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
  font-weight: 700;
}
.card p {
  margin: 0;
  font-size: 0.8rem;
  color: #8b95ad;
  line-height: 1.4;
}
</style>
