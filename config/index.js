
const isPro = location.hostname.includes('bax.baixing.com.cn')

export const qiniuHost = '//ono2r7ueh.bkt.clouddn.com/'

export const fengmingApiHost = isPro
  ? '//fengming.baixing.com.cn/api'
  : '//192.168.8.201/fengmingx'

export const baxApiHost = isPro
  ? '//bax.baixing.com.cn/api'
  : '//192.168.8.201/bax'

export const dashboardHost = isPro
  ? '//bax.baixing.com.cn/dashboard-api'
  : '//localhost:3003/api'

export const assetHost = '//adfe.wzbaixing.com.cn/bax-asset.'

export const upyun = {
  filehost: '//file.baixing.net/',
  host: '//v0.api.upyun.com',
  bucket: 'attachments'
}
