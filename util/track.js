
import { stringify } from 'query-string'
import uuid from 'uuid/v4'

import { isPro } from 'config'

module.exports = function track(opts) {
  try {
    opts.biztype = 'bax-qwt'
    opts.env = isPro ? 'pro' : 'test'
    opts.referrer = document.referrer
    opts.isMobile = /Android|iPhone|iPad|micromessenger/i.test(navigator.userAgent)
    if (!opts.time) {
      opts.time = Date.now() / 1000 | 0
    }

    const img = new Image()
    img.id = 'bxti-' + uuid()
    img.src = 'http://www.baixing.com/c/ev/bxad?' + stringify(opts)
    img.style.display = 'none'

    document.body.appendChild(img)

    img.onload = () => {
      try {
        document.querySelector('#' + img.id).remove()
      } catch (err) {
        console.error(err)
      }
    }
  } catch (err) {
    console.error(err)
  }
}
