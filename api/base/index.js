
import { Message } from 'element-ui'
import { redirectTo } from 'utils'
import Fetch from 'fetch.io'

import { baxApiHost } from 'config'

export const api = new Fetch({
  prefix: baxApiHost,
  afterJSON(body) {
    if (body.errors) {
      return Message.error('出错啦')
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
