import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueCryptojs from "vue-cryptojs";

Vue.use(VueCryptojs);

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

// global constants

const appConstants = {
  bugUrl: "https://script.google.com/macros/s/AKfycbxoeTQ5zyiDHMa3pUAbGk4Navv2gzJqnZOd_X3YuQvSLIV2gBA/exec"
}

Vue.prototype.$appConstants = appConstants

// global state store

const store = Vue.observable({ 
  userToken: null,
  currentUserUsername: null,
  userDirectory: null
})
const storeActions = {
  setUserToken(newToken) {
    store.userToken = newToken
  }
}

Vue.prototype.$store = store
Vue.prototype.$actions = storeActions

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

