
import MaterialList from 'com/material-list'
import Bax from 'com/bax'

import VueRouter from 'vue-router'
import Element from 'element-ui'
import Vue from 'vue'

Vue.use(VueRouter)
Vue.use(Element)

const router = new VueRouter({
  routes: [{
    component: MaterialList,
    path: '/materials'
  }]
})

const app = new Vue({
  render: h => h(Bax),
  router
})

app.$mount('#bax')
