
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import qs from 'qs'
// import axios from 'axios'
Vue.config.productionTip = false
Vue.prototype.$api="http://47.108.14.168:12500"
Vue.prototype.$qs = qs
// Vue.prototype.$axios=axios
// axios.defaults.adapter = require('axios/lib/adapters/xhr');

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif