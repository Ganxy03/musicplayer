import Vue from 'vue'
import VueRouter from 'vue-router'
import OldHome from '../views/v1/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/v1',
    name: 'v1home',
    component: OldHome
  },
  {
    path: '/v1/about',
    name: 'v1about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/v1/AboutView.vue')
  },
  {
    path: '/v2',
    name: 'v2home',
    component: () => import(/* webpackChunkName: "about" */ '../views/v2/HomeView.vue')
  },
  {
    path: '/v2/test',
    name: 'v2test',
    component: () => import(/* webpackChunkName: "about" */ '../views/v2/TestView.vue')
  },
  {
    path: '/v3',
    name: 'v3home',
    component: () => import(/* webpackChunkName: "about" */ '../views/v3/HomeView.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../views/v4/HomeView.vue')
  }

]

const router = new VueRouter({
  base: '',
  mode: 'history',
  routes
})

export default router
