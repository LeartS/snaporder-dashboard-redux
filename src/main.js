import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import 'vuetify/dist/vuetify.css'

import App from './components/app.vue'

Vue.use(Vuetify)
Vue.use(VueRouter)

new Vue({
  el: '#app',
  render: h => h(App),
})
