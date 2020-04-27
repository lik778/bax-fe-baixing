import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import { version } from '../package.json'

const isLocal = location.host.includes('localhost')

if (!isLocal) {
  Sentry.init({
    environment: process.env.NODE_ENV,
    dsn: 'http://d4cbb1317475425ea7002c8094a87d73:4f4e7c1bcae84e3499ecf6038b7f9f3a@sentry.baixing.cn/154',
    release: `bax-fe-${version}`,
    integrations: [new VueIntegration({
      Vue,
      attachProps: true,
      logErrors: false
    })]
  })
}

export default Sentry
