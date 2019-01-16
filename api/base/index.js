
import 'whatwg-fetch'

import { Message } from 'element-ui'
import Fetch from 'fetch.io'

import {
  fengmingApiHost,
  biaowangApiHost,
  dashboardHost,
  mvpApiHost,
  baxApiHost,
  kaApiHost
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

export const mvp = new Fetch({
  prefix: mvpApiHost,
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
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    }

    if (meta.message !== 'Success') {
      Message.error(meta.message)
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
      throw new Error(body.msg)
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
      return redirect('signin')
    }

    if (res.status === 403) {
      Message.error('你没有权限访问该页面')
      return redirect('main')
    }
  }
})

export const biaowang = new Fetch({
  prefix: biaowangApiHost,
  beforeRequest() {
    es.emit('http fetch start')
  },
  afterResponse() {
    es.emit('http fetch end')
  },
  afterJSON(body) {
    const {errors, code, message} = body
    if (errors) {
      Message.error('出错啦')
      throw new Error('出错啦')
    }
    console.log(body)

    if (code === 1002) {
      Message.error('请重新登录 >_<')
      return redirect('signin', `return=${encodeURIComponent(location.pathname + location.search)}`)
    }

    if (message !== 'Success') {
      Message.error(message)
      throw new Error(message)
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
