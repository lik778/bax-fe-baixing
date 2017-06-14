
import CreateOrder from 'com/order-create'
import OrderInfo from 'com/order-info'
import OrderList from 'com/order-list'

import MaterialList from 'com/material-list'
import MaterialInfo from 'com/material-info'
import AdCalendar from 'com/ad-calendar'
import UserList from 'com/user-list'
import AdList from 'com/ad-list'
import Bax from 'com/bax'
import Dashboard from 'com/dashboard'
import UploadProfit from 'com/upload-profit'

import VueClipboard from 'vue-clipboard2'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import Duo from 'vue-duo'
import Vue from 'vue'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'

Vue.use(VueClipboard)
Vue.use(VueRouter)
Vue.use(Element)
Vue.use(Duo)
Vue.component('chart', ECharts)

const router = new VueRouter({
  mode: 'history',
  routes: [{
    component: AdCalendar,
    path: '/main',
    name: 'root'
  }, {
    component: AdList,
    path: '/main/ads',
    name: 'ad-list'
  }, {
    component: MaterialInfo,
    path: '/main/materials/:id',
    name: 'material-info'
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
  }, {
    component: AdCalendar,
    path: '/main/ad-calendar',
    name: 'ad-calendar'
  }, {
    component: Dashboard,
    path: '/main/dashboard',
    name: 'dashboard'
  }, {
    component: UploadProfit,
    path: '/main/upload-profit',
    name: 'upload-profit',
  }]
})

const app = new Vue({
  render: h => h(Bax),
  router
})

app.$mount('#bax')
