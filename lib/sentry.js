import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import { version } from '../package.json'

const isLocal = location.host.includes('localhost')

if (!isLocal) {
  Sentry.init({
    ignoreErrors: [
      // not sure, https://git.seiue.com/frontend-foundation/frontend-foundation/commit/afe7b49cf36333b663e745672674a326754f6329#56e7e78e7e56c65165283ad63644a6c2d93b0252
      'hackLocationSuccess',
      '请登录 BAX 系统',
      "NetworkError: Failed to execute 'send' on 'XMLHttpRequest'"
    ],
    environment: process.env.NODE_ENV,
    dsn:
      'http://d4cbb1317475425ea7002c8094a87d73:4f4e7c1bcae84e3499ecf6038b7f9f3a@sentry.baixing.cn/154',
    release: `bax-fe-${version}`,
    integrations: [
      new VueIntegration({
        Vue,
        attachProps: true,
        logErrors: true
      })
    ]
  })
}

export default Sentry
