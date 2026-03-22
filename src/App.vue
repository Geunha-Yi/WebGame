<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-root">
    <header class="top-bar">
      <RouterLink class="brand" to="/">WebGame 아케이드</RouterLink>
      <nav class="nav-links">
        <RouterLink to="/">홈</RouterLink>
      </nav>
    </header>
    <main class="main-area">
      <RouterView />
    </main>
    <footer class="foot-note">Vue 3 · Vite · 브라우저에서 즐기는 미니게임 모음</footer>
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at top, #1a2744 0%, #0b0f1a 55%);
  color: #e8edf7;
}
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  background: rgba(10, 14, 28, 0.65);
  position: sticky;
  top: 0;
  z-index: 10;
}
.brand {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: #7ecbff;
  text-decoration: none;
}
.brand:hover {
  color: #b8e4ff;
}
.nav-links a {
  color: #9aa4bc;
  text-decoration: none;
  font-size: 0.95rem;
}
.nav-links a.router-link-active {
  color: #7ecbff;
}
.main-area {
  flex: 1;
  padding: 1.25rem;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
.foot-note {
  text-align: center;
  font-size: 0.75rem;
  color: #5c657c;
  padding: 1rem;
}
</style>
