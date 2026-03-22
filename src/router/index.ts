import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/Home.vue') },
    { path: '/snake', name: 'snake', component: () => import('../games/SnakeGame.vue') },
    { path: '/memory', name: 'memory', component: () => import('../games/MemoryGame.vue') },
    { path: '/whack', name: 'whack', component: () => import('../games/WhackGame.vue') },
    { path: '/2048', name: '2048', component: () => import('../games/Game2048.vue') },
    { path: '/breakout', name: 'breakout', component: () => import('../games/BreakoutGame.vue') },
    { path: '/tic-tac-toe', name: 'tic-tac-toe', component: () => import('../games/TicTacToeGame.vue') },
    { path: '/reaction', name: 'reaction', component: () => import('../games/ReactionGame.vue') },
    { path: '/simon', name: 'simon', component: () => import('../games/SimonGame.vue') },
    { path: '/hangman', name: 'hangman', component: () => import('../games/HangmanGame.vue') },
    { path: '/flappy', name: 'flappy', component: () => import('../games/FlappyGame.vue') },
    { path: '/pong', name: 'pong', component: () => import('../games/PongGame.vue') },
    { path: '/minesweeper', name: 'minesweeper', component: () => import('../games/MinesweeperGame.vue') },
    { path: '/typing', name: 'typing', component: () => import('../games/TypingGame.vue') },
    { path: '/rock-paper-scissors', name: 'rps', component: () => import('../games/RockPaperScissorsGame.vue') },
  ],
})

export default router
