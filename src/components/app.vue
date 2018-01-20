<template>
<div id="app">
    <!-- <navbar></navbar> -->
    <router-view></router-view>
</div>
</template>

<script>
import VueRouter from 'vue-router'

import Login from './login.vue'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    }
  ]
})

export default {
  router: router,
  name: 'App',
}
</script>
