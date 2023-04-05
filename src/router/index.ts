import { createRouter, createWebHistory } from 'vue-router'
import WelcomeView from '../views/WelcomeView.vue'
import MainView from '../views/MainView.vue'
import GameView from '../views/GameView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView
    },
    {
      path: '/graph',
      name: 'graph',
      component: MainView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    }
  ]
})

export default router
