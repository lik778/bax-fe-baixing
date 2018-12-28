
// 全网通
import QwtUpdatePromotion from 'com/qwt-update-promotion'
import QwtCreatePromotion from 'com/qwt-create-promotion'
import QwtPromotionList from 'com/qwt-promotion-list'
import QwtDashboard from 'com/qwt-dashboard'

// 标王
import BwQueryPrice from 'com/bw-query-price'
import BwEditPlan from 'com/bw-edit-plan'
import BwPlanList from 'com/bw-plan-list'
import BwLanding from 'com/bw-landing'

// mvp
import MvpUpdateCampaign from 'com/mvp-update-campaign'
import MvpCreateCampaign from 'com/mvp-create-campaign'
import MvpCampaignList from 'com/mvp-campaign-list'
import MvpDashboard from 'com/mvp-dashboard'

// ssp
import MaterialList from 'com/ssp-material-list'
import MaterialInfo from 'com/ssp-material-info'
import CreateOrder from 'com/ssp-order-create'
import AdCalendar from 'com/ssp-ad-calendar'
import OrderInfo from 'com/ssp-order-info'
import OrderList from 'com/ssp-order-list'
import UserList from 'com/ssp-user-list'
import AdList from 'com/ssp-ad-list'

// 精品官网
import GwCharge from 'com/gw-charge'
import GwHomepage from 'com/gw-homepage'

// global
// import OperationLog from 'com/operation-log'
import Redirect from 'com/redirect'
import Homepage from 'com/homepage'
import Account from 'com/account'
import Coupon from 'com/coupon'
import Charge from 'com/charge'
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
  component: GwHomepage,
  path: '/main/gw',
  name: 'gw-homepage'
}, {
  component: GwCharge,
  path: '/main/gw/charge',
  name: 'gw-charge'
}]

const bwRoutes = [{
  component: BwQueryPrice,
  path: '/main/bw/query-price',
  name: 'bw-query-price'
}, {
  component: BwEditPlan,
  path: '/main/bw/edit-plan',
  name: 'bw-edit-plan'
}, {
  component: BwPlanList,
  path: '/main/bw/plan-list',
  name: 'bw-plan-list'
}, {
  component: BwLanding,
  path: '/main/bw/landing',
  name: 'bw-landing'
}]

const mvpRoutes = [{
  component: MvpCreateCampaign,
  path: '/main/mvp/campaign/create',
  name: 'mvp-create-campaign'
}, {
  component: MvpUpdateCampaign,
  path: '/main/mvp/campaigns/:id/update',
  name: 'mvp-update-campaign'
}, {
  component: MvpCampaignList,
  path: '/main/mvp/campaigns',
  name: 'mvp-campaign-list'
}, {
  component: MvpDashboard,
  path: '/main/mvp/dashboard',
  name: 'mvp-dashboard'
}]

const qwtRoutes = [{
  component: QwtCreatePromotion,
  path: '/main/qwt/promotion/create',
  name: 'qwt-create-promotion'
}, {
  component: QwtUpdatePromotion,
  path: '/main/qwt/promotions/:id/update',
  name: 'qwt-update-promotion'
}, {
  component: QwtPromotionList,
  path: '/main/qwt/promotions',
  name: 'qwt-promotion-list'
}, {
  component: QwtDashboard,
  path: '/main/qwt/dashboard',
  name: 'qwt-dashboard'
}, {
  component: Charge,
  path: '/main/qwt/charge',
  name: 'qwt-charge'
}]

const sspRoutes = [{
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
  }, {
    component: Homepage,
    path: '*'
  },
  ...bwRoutes,
  ...qwtRoutes,
  ...sspRoutes,
  ...gwRoutes]
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
