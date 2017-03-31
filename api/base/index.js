
import Fetch from 'fetch.io'

const api = new Fetch({
  prefix: 'http://192.168.8.201/bax',
  afterJSON(body) {
    const meta = body.meta || {}

    if (meta.status === 401) {
    }

    if (meta.message !== 'Success') {
      throw new Error(meta.message)
    }
  }
})

export default api
