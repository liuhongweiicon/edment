import Vue from 'vue'
import App from './App.vue'

import yjment from './plugin/index'

Vue.use(yjment)
new Vue({
  el: '#app',
  render: h => h(App)
})
