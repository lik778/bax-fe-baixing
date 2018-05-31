
export const isPro = location.hostname.includes('bax.baixing.com.cn')

export const fengmingApiHost = isPro
  ? '//bax.baixing.com.cn/fengmingx-api'
  : '//192.168.8.201/fengmingx'

export const mvpApiHost = isPro
  ? '//bax.baixing.com.cn/fengmingx-mvp'
  : '//192.168.8.201/fengmingx'

export const baxApiHost = isPro
  ? '//bax.baixing.com.cn/bax-api'
  : '//192.168.8.201/bax'

export const kaApiHost = isPro
  ? '//bax.baixing.com.cn/ka/api/admin'
  : '//192.168.8.201:8008/ka/api/admin'

export const dashboardHost = isPro
  ? '//bax.baixing.com.cn/dashboard-api'
  : '//localhost:3003/api'

export const cashcowHost = isPro
  ? '//bax.baixing.com.cn/cashcow/api/bax'
  : '//192.168.8.201/cashcow/api/bax'

export const assetHost = '//file.baixing.net/bax-fe/asset/'

export const upyun = {
  filehost: '//file.baixing.net/',
  host: '//v0.api.upyun.com',
  bucket: 'attachments'
}
