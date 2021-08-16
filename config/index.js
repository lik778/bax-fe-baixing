const env = process.env.NODE_ENV
export const isLocal = env === 'development'

export const isPro = location.hostname.includes('bax.baixing.com.cn')

const production = {
  fengmingApiHost: '//bax.baixing.com.cn/fengmingx-api',
  baxApiHost: '//bax.baixing.com.cn/bax-api',
  kaApiHost: '//bax.baixing.com.cn/ka/api/admin',
  biaowangApiHost: '//bax.baixing.com.cn/phoenixs/api',
  seoApiHost: '//bax.baixing.com.cn/seo-api',
  qcApiHost: 'http://bax.baixing.com.cn/api/sem-batch',
  orderServiceHost: 'https://trade.baixing.com',
  identityBindingPage: 'https://www.baixing.com/bind/?type=idcard',
  biaowangPlusApiHost: '//bax.baixing.com.cn/api/phoenixs-plus'
}

const development = {
  fengmingApiHost: '/fengmingx',
  baxApiHost: '/bax',
  kaApiHost: '/ka/api/admin',
  biaowangApiHost: '/phoenixs/api',
  biaowangPlusApiHost: '/phoenixs-plus/api/phoenixs-plus',
  seoApiHost: '/seo-api',
  qcApiHost: '/sem-batch/api/sem-batch',
  orderServiceHost: 'http://trade-dev.baixing.cn',
  identityBindingPage: 'http://www.staging.baixing.cn/bind/?type=idcard'
}

const local = {
  fengmingApiHost: '/devApi/fengmingx',
  baxApiHost: '/devApi/bax',
  kaApiHost: '/devApi/ka/api/admin',
  biaowangApiHost: '/devApi/phoenixs/api',
  biaowangPlusApiHost: '/devApi/phoenixs-plus/api/phoenixs-plus',
  seoApiHost: '/devApi/seo-api',
  qcApiHost: '/devApi/sem-batch/api/sem-batch',
  orderServiceHost: 'http://trade-dev.baixing.cn',
  identityBindingPage: 'http://www.staging.baixing.cn/bind/?type=idcard'
}

const common = {
  assetHost: '//file.baixing.net/bax-fe/asset/',
  upyun: {
    filehost: '//file.baixing.net/',
    host: '//v0.api.upyun.com',
    bucket: 'attachments'
  },
  preKeywordPath: 'preKeyword'
}

let config = isPro ? production : isLocal ? local : development
config = {
  ...config,
  ...common
}

export const fengmingApiHost = config.fengmingApiHost
export const baxApiHost = config.baxApiHost
export const kaApiHost = config.kaApiHost
export const biaowangApiHost = config.biaowangApiHost
export const seoApiHost = config.seoApiHost
export const qcApiHost = config.qcApiHost
export const orderServiceHost = config.orderServiceHost
export const identityBindingPage = config.identityBindingPage
export const assetHost = config.assetHost
export const upyun = config.upyun
export const preKeywordPath = config.preKeywordPath
export const biaowangPlusApiHost = config.biaowangPlusApiHost

export default config
