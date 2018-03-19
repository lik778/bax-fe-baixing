
export const isPro = location.hostname.includes('bax.baixing.com.cn')

export const qiniuHost = '//ono2r7ueh.bkt.clouddn.com/'

export const fengmingApiHost = isPro
  ? '//bax.baixing.com.cn/fengmingx-api'
  : '//192.168.8.201/fengmingx'

export const mvpApiHost = isPro
  ? '//bax.baixing.com.cn/fengmingx-mvp'
  : '//192.168.8.201:8048'

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

export const assetHost = '//bax-static.baixingcdn.com/bax-asset.'

export const upyun = {
  filehost: '//file.baixing.net/',
  host: '//v0.api.upyun.com',
  bucket: 'attachments'
}
