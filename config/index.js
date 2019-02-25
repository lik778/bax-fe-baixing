
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

export const assetHost = '//file.baixing.net/bax-fe/asset/'

export const upyun = {
  filehost: '//file.baixing.net/',
  host: '//v0.api.upyun.com',
  bucket: 'attachments'
}

export const orderServiceHost = isPro
  ? 'https://trade.baixing.com'
  : 'http://trade-dev.baixing.cn'
