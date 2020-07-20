
import uuid from 'uuid/v4'
import { stringify } from 'query-string'
import { reverseCamelcase } from 'object-keys-mapping'
import Fetch from 'fetch.io'
import { isPro } from 'config'

export const recommendServiceRequestClient = new Fetch({
  prefix: 'https://cloud.baixing.com.cn'
})

export default function track(opts) {
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
    img.src = 'https://www.baixing.com/c/ev/bxad?' + stringify(opts)
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

// 打点库标准化 （暂时只用作凤凰于飞）
export function trackAux({action, ...opts}) {
  if (!action) return false
  const tracker = window.tracker
  opts.site_id = 'bxad_baxfe'
  opts.platform = 'desktop'
  opts.env = isPro ? 'pro' : 'test'
  tracker.aux(action, reverseCamelcase(opts))
}

export function trackRecommendService(opts) {
  try {
    opts.biztype = 'bax-fhyf'
    opts.env = isPro ? 'pro' : 'test'
    opts.referrer = document.referrer
    if (!opts.time) {
      opts.time = Date.now() / 1000 | 0
    }
    recommendServiceRequestClient
      .post('/open/keyword-recommend-service/keyword/data-record')
      .set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
      .send(encode(reverseCamelcase(opts)))
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  } catch (err) {
    console.error(err)
  }
}

function encode(data) {
  return Object.entries(data).reduce((data, [key, value]) => ({...data, [key]: encodeURIComponent(value)}), {})
}
