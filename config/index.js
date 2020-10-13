
export const isPro = location.hostname.includes('bax.baixing.com.cn')

export const fengmingApiHost = isPro
  ? '//bax.baixing.com.cn/fengmingx-api'
  : '//bax.baixing.cn/fengmingx'

export const baxApiHost = isPro
  ? '//bax.baixing.com.cn/bax-api'
  : '//bax.baixing.cn/bax'

export const kaApiHost = isPro
  ? '//bax.baixing.com.cn/ka/api/admin'
  : '//bax.baixing.cn/ka/api/admin'

export const biaowangApiHost = isPro
  ? '//bax.baixing.com.cn/phoenixs/api'
  : '//bax.baixing.cn/phoenixs/api'

export const seoApiHost = isPro
  ? '//bax.baixing.com.cn/seo-api'
  // : '//172.17.5.12:8088/api/seo-service/user'
  : 'http://bax.baixing.cn/seo-api'

export const assetHost = '//file.baixing.net/bax-fe/asset/'

export const upyun = {
  filehost: '//file.baixing.net/',
  host: '//v0.api.upyun.com',
  bucket: 'attachments'
}

export const orderServiceHost = isPro
  ? 'https://trade.baixing.com'
  : 'http://trade-dev.baixing.cn'

export const identityBindingPage = isPro
  ? 'https://www.baixing.com/bind/?type=idcard'
  : 'http://www.staging.baixing.cn/bind/?type=idcard'

export const preKeywordPath = 'preKeyword'
