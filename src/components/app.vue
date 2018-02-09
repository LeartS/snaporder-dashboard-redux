<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
import VueRouter from 'vue-router'

import Dashboard from './dashboard.vue'
import Login from './login.vue'
import QuestionPage from './question-page.vue'
import QuestionList from './question-list.vue'
import Party from './party.vue'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/app',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: 'question/:id',
          component: QuestionPage,
        },
        {
          path: 'question/',
          component: QuestionList,
        },
      ]
    },
    {
      path: '/party',
      name: 'party',
      component: Party,
    },
  ]
})

export default {
  router: router,
  name: 'App',
}
</script>
