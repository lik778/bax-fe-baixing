const env = process.env.NODE_ENV
export const isLocal = env === 'development'

export const isPro = location.hostname.includes('bax.baixing.com.cn') || location.hostname.includes('ybs.e-baixing.com')

const isYbsUrl = location.hostname.includes('ybs.e-baixing.com') ? 'ybs.e-baixing.com' : 'bax.baixing.com.cn'

const production = {
  fengmingApiHost: `//${isYbsUrl}/fengmingx-api`,
  baxApiHost: `//${isYbsUrl}/bax-api`,
  kaApiHost: `//${isYbsUrl}/ka/api/admin`,
  biaowangApiHost: `//${isYbsUrl}/phoenixs/api`,
  seoApiHost: `//${isYbsUrl}/seo-api`,
  qcApiHost: `http://${isYbsUrl}/api/sem-batch`,
  orderServiceHost: 'http://ybs.e-baixing.com/trade',
  identityBindingPage: 'https://www.baixing.com/bind/?type=idcard',
  biaowangPlusApiHost: `//${isYbsUrl}/api/phoenixs-plus`,
  adPlatformApiHost: `//${isYbsUrl}/api/ad-platform`
}

const development = {
  fengmingApiHost: '/fengmingx',
  baxApiHost: '/bax',
  kaApiHost: '/ka/api/admin',
  biaowangApiHost: '/phoenixs/api',
  biaowangPlusApiHost: '/phoenixs-plus/api/phoenixs-plus',
  seoApiHost: '/seo-api',
  qcApiHost: '/sem-batch/api/sem-batch',
  orderServiceHost: 'http://openbax.baixing.cn/trade',
  identityBindingPage: 'http://www.staging.baixing.cn/bind/?type=idcard',
  adPlatformApiHost: '/ad-platform/api/ad-platform'
}

const local = {
  fengmingApiHost: '/devApi/fengmingx',
  baxApiHost: '/devApi/bax',
  kaApiHost: '/devApi/ka/api/admin',
  biaowangApiHost: '/devApi/phoenixs/api',
  // biaowangPlusApiHost: '/bwplusDevApi/api/phoenixs-plus',
  biaowangPlusApiHost: '/devApi/phoenixs-plus/api/phoenixs-plus',
  seoApiHost: '/devApi/seo-api',
  qcApiHost: '/devApi/sem-batch/api/sem-batch',
  orderServiceHost: 'http://openbax.baixing.cn/trade',
  identityBindingPage: 'http://www.staging.baixing.cn/bind/?type=idcard',
  adPlatformApiHost: '/adPlatformApi/api/ad-platform'
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
export const adPlatformApiHost = config.adPlatformApiHost

export default config
