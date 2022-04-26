import '../lib/trackerlib'
import sentry from '../lib/sentry'
import Yibaisou from 'com/yibaisou'

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
import pick from 'lodash.pick'
import { parseQuery, stringifyQuery, f2y } from 'util'

import gStore from '../component/store'
import { isYibaisouSales, normalizeRoles, checkRoles } from 'util/role'

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
  {
    component: () => import('com/bw-plus/bw-query-price/index'),
    path: '/yibaisou/bw-plus/query-price',
    name: 'bw-plus-query-price',
    beforeEnter: async (to, from, next) => {
      await gStore.getCurrentUser()
      const { roles } = $vueForGetMobx.$options.fromMobx.currentUser()
      if (isYibaisouSales(roles)) {
        next()
      } else {
        Message.error('您没有权限访问，请更换帐号登陆')
      }
    }
  },
  {
    component: () => import('com/bw-plus/renew-upgrade/index'),
    path: '/yibaisou/bw-plus/renew-upgrade',
    name: 'renew-upgrade'
  },
  {
    component: () => import('com/bw-plus/bw-price-records'),
    path: '/yibaisou/bw-plus/price-records',
    name: 'bw-plus-price-records',
    beforeEnter: async (to, from, next) => {
      await gStore.getCurrentUser()
      const { roles } = $vueForGetMobx.$options.fromMobx.currentUser()
      if (isYibaisouSales(roles)) {
        next()
      } else {
        Message.error('您没有权限访问，请更换帐号登陆')
      }
    }
  },
  {
    component: () => import('com/bw-plus/bw-package-list'),
    path: '/yibaisou/bw-plus/package-list',
    name: 'bw-plus-package-list',
    beforeEnter: async (to, from, next) => {
      await gStore.getCurrentUser()
      const { roles, isYibaisouUser } = $vueForGetMobx.$options.fromMobx.currentUser()
      const currentRoles = normalizeRoles(roles)
      if (checkRoles(currentRoles, ['YBS_ACCOUNTING']) || isYibaisouUser) {
        next()
      } else {
        Message.error('您没有权限访问，请更换帐号登陆')
      }
    }
  },
  {
    component: () => import('com/bw-plus/bw-plan-list'),
    path: '/yibaisou/bw-plus/plan-list/:id',
    name: 'bw-plus-plan-list',
    beforeEnter: async (to, from, next) => {
      await gStore.getCurrentUser()
      const { roles, isYibaisouUser } = $vueForGetMobx.$options.fromMobx.currentUser()
      const currentRoles = normalizeRoles(roles)
      if (checkRoles(currentRoles, ['YBS_ACCOUNTING']) || isYibaisouUser) {
        next()
      } else {
        Message.error('您没有权限访问，请更换帐号登陆')
      }
    }
  },
  {
    component: () => import('com/bw-plus/bw-edit-plan/index'),
    path: '/yibaisou/bw-plus/edit-plan/:id',
    name: 'bw-plus-edit-plan',
    beforeEnter: async (to, from, next) => {
      await gStore.getCurrentUser()
      const { roles, isYibaisouUser } = $vueForGetMobx.$options.fromMobx.currentUser()
      const currentRoles = normalizeRoles(roles)
      if (checkRoles(currentRoles, ['YBS_ACCOUNTING']) || isYibaisouUser) {
        next()
      } else {
        Message.error('您没有权限访问，请更换帐号登陆')
      }
    }
  },
  {
    component: () => import('com/bw-plus/bw-dashboard'),
    path: '/yibaisou/bw-plus/bw-plus-dashboard',
    name: 'bw-plus-dashboard'
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      component: () => import('com/bw-plus/bw-dashboard'),
      path: '/yibaisou',
      name: 'root'
    },
    ...bwPlusRoutes,
    {
      path: '*',
      redirect: '/yibaisou'
    }
  ]
})

const app = new Vue({
  render: (h) => h(Yibaisou),
  router
})

app.$mount('#yibaisou')
