
import 'whatwg-fetch'

import { Message } from 'element-ui'
import chargeNotice from '../../util/charge-notice'
import Fetch from 'fetch.io'
import sentry from '../../lib/sentry'

import {
  fengmingApiHost,
  biaowangApiHost,
  baxApiHost,
  kaApiHost,
  seoApiHost
} from 'config'

import es from 'base/es'
import {redirect} from 'util'

export const fengming = new Fetch({
  prefix: fengmingApiHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse() {
    es.emit('http fetch end')
  },
  afterJSON(body) {
    if (
      body.meta &&
      body.meta.status === 400 &&
      body.meta.code === 2010
    ) {
      // 没有经过身份证绑定
      chargeNotice()
      throw new Error('请先绑定身份认证')
    }

    if (body.errors) {
      Message.error('出错啦')
      sentry.captureException(body)
      throw new Error('出错啦')
    }

    const meta = body.meta || {}

    if (meta.status === 401) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    }

    if (meta.message !== 'Success') {
      Message.error(meta.message)
      sentry.captureException(body)
      throw new Error(meta.message)
    }
  }
})

export const ka = new Fetch({
  prefix: kaApiHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse() {
    es.emit('http fetch end')
  },
  afterJSON(body) {
    if (body.msg !== 'success') {
      Message.error(body.msg)
      sentry.captureException(body)
      throw new Error(body.msg)
    }
  }
})

export const api = new Fetch({
  prefix: baxApiHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse(res) {
    es.emit('http fetch end')
  },
  afterJSON(body) {
    if (body.errors) {
      Message.error('出错啦')
      sentry.captureException(body)
      throw new Error('出错啦')
    }

    const meta = body.meta || {}

    if (meta.status === 401) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    }

    if (meta.status === 403) {
      Message.error('你没有权限访问该页面')
      sentry.captureException(body)
      return redirect('main')
    }

    if (meta.message !== 'Success') {
      Message.error(meta.message)
      sentry.captureException(body)
      throw new Error(meta.message)
    }
  }
})

export const biaowang = new Fetch({
  prefix: biaowangApiHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse(res) {
    es.emit('http fetch end')
    if (res.status === 200) {

    } else if (res.status === 401) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    } else {
      res.clone().json().then(body => {
        sentry.captureException(body)
        Message.error(body.message || `出错了，请稍后重试`)
      })
      throw new Error(res.statusText)
    }
  },
  afterJSON(body) {
    if (
      body &&
      body.code === 4114
    ) {
      // 没有经过身份证绑定
      chargeNotice()
      throw new Error('请先绑定身份认证')
    }
  }
})

export const seo = new Fetch({
  prefix: seoApiHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse(res) {
    es.emit('http fetch end')

    if (res.status === 200) {

    } else if (res.status === 401) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    } else {
      res.clone().json().then(body => {
        sentry.captureException(body)
        Message.error(body.message || `出错了，请稍后重试`)
      })
      throw new Error(res.statusText)
    }
  },
  afterJSON(body) {
    if (
      body &&
      body.code === 4114
    ) {
      // 没有经过身份证绑定
      chargeNotice()
      throw new Error('请先绑定身份认证')
    }

    if (body.code !== 0) {
      Message.error(body.message)
      sentry.captureException(body)
      throw new Error(body.message)
    }
  }
})

export function trim(obj) {
  const result = {}
  // only for - query filter
  for (const k of Object.keys(obj)) {
    const v = obj[k]
    if (Array.isArray(v)) {
      if (v.length !== 0) {
        result[k] = v
      }
    } else if (typeof v === 'number' ||
      typeof v === 'boolean' ||
      !!v) {
      result[k] = v
    }
  }

  return result
}
