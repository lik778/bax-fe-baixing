
const isPro = location.hostname.includes('bax.baixing.com.cn')

export const qiniuHost = '//ono2r7ueh.bkt.clouddn.com/'

export const baxApiHost = isPro
  ? '//bax.baixing.com.cn/api'
  : '//192.168.8.201/bax'

export const assetHost = '//adfe.wzbaixing.com.cn/bax-asset.'
