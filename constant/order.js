
export const orderType = {

}

export const orderStatus = {
  '-10': '已退款',
  '-1': '已取消',
  '0': '未支付',
  '1': '已支付',
  '10': '已支付'
}

export const sspOrderStatus = {
  '-10': '审核失败',
  '-1': '下线',
  '0': '未支付',
  '10': '待审核',
  '20': '准备投放',
  '30': '投放中'
}

export const orderStatusOpts = Object.keys(sspOrderStatus)
  .map((k) => ({
    label: sspOrderStatus[k],
    value: k
  }))
