
import { Message } from 'element-ui'
import { redirectTo } from 'utils'
import Fetch from 'fetch.io'

import { baxApiHost } from 'config'

const api = new Fetch({
  prefix: baxApiHost,
  afterJSON(body) {
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

export default api
