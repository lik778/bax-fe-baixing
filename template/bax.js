
import CreateOrder from 'com/order-list/create'
import OrderInfo from 'com/order-info'
import OrderList from 'com/order-list'

import MaterialList from 'com/material-list'
import AdGroupList from 'com/ad-group-list'
import UserList from 'com/user-list'
import Bax from 'com/bax'

import VueRouter from 'vue-router'
import Element from 'element-ui'
import Duo from 'vue-duo'
import Vue from 'vue'

Vue.use(VueRouter)
Vue.use(Element)
Vue.use(Duo)

const router = new VueRouter({
  mode: 'history',
  routes: [{
    component: AdGroupList,
    path: '/main',
    name: 'root'
  }, {
    component: AdGroupList,
    path: '/main/ad/groups',
    name: 'ad-group-list'
  }, {
    component: MaterialList,
    path: '/main/materials',
    name: 'material-list'
  }, {
    component: CreateOrder,
    path: '/main/order/create',
    name: 'create-order'
  }, {
    component: OrderInfo,
    path: '/main/orders/:id',
    name: 'order-info'
  }, {
    component: OrderList,
    path: '/main/orders',
    name: 'order-list'
  }, {
    component: UserList,
    path: '/main/users',
    name: 'user-list'
  }]
})

const app = new Vue({
  render: h => h(Bax),
  router
})

app.$mount('#bax')
