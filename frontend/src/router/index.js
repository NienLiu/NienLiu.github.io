import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CharactersView from '../views/CharactersView.vue'
import ChatView from '../views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    { path: '/characters', component: CharactersView },
    { path: '/characters/new', component: CharactersView },
    { path: '/chat', component: ChatView },
  ],
})

export default router
