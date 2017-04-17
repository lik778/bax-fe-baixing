
import CreateOrder from 'com/order-list/create'
import OrderDetail from 'com/order-list/detail'
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
  routes: [{
    component: AdGroupList,
    path: '/'
  }, {
    component: AdGroupList,
    path: '/ad/groups'
  }, {
    component: MaterialList,
    path: '/materials'
  }, {
    component: CreateOrder,
    path: '/order/create'
  }, {
    component: OrderDetail,
    name: 'orderDetail',
    path: '/orders/:id'
  }, {
    component: OrderList,
    path: '/orders'
  }, {
    component: UserList,
    path: '/users'
  }]
})

const app = new Vue({
  render: h => h(Bax),
  router
})

app.$mount('#bax')
