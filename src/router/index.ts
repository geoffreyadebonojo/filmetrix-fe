import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import GraphView from '../views/GraphView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/graph',
      name: 'graph',
      component: GraphView
    }
  ]
})

export default router
