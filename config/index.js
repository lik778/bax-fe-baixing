
export const isPro = location.hostname.includes('bax.baixing.com.cn')

export const fengmingApiHost = isPro
  ? '//bax.baixing.com.cn/fengmingx-api'
  : '//bax.baixing.cn/fengmingx'

export const mvpApiHost = isPro
  ? '//bax.baixing.com.cn/fengmingx-mvp'
  : '//bax.baixing.cn/fengmingx'

export const baxApiHost = isPro
  ? '//bax.baixing.com.cn/bax-api'
  : '//bax.baixing.cn/bax'

export const kaApiHost = isPro
  ? '//bax.baixing.com.cn/ka/api/admin'
  : '//bax.baixing.cn:8008/ka/api/admin'

export const dashboardHost = isPro
  ? '//bax.baixing.com.cn/dashboard-api'
  : '//localhost:3003/api'

export const assetHost = '//file.baixing.net/bax-fe/asset/'

export const upyun = {
  filehost: '//file.baixing.net/',
  host: '//v0.api.upyun.com',
  bucket: 'attachments'
}
