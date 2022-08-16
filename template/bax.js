import '../lib/trackerlib'
import sentry from '../lib/sentry'

import Homepage from 'com/homepage'
import Bax from 'com/bax'

import dayjs from 'dayjs'
import VueClipboard from 'vue-clipboard2'
import VueCroppie from 'vue-croppie'
import VueRouter from 'vue-router'
import {
  Divider,
  Scrollbar,
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
  Popconfirm,
  Card,
  Image,
  Loading,
  MessageBox,
  Message,
  Cascader,
  Notification,
  Breadcrumb,
  BreadcrumbItem,
  Alert,
  OptionGroup,
  Empty
} from 'element-ui'
import '../cssbase/index.scss'
import { reaction } from 'mobx'
import Movue from 'movue'
import Vue from 'vue'
import { ErrorBoundary } from 'vue-error-boundary'
import Vue2Filters from 'vue2-filters'
// import { getBusinessLicense } from 'api/seo'
// import { getCurrentUser } from 'api/account'
import pick from 'lodash.pick'
// import { notAllowFengmingRecharge } from 'util/role'
import { parseQuery, stringifyQuery, f2y } from 'util'

import gStore from '../component/store'

import clone from 'clone'

// track common data
window.__trackerData = {
  common: {}
}
// 用户获取用户登录信息的 Vue 示例
const $vueForGetMobx = new Vue({
  functional: true,
  fromMobx: {
    currentUser: () => gStore.currentUser
  }
})
/**
 * 错误上报逻辑
 */
function errorHandler (error) {
  // 兼容老代码中的 throw this.$message.error 写法
  if (error && error._data && error._data.message) return

  const currentUser = $vueForGetMobx.$options.fromMobx.currentUser()
  const isLogin = currentUser && currentUser.id
  if (!isLogin) return

  sentry.captureException(error)
}
window.onerror = errorHandler
Vue.config.errorHandler = errorHandler

Vue.use(VueCroppie)
Vue.use(Movue, { reaction })
Vue.use(VueClipboard)
Vue.use(VueRouter)

Vue.use(Divider)
Vue.use(Scrollbar)
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
Vue.use(OptionGroup)
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
Vue.use(Popconfirm)
Vue.use(Card)
Vue.use(Image)
Vue.use(Popconfirm)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Alert)
Vue.use(Empty)

/**
 * 错误回退组件
 * @example
 * <catch-error>
 *   <unstable-component />
 * </catch-error>
 */
Vue.component('catch-error', {
  name: 'error-boundary-with-default-handler',
  render (h) {
    const children = this.$slots.default
    return h(
      ErrorBoundary,
      {
        attrs: {
          fallBack: {
            functional: true,
            render (h) {
              return h('p', '数据出错啦，请刷新重新试试...')
            }
          },
          ...this.$attrs
        },
        listeners: this.$listeners
      },
      children
    )
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
  date: (time = '') => (!time ? time : dayjs(time).format('YYYY-MM-DD')),
  mapWith: (key = '', obj = {}) => obj[key],
  f2y
}

// 引入eventBus
const eventBus = {
  install (Vue) {
    Vue.prototype.$bus = new Vue()
  }
}
Vue.use(eventBus)

// 重写router push和replace方法, 放入user_id和sales_id
function getExtraRoute (route) {
  let newRoute = typeof route === 'string' ? route : clone(route)
  if (window.location) {
    const querys = pick(parseQuery(window.location.search), [
      'user_id',
      'sales_id',
      'source'
    ])
    if (typeof newRoute === 'string') {
      if (route.indexOf('?') > -1) {
        newRoute += `&${stringifyQuery(querys)}`
      } else {
        newRoute += `?${stringifyQuery(querys)}`
      }
    } else {
      newRoute = {
        ...route,
        query: {
          ...route.query,
          ...querys
        }
      }
    }
  }
  return newRoute
}
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (route) {
  return routerPush.call(this, getExtraRoute(route)).catch((error) => {
    console.log(error)
  })
}
const routerReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (route) {
  return routerReplace.call(this, getExtraRoute(route)).catch((error) => {
    console.log(error)
  })
}

const bwPlusRoutes = [
//   {
//     component: () => import('com/bw-plus/bw-query-price/index'),
//     path: '/main/bw-plus/query-price',
//     name: 'bw-plus-query-price'
//   },
//   {
//     component: () => import('com/bw-plus/renew-upgrade/index'),
//     path: '/main/bw-plus/renew-upgrade',
//     name: 'renew-upgrade'
//   },
//   {
//     component: () => import('com/bw-plus/bw-price-records'),
//     path: '/main/bw-plus/price-records',
//     name: 'bw-plus-price-records'
//   },
  {
    component: () => import('com/bw-plus/bw-package-list'),
    path: '/main/bw-plus/package-list',
    name: 'bw-plus-package-list'
  },
  {
    component: () => import('com/bw-plus/bw-plan-list'),
    path: '/main/bw-plus/plan-list/:id',
    name: 'bw-plus-plan-list'
  },
  {
    component: () => import('com/bw-plus/bw-edit-plan/index'),
    path: '/main/bw-plus/edit-plan/:id',
    name: 'bw-plus-edit-plan'
  },
  {
    component: () => import('com/bw-plus/bw-dashboard'),
    path: '/main/bw-plus/bw-plus-dashboard',
    name: 'bw-plus-dashboard'
  }
]

// const bwRoutes = [
//   {
//     component: () => import('com/bw-query-price'),
//     path: '/main/bw/query-price',
//     name: 'bw-query-price',
//     redirect: '/main/bw/plan-list'
//   },
//   {
//     component: () => import('com/bw-edit-plan'),
//     path: '/main/bw/edit-plan',
//     name: 'bw-edit-plan'
//   },
//   {
//     component: () => import('com/bw-plan-list'),
//     path: '/main/bw/plan-list',
//     name: 'bw-plan-list'
//   },
//   {
//     component: () => import('com/bw-landing'),
//     path: '/main/bw/landing',
//     name: 'bw-landing'
//   },
//   {
//     component: () => import('com/bw-dashboard'),
//     path: '/main/bw/dashboard',
//     name: 'bw-dashboard'
//   }
// ]

// const qcRoutes = [
//   {
//     component: () => import('com/qc-promote-list'),
//     path: '/main/qc/promote-list',
//     name: 'qc-promote-list'
//   },
//   {
//     component: () => import('com/qc-keyword-list'),
//     path: '/main/qc/keyword-list',
//     name: 'qc-keyword-list',
//     hidden: true
//   },
//   {
//     component: () => import('com/qc-creative'),
//     path: '/main/qc/creative',
//     name: 'qc-creative'
//   },
//   {
//     component: () => import('com/qc-dashboard'),
//     path: '/main/qc/dashboard',
//     name: 'qc-dashboard'
//   }
// ]

const qwtRoutes = [
  {
    component: () => import('com/qwt-create-promotion'),
    path: '/main/qwt/promotion/create',
    name: 'qwt-create-promotion',
    beforeEnter: (to, from, next) => {
      location.href = 'http://openbax.baixing.cn/fengming/qwt/promotion/create'
      // redirect('/fengming/qwt/promotion/create')
      return false
    }
  },
  {
    component: () => import('com/qwt-update-promotion'),
    path: '/main/qwt/promotions/:id/update',
    name: 'qwt-update-promotion',
    beforeEnter: (to, from, next) => {
      location.href = 'http://openbax.baixing.cn/fengming/qwt/promotions'
      // redirect('/fengming/qwt/promotions')
      return false
    }
  },
  // {
  //   component: () => import('com/qwt-group/create'),
  //   path: '/main/qwt/group/create',
  //   name: 'qwt-create-group'
  // },
  // {
  //   component: () => import('com/qwt-group/update'),
  //   path: '/main/qwt/group/:id/update',
  //   name: 'qwt-update-group'
  // },
  {
    component: () => import('com/qwt-update-promotion-list'),
    path: '/main/qwt/promotions',
    name: 'qwt-promotion-list',
    beforeEnter: (to, from, next) => {
      location.href = 'http://openbax.baixing.cn/fengming/qwt/promotions'
      // redirect('/fengming/qwt/promotions')
      return false
    }
  },
  // {
  //   component: () => import('com/qwt-dashboard'),
  //   path: '/main/qwt/dashboard',
  //   name: 'qwt-dashboard'
  // }
  {
    component: () => import('com/qwt-charge'),
    path: '/main/qwt/charge',
    name: 'qwt-charge',
    beforeEnter: async (to, from, next) => {
      location.href = 'http://openbax.baixing.cn/fengming/qwt/promotions'
      return false
    }
  }
]

// const sspRoutes = [
//   {
//     component: () => import('com/ssp-ad-list'),
//     path: '/main/ads',
//     name: 'ad-list'
//   },
//   {
//     component: () => import('com/ssp-material-info'),
//     path: '/main/materials/:id',
//     name: 'material-info'
//   },
//   {
//     component: () => import('com/ssp-material-list'),
//     path: '/main/materials',
//     name: 'material-list'
//   },
//   {
//     component: () => import('com/ssp-order-create'),
//     path: '/main/order/create',
//     name: 'create-order'
//   },
//   {
//     component: () => import('com/ssp-order-info'),
//     path: '/main/orders/:id',
//     name: 'order-info'
//   },
//   {
//     component: () => import('com/ssp-order-list'),
//     path: '/main/orders',
//     name: 'order-list'
//   },
//   {
//     component: () => import('com/ssp-user-list'),
//     path: '/main/users',
//     name: 'user-list'
//   },
//   {
//     component: () => import('com/ssp-ad-calendar'),
//     path: '/main/ad-calendar',
//     name: 'ad-calendar'
//   }
// ]

// const seoRoutes = [
//   {
//     component: () => import('com/seo-charge'),
//     path: '/main/seo/charge',
//     name: 'seo-charge'
//   },
//   {
//     component: () => import('com/seo-landing'),
//     path: '/main/seo/landing',
//     name: 'seo-landing'
//   },
//   {
//     component: () => import('com/seo-create-promotion'),
//     path: '/main/seo/promotion/create',
//     name: 'seo-create-promotion'
//   },
//   {
//     component: () => import('com/seo-promotion-list'),
//     path: '/main/seo/promotions',
//     name: 'seo-promotion-list'
//   },
//   {
//     component: () => import('com/seo-update-promotion-zixuan'),
//     path: '/main/seo/promotion/zixuan/:id/update',
//     name: 'seo-update-zixuan-promotion'
//   },
//   {
//     component: () => import('com/seo-create-promotion-zixuan'),
//     path: '/main/seo/promotion/create/zixuan',
//     name: 'seo-create-zixuan-promotion'
//   },
//   {
//     component: () => import('com/seo-promotion-cibao/create'),
//     path: '/main/seo/promotion/create/cibao',
//     name: 'seo-create-cibao-promotion',
//     beforeEnter: async (to, from, next) => {
//       const license = await getBusinessLicense()
//       if (license) {
//         next()
//       } else {
//         Message.error('无权限访问')
//       }
//     }
//   },
//   {
//     component: () => import('com/seo-promotion-cibao/update'),
//     path: '/main/seo/promotion/cibao/:id/update',
//     name: 'seo-update-cibao-promotion'
//   }
//   // {
//   //   component: () => import('com/seo/seo-promotion-purchase'),
//   //   path: '/main/seo/promotion-purchase',
//   //   name: 'seo-promotion-purchase'
//   // }
// ]

export const adPlatformRoute = [
  {
    component: () => import('com/ad-platform/ad-dashboard/index.vue'),
    path: '/main/ad-platform/ad-dashboard',
    name: 'ad-dashboard'
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      component: Homepage,
      path: '/main',
      name: 'root'
    },
    {
      component: () => import('com/qwt-offline'),
      path: '/main/offline',
      name: 'qwtOffline'
    },
    {
      component: () => import('com/redirect'),
      path: '/main/redirect-to',
      name: 'bax-redirect-page'
    },
    {
      component: () => import('com/payment-success'),
      path: '/main/payment-success',
      name: 'payment-success-page'
    },
    // {
    //   component: () => import('com/account'),
    //   path: '/main/account',
    //   name: 'account'
    // },
    {
      component: () => import('com/coupon'),
      path: '/main/coupon',
      name: 'coupon'
    },
    {
      component: () => import('com/notice'),
      path: '/main/notice',
      name: 'notice'
    },
    // ...bwRoutes,
    // ...qcRoutes,
    ...qwtRoutes,
    // ...sspRoutes,
    // ...seoRoutes,
    ...bwPlusRoutes,
    ...adPlatformRoute,
    {
      path: '*',
      redirect: '/main'
    }
  ]
})

const app = new Vue({
  render: (h) => h(Bax),
  router
})

app.$mount('#bax')
