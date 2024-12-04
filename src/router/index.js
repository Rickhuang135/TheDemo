import { createRouter, createWebHistory } from 'vue-router'
import pageContainer from '@/views/pageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: pageContainer,
    },
  ],
})

export default router
