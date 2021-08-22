import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueMq from 'vue-mq'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  VueMq,
  render: h => h(App)
}).$mount('#app')

Vue.use(vuetify)

Vue.use(VueMq, {
  breakpoints: {
    mobile: 500,
    tablet: 900,
    desktop: Infinity,
  }
})