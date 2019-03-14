import Vue from 'vue'
import App from './App.vue'
import router from './router'
import SmartTable from 'vuejs-smart-table'
import VueResource from 'vue-resource'

Vue.use(VueResource)

Vue.use(SmartTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
