
import '../lib/trackerlib'
import sentry from '../lib/sentry'

import Homepage from 'com/homepage'
import Bax from 'com/bax'

import dayjs from 'dayjs'
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
import '../cssbase/element-ui.scss'
import '../cssbase/index.css'

import { reaction } from 'mobx'
import Movue from 'movue'
import Vue from 'vue'
import { ErrorBoundary } from 'vue-error-boundary'
import Vue2Filters from 'vue2-filters'
import { getBusinessLicense } from 'api/seo'
import { allowUseKaPackage } from 'util/fengming-role'
import { getCurrentUser } from 'api/account'
import pick from 'lodash.pick'
import { notAllowFengmingRecharge } from 'util/role'

// track common data
window.__trackerData = {
  common: {}
}
window.onerror = (e) => {
  sentry.captureException(e)
  console.error(e)
}
Vue.config.errorHandler = (err, vm, info) => {
  sentry.captureException(err)
  console.error(err)
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

/**
 * 错误回退组件
 * @example
 * <catch-error>
 *   <unstable-component />
 * </catch-error>
 */
Vue.component('catch-error', {
  name: 'error-boundary-with-default-handler',
  render(h) {
    const children = this.$slots.default
    return h(ErrorBoundary, {
      attrs: {
        fallBack: {
          functional: true,
          render(h) {
            return h('p', '数据出错啦，请刷新重新试试...')
          }
        },
        ...this.$attrs
      },
      listeners: this.$listeners
    }, children)
  }
})

Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

Vue.use(Vue2Filters)

// ElementUI formatter
Vue.prototype.$formatter = {
  join: (arrs = [], seq = '、') => arrs.join(seq),
  date: (time = '') => !time ? time : dayjs(time).format('YYYY-MM-DD'),
  mapWith: (key = '', obj = {}) => obj[key]
}

// 该组件引入echarts，体积较大，异步加载提升用户体验
Vue.component('homepage-campaign', () => import('../component/homepage/campaign'))

// 引入eventBus
const eventBus = {
  install(Vue) { Vue.prototype.$bus = new Vue() }
}
Vue.use(eventBus)


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

const qcRoutes = [{
  component: () => import('com/qc-create-promote'),
  path: '/main/qc/create',
  name: 'qc-create-promote'
}, {
  component: () => import('com/qc-promote-list'),
  path: '/main/qc/promote-list',
  name: 'qc-promote-list'
}, {
  component: () => import('com/qc-word-list'),
  path: '/main/qc/word-list',
  name: 'qc-word-list'
}, {
  component: () => import('com/qc-keyword-list'),
  path: '/main/qc/keyword-list',
  name: 'qc-keyword-list',
  hidden: true
}, {
  component: () => import('com/qc-creative'),
  path: '/main/qc/creative',
  name: 'qc-creative'
}, {
  component: () => import('com/qc-dashboard'),
  path: '/main/qc/dashboard',
  name: 'qc-dashboard'
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
  name: 'qwt-charge',
  beforeEnter: async (to, from, next) => {
    const { roles, realAgentId } = await getCurrentUser()
    if (notAllowFengmingRecharge(roles, realAgentId)) {
      next({ name: 'qwt-promotion-list', redirect: true })
    } else {
      next()
    }
  }
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
  ...qcRoutes,
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
