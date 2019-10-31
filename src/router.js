import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      // Importando vista de manera directa
      component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue')
    },
    {
      path: '/farm/:name',
      name: 'farm',
      // Importando component de manera directa
      component: () => import(/* webpackChunkName: "farm" */ './components/Farm.vue')
    },
    {
      path: '/pump_system/:name',
      name: 'pumpsystem',
      component: () => import(/* webpackChunkName: "pumpsystem" */ './components/Pumpsystem.vue')
    },
    {
      path: '/gateway/:name',
      name: 'gateway',
      component: () => import(/* webpackChunkName: "gateway" */ './components/Gateway.vue')
    },
    {
      path: '/zone/:name',
      name: 'zone',
      component: () => import(/* webpackChunkName: "zone" */ './components/Zone.vue')
    }
  ]
})
