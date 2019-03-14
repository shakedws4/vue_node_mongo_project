import Vue from 'vue'
import Router from 'vue-router'
import Create from '../components/Create.vue'
import List from '../components/List.vue'

Vue.use(Router)

export default new Router({
  routes: [
   
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/list',
      name: 'List',
      component: List
    },
    {
      path: '*',
      redirect: {name: 'Create'}
    }
  ]
})
