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
      path: '/users',
      name: 'users',
      // Importando component de manera directa
      component: () => import(/* webpackChunkName: "farm" */ './views/UsersTable.vue')
    },
    {
      path: '/user/:id/farms',
      name: 'farms',
      // Importando component de manera directa
      component: () => import(/* webpackChunkName: "farm" */ './views/FarmsTable.vue')
    },
    {
      path: '/farm/:id',
      name: 'farmdetail',
      component: () => import(/* webpackChunkName: "zone" */ './views/FarmDetail.vue')
    },
    {
      path: '/farm/:id/zones',
      name: 'zones',
      component: () => import(/* webpackChunkName: "zone" */ './views/ZoneTable.vue')
    },
    {
      path: '/zone/:id',
      name: 'zonedetail',
      component: () => import(/* webpackChunkName: "zone" */ './views/ZoneDetail.vue')
    },
    {
      path: '/zones/:id/measures',
      name: 'measures',
      component: () => import(/* webpackChunkName: "zone" */ './views/MeasureTable.vue')
    },
    {
      path: '/measures/:id',
      name: 'measuredetail',
      component: () => import(/* webpackChunkName: "zone" */ './views/MeasureDetail.vue')
    },
    {
      path: '/zones/:id/hidraulics',
      name: 'hidraulics',
      component: () => import(/* webpackChunkName: "zone" */ './views/HidraulicTable.vue')
    },
    {
      path: '/hidraulics/:id',
      name: 'hidraulicsdetail',
      component: () => import(/* webpackChunkName: "zone" */ './views/HidraulicDetail.vue')
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

    // {
    //   path: '/zone/:name',
    //   name: 'zone',
    //   component: () => import(/* webpackChunkName: "zone" */ './components/Zone.vue')
    // }
  ]
})
