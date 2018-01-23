<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
import VueRouter from 'vue-router'

import Dashboard from './dashboard.vue'
import Login from './login.vue'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '*',
      name: 'dashboard',
      component: Dashboard,
    }
  ]
})

export default {
  router: router,
  name: 'App',
}
</script>
