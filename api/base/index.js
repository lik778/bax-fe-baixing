
import 'whatwg-fetch'

import { Message } from 'element-ui'
import chargeNotice from '../../util/charge-notice'
import Fetch from 'fetch.io'

import {
  fengmingApiHost,
  biaowangApiHost,
  baxApiHost,
  kaApiHost,
  seoApiHost,
  qcApiHost
} from 'config'

import es from 'base/es'
import { redirect } from 'util'

// 基础 Fetch 选项
export const baseOptions = {
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse() {
    es.emit('http fetch end')
  }
}

export const fengming = new Fetch({
  ...baseOptions,
  prefix: fengmingApiHost,
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
      throw new Error('出错啦')
    }

    const meta = body.meta || {}
    if (meta.status === 401) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    }
    if (meta.message !== 'Success') {
      Message.error(meta.message)
      throw new Error(meta.message)
    }
  }
})

export const ka = new Fetch({
  ...baseOptions,
  prefix: kaApiHost,
  afterJSON(body) {
    if (body.msg !== 'success') {
      Message.error(body.msg)
      throw new Error(body.msg)
    }
  }
})

export const api = new Fetch({
  ...baseOptions,
  prefix: baxApiHost,
  afterJSON(body) {
    if (body.errors) {
      Message.error('出错啦')
      throw new Error('出错啦')
    }

    const meta = body.meta || {}
    if (meta.status === 401) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    }
    if (meta.status === 403) {
      Message.error('你没有权限访问该页面')
      return redirect('main')
    }
    if (meta.message !== 'Success') {
      Message.error(meta.message)
      throw new Error(meta.message)
    }
  }
})

export const biaowang = new Fetch({
  ...baseOptions,
  prefix: biaowangApiHost,
  afterResponse(res) {
    es.emit('http fetch end')
    if (res.status === 200) {
      // pass
    } else if (res.status === 401) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    } else {
      res.clone().json().then(body => {
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
  ...baseOptions,
  prefix: seoApiHost,
  afterResponse(res) {
    es.emit('http fetch end')
    if (res.status === 200) {
      // pass
    } else if (res.status === 401) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    } else {
      res.clone().json().then(body => {
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
      throw new Error(body.message)
    }
  }
})

export const qianciOptions = {
  ...baseOptions,
  prefix: qcApiHost,
  afterResponse(res) {
    es.emit('http fetch end')
    if (res.status === 200) {
      // pass
    } else if (res.status === 401) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    } else {
      res.clone().json().then(body => {
        Message.error(body.message || `出错了，请稍后重试`)
      })
      throw new Error(res.statusText)
    }
  }
}
export const qianci = new Fetch({
  ...qianciOptions,
  afterJSON(body) {
    if (body && body.code !== 0) {
      Message.error(body.message || `出错了，请稍后重试`)
      throw new Error(body.message)
    }
  }
})

export const qianci1 = new Fetch({
  ...qianciOptions
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
