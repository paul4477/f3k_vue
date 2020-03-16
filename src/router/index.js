import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import slotInfo from '../views/slotInfo.vue'
import timer from '../views/timer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/slot',
    name: 'slotInfo',
    component: slotInfo
  },
  {
    path: '/timer',
    name: 'timer',
    component: timer
  },
  {
    path: '/timer',
    name: 'timer',
    component: () => import('../views/timer.vue')
  },
  {
    path: '/Submit',
    name: 'Submit',
    component: () => import('../views/Submit.vue')
  },
  {
    path: '/results/:displayRound?',
    name: 'results',
    component: () => import('../views/Results.vue')
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
