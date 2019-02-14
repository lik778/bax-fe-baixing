
import Redirect from 'com/redirect'
import Homepage from 'com/homepage'
import Account from 'com/account'
import Coupon from 'com/coupon'
import Notice from 'com/notice'

import Bax from 'com/bax'

import VueClipboard from 'vue-clipboard2'
import VueRouter from 'vue-router'
import Element from 'element-ui'

import { reaction } from 'mobx'
import Movue from 'movue'
import Vue from 'vue'

import Vue2Filters from 'vue2-filters'

import ECharts from 'vue-echarts/components/ECharts.vue'

import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'

// element 样式文件
import '../theme/index.css'

Vue.use(Movue, { reaction })
Vue.use(VueClipboard)
Vue.use(VueRouter)
Vue.use(Element)

Vue.component('chart', ECharts)
Vue.use(Vue2Filters)

const gwRoutes = [{
  component: () => import('com/gw-homepage'),
  path: '/main/gw',
  name: 'gw-homepage'
}, {
  component: () => import('com/gw-charge'),
  path: '/main/gw/charge',
  name: 'gw-charge'
}]

const bwRoutes = [{
  component: () => import('com/bw-query-price'),
  path: '/main/bw/_query-price',
  name: 'bw-query-price'
}, {
  component: () => import('com/bw-edit-plan'),
  path: '/main/bw/edit-plan',
  name: 'bw-edit-plan'
}, {
  component: () => import('com/bw-plan-list'),
  path: '/main/bw/_plan-list',
  name: 'bw-plan-list'
}, {
  component: () => import('com/bw-landing'),
  path: '/main/bw/landing',
  name: 'bw-landing'
}]

const qwtRoutes = [{
  component: () => import('com/qwt-create-promotion'),
  path: '/main/qwt/promotion/create',
  name: 'qwt-create-promotion'
}, {
  component: () => import('com/qwt-update-promotion'),
  path: '/main/qwt/promotions/:id/update',
  name: 'qwt-update-promotion'
}, {
  component: () => import('com/qwt-promotion-list'),
  path: '/main/qwt/promotions',
  name: 'qwt-promotion-list'
}, {
  component: () => import('com/qwt-dashboard'),
  path: '/main/qwt/dashboard',
  name: 'qwt-dashboard'
}, {
  component: () => import('com/charge'),
  path: '/main/qwt/charge',
  name: 'qwt-charge'
}]

const sspRoutes = [{
  component: () => import('com/ssp-ad-list'),
  path: '/main/ads',
  name: 'ad-list'
}, {
  component: () => import('com/ssp-material-info'),
  path: '/main/materials/:id',
  name: 'material-info'
}, {
  component: () => import('com/ssp-material-list'),
  path: '/main/materials',
  name: 'material-list'
}, {
  component: () => import('com/ssp-order-create'),
  path: '/main/order/create',
  name: 'create-order'
}, {
  component: () => import('com/ssp-order-info'),
  path: '/main/orders/:id',
  name: 'order-info'
}, {
  component: () => import('com/ssp-order-list'),
  path: '/main/orders',
  name: 'order-list'
}, {
  component: () => import('com/ssp-user-list'),
  path: '/main/users',
  name: 'user-list'
}, {
  component: () => import('com/ssp-ad-calendar'),
  path: '/main/ad-calendar',
  name: 'ad-calendar'
}]

export const router = new VueRouter({
  mode: 'history',
  routes: [{
    component: Homepage,
    path: '/main',
    name: 'root'
  }, {
    component: Redirect,
    path: '/main/redirect-to',
    name: 'bax-redirect-page'
  }, {
    component: Account,
    path: '/main/account',
    name: 'account'
  }, {
    component: Coupon,
    path: '/main/coupon',
    name: 'coupon'
  }, {
    component: Notice,
    path: '/main/notice',
    name: 'notice'
  },
  ...bwRoutes,
  ...qwtRoutes,
  ...sspRoutes,
  ...gwRoutes,
  {
    path: '*',
    redirect: '/main'
  }]
})
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  next()
})

const app = new Vue({
  render: h => h(Bax),
  router
})

app.$mount('#bax')
