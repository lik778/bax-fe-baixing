
import 'whatwg-fetch'

import { Message } from 'element-ui'
import { redirectTo } from 'utils'
import Fetch from 'fetch.io'

import {
  fengmingApiHost,
  dashboardHost,
  cashcowHost,
  baxApiHost,
} from 'config'

import es from 'base/es'

export const fengming = new Fetch({
  prefix: fengmingApiHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse() {
    es.emit('http fetch end')
  },
  afterJSON(body) {
    if (body.errors) {
      Message.error('出错啦')
      throw new Error('出错啦')
    }

    const meta = body.meta || {}

    if (meta.status === 401) {
      Message.error('请重新登录 >_<')
      return redirectTo('signin')
    }

    if (meta.message !== 'Success') {
      Message.error(meta.message)
      throw new Error(meta.message)
    }
  }
})

export const api = new Fetch({
  prefix: baxApiHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse() {
    es.emit('http fetch end')
  },
  afterJSON(body) {
    if (body.errors) {
      Message.error('出错啦')
      throw new Error('出错啦')
    }

    const meta = body.meta || {}

    if (meta.status === 401) {
      Message.error('请重新登录 >_<')
      return redirectTo('signin')
    }

    if (meta.status === 403) {
      Message.error('你没有权限访问该页面')
      return redirectTo('main')
    }

    if (meta.message !== 'Success') {
      Message.error(meta.message)
      throw new Error(meta.message)
    }
  }
})

export const dashboardApi = new Fetch({
  prefix: dashboardHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse(res) {
    es.emit('http fetch end')

    if (res.status >= 500) {
      Message.error('出错啦')
      throw new Error('出错啦')
    }

    if (res.status === 401) {
      Message.error('请重新登录 >_<')
      return redirectTo('signin')
    }

    if (res.status === 403) {
      Message.error('你没有权限访问该页面')
      return redirectTo('main')
    }
  }
})

export const cashcowApi = new Fetch({
  prefix: cashcowHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse(res) {
    es.emit('http fetch end')

    if (res.status >= 500) {
      Message.error('出错啦')
      throw new Error('出错啦')
    }
  },

  afterJSON(body) {
    if (body.message) {
      Message.error(body.message)
      throw new Error(body.message)
    }
  }
})

export function trim(obj) {
  const result = {}
  // only for - query filter
  for (const k of Object.keys(obj)) {
    const v = obj[k]
    if (typeof v === 'number' ||
      typeof v === 'boolean' ||
      !!v) {
      result[k] = v
    }
  }

  return result
}
