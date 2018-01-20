import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './components/app.vue'

Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h(App),
})
