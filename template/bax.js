
// 全网通
import QwtCreatePromotion from 'com/qwt-create-promotion'
import QwtPromotionList from 'com/qwt-promotion-list'
import QwtDashboard from 'com/qwt-dashboard'
import QwtCharge from 'com/qwt-charge'

// 精品官网
import GwCustomPage from 'com/gw-custom-page'
import GwCharge from 'com/gw-charge'

// dashboard
import UploadProfit from 'com/upload-profit'
import Dashboard from 'com/dashboard'

import MaterialList from 'com/material-list'
import MaterialInfo from 'com/material-info'
import CreateOrder from 'com/order-create'
import AdCalendar from 'com/ad-calendar'
import OrderInfo from 'com/order-info'
import OrderList from 'com/order-list'
import UserList from 'com/user-list'
import AdList from 'com/ad-list'

import Bax from 'com/bax'

import VueClipboard from 'vue-clipboard2'
import VueRouter from 'vue-router'
import Element from 'element-ui'

import Duo from 'vue-duo'
import Vue from 'vue'

import Vue2Filters from 'vue2-filters'
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
Vue.use(Vue2Filters)

const gwRoutes = [{
  component: GwCharge,
  path: '/main/gw/charge',
  name: 'gw-charge'
}, {
  component: GwCustomPage,
  path: '/main/gw/custom-page',
  name: 'gw-custom-page'
}]

const qwtRoutes = [{
  component: QwtCreatePromotion,
  path: '/main/qwt/promotion/create',
  name: 'qwt-create-promotion'
}, {
  component: QwtPromotionList,
  path: '/main/qwt/promotions',
  name: 'qwt-promotion-list'
}, {
  component: QwtDashboard,
  path: '/main/qwt/dashboard',
  name: 'qwt-dashboard'
}, {
  component: QwtCharge,
  path: '/main/qwt/charge',
  name: 'qwt-charge'
}]

const bxadRoutes = [{
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
}]

const router = new VueRouter({
  mode: 'history',
  routes: [{
    component: AdCalendar,
    path: '/main',
    name: 'root'
  }, {
    component: Dashboard,
    path: '/main/dashboard',
    name: 'dashboard'
  }, {
    component: UploadProfit,
    path: '/main/upload-profit',
    name: 'upload-profit'
  }, ...qwtRoutes, ...bxadRoutes, ...gwRoutes]
})

const app = new Vue({
  render: h => h(Bax),
  router
})

app.$mount('#bax')
