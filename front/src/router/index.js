import { createRouter, createWebHashHistory } from 'vue-router'
import Connexion from '../views/Connexion.vue'
import Inscription from '../views/Inscription.vue'
import Profil from '../views/Profil.vue'
import Forum from '../views/Forum.vue'
import Legal from '../views/Legal.vue'

const routes = [
  {
    path: '/connexion',
    name: 'Connexion',
    component: Connexion
  },
  {
    path: '/inscription',
    name: 'Inscription',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/inscription.vue')
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
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
