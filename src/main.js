import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueMq from 'vue-mq'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

//event bus for passing data using global events
// https://v3.vuejs.org/guide/migration/events-api.html#overview
export const eventBus = new Vue()

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