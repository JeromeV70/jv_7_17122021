import { createRouter, createWebHashHistory } from 'vue-router'
import Connexion from '../views/Connexion.vue'
import Inscription from '../views/Inscription.vue'
import Profil from '../views/Profil.vue'
import Forum from '../views/Forum.vue'
import Legal from '../views/Legal.vue'

const routes = [
  /*{
    path: '/',
    //redirect: window.location.href = 'http://'+location.host+'/?#/connexion'
    redirect: window.location.href = location.href+'?#'
  },*/
  {
    path: '/connexion',
    name: 'Connexion',
    component: Connexion
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: Inscription
  },
  {
    path: '/profil',
    name: 'Profil',
    component: Profil
  },
  {
    path: '/forum',
    name: 'Forum',
    component: Forum
  },
  {
    path: '/legal',
    name: 'Legal',
    component: Legal
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
