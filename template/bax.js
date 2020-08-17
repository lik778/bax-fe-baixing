
import '../lib/trackerlib'
import sentry from '../lib/sentry'

import Homepage from 'com/homepage'
import Bax from 'com/bax'

import VueClipboard from 'vue-clipboard2'
import VueRouter from 'vue-router'
import {
  Pagination,
  Dialog,
  Autocomplete,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Select,
  Option,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  Popover,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Icon,
  Row,
  Col,
  Progress,
  Card,
  Image,
  Loading,
  MessageBox,
  Message,
  Cascader,
  Notification
} from 'element-ui'

import { reaction } from 'mobx'
import Movue from 'movue'
import Vue from 'vue'

import Vue2Filters from 'vue2-filters'
import { getBusinessLicense } from 'api/seo'
import { allowUseKaPackage } from 'util/fengming-role'
import { getCurrentUser } from 'api/account'
import pick from 'lodash.pick'

// track common data
window.__trackerData = {
  common: {}
}
window.onerror = (e) => {
  sentry.captureException(e)
}
Vue.config.errorHandler = (err, vm, info) => {
  sentry.captureException(err)
}

Vue.use(Movue, { reaction })
Vue.use(VueClipboard)
Vue.use(VueRouter)

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(CheckboxGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Cascader)
Vue.use(Progress)
Vue.use(Card)
Vue.use(Image)

Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

Vue.use(Vue2Filters)

// 该组件引入echarts，体积较大，异步加载提升用户体验
Vue.component('homepage-campaign', () => import('../component/homepage/campaign'))

const gwRoutes = [{
  component: () => import('com/gw-homepage'),
  path: '/main/gw',
  name: 'gw-homepage'
}, {
  component: () => import('com/gw-charge'),
  path: '/main/gw/charge',
  name: 'gw-charge',
  beforeEnter: async (to, from, next) => {
    const userInfo = await getCurrentUser()
    const license = allowUseKaPackage('', userInfo.id)
    if (license) {
      next()
    } else {
      Message.error('无权限访问')
    }
  }
}]

const bwRoutes = [{
  component: () => import('com/bw-query-price'),
  path: '/main/bw/query-price',
  name: 'bw-query-price'
}, {
  component: () => import('com/bw-edit-plan'),
  path: '/main/bw/edit-plan',
  name: 'bw-edit-plan'
}, {
  component: () => import('com/bw-plan-list'),
  path: '/main/bw/plan-list',
  name: 'bw-plan-list'
}, {
  component: () => import('com/bw-landing'),
  path: '/main/bw/landing',
  name: 'bw-landing'
}, {
  component: () => import('com/bw-dashboard'),
  path: '/main/bw/dashboard',
  name: 'bw-dashboard'
}, {
  component: () => import('com/bw-manual'),
  path: '/main/bw/manual',
  name: 'bw-manual'
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
  component: () => import('com/qwt-charge'),
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

const seoRoutes = [{
  component: () => import('com/seo-charge'),
  path: '/main/seo/charge',
  name: 'seo-charge'
}, {
  component: () => import('com/seo-landing'),
  path: '/main/seo/landing',
  name: 'seo-landing'
},
{
  component: () => import('com/seo-create-promotion'),
  path: '/main/seo/promotion/create',
  name: 'seo-create-promotion'
}, {
  component: () => import('com/seo-promotion-list'),
  path: '/main/seo/promotions',
  name: 'seo-promotion-list'
}, {
  component: () => import('com/seo-update-promotion-zixuan'),
  path: '/main/seo/promotion/zixuan/:id/update',
  name: 'seo-update-zixuan-promotion'
}, {
  component: () => import('com/seo-create-promotion-zixuan'),
  path: '/main/seo/promotion/create/zixuan',
  name: 'seo-create-zixuan-promotion'
}, {
  component: () => import('com/seo-promotion-cibao/create'),
  path: '/main/seo/promotion/create/cibao',
  name: 'seo-create-cibao-promotion',
  beforeEnter: async (to, from, next) => {
    const license = await getBusinessLicense()
    if (license) {
      next()
    } else {
      Message.error('无权限访问')
    }
  }
}, {
  component: () => import('com/seo-promotion-cibao/update'),
  path: '/main/seo/promotion/cibao/:id/update',
  name: 'seo-update-cibao-promotion'
}]

export const router = new VueRouter({
  mode: 'history',
  routes: [{
    component: Homepage,
    path: '/main',
    name: 'root'
  }, {
    component: () => import('com/redirect'),
    path: '/main/redirect-to',
    name: 'bax-redirect-page'
  }, {
    component: () => import('com/payment-success'),
    path: '/main/payment-success',
    name: 'payment-success-page'
  }, {
    component: () => import('com/account'),
    path: '/main/account',
    name: 'account'
  }, {
    component: () => import('com/coupon'),
    path: '/main/coupon',
    name: 'coupon'
  }, {
    component: () => import('com/notice'),
    path: '/main/notice',
    name: 'notice'
  },
  ...bwRoutes,
  ...qwtRoutes,
  ...sspRoutes,
  ...gwRoutes,
  ...seoRoutes,
  {
    path: '*',
    redirect: '/main'
  }]
})
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0)
  if (to.query.user_id) {
    next()
    return
  }
  if (from.query.user_id) {
    const query = pick(from.query, ['user_id', 'sales_id'])
    next({
      path: to.path,
      query
    })
  } else {
    next()
  }
})

const app = new Vue({
  render: h => h(Bax),
  router
})

app.$mount('#bax')
