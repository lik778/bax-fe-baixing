
export const sspOrderType = {
  0: '广告',
  1: '运营',
  2: '置换'
}

export const sspOrderTypeOpts = Object.keys(sspOrderType)
  .map((k) => ({
    label: sspOrderType[k],
    value: k
  }))

export const orderStatus = {
  '-10': '已退款',
  '-1': '已取消',
  0: '未支付',
  1: '已支付',
  10: '已支付'
}

export const sspOrderStatus = {
  '-20': '已取消',
  '-10': '审核失败',
  '-1': '下线',
  0: '未支付',
  10: '待审核',
  20: '准备投放',
  30: '投放中'
}

export const canGetPayUrlRoles = [
  'NORMAL_OPERATOR',
  'BAIXING_SALES'
]

export const orderStatusOpts = Object.keys(sspOrderStatus)
  .map((k) => ({
    label: sspOrderStatus[k],
    value: k
  }))

//
export const orderStatusType = {
  STATUS_UNPAID: 0,
  STATUS_PAID: 1,
  STATUS_DELIVER: 2,
  STATUS_PRE_TRADE: 3,
  STATUS_SERVICE_STOP: 30,
  STATUS_SERVICE_START: 31,
  STATUS_ORDER_COMPLETE: 100,
  STATUS_ORDER_CANCELED: 101,
  STATUS_ORDER_REFUND: 102
}

export const orderStatusLabel = {
  [orderStatusType.STATUS_UNPAID]: '未支付',
  [orderStatusType.STATUS_PAID]: '已支付',
  [orderStatusType.STATUS_DELIVER]: '已发货',
  [orderStatusType.STATUS_PRE_TRADE]: '预交易暂存',
  [orderStatusType.STATUS_SERVICE_STOP]: '服务类交易暂停',
  [orderStatusType.STATUS_SERVICE_START]: '服务类交易开启',
  [orderStatusType.STATUS_ORDER_COMPLETE]: '交易完成',
  [orderStatusType.STATUS_ORDER_CANCELED]: '交易取消',
  [orderStatusType.STATUS_ORDER_REFUND]: '交易退款'
}

export const orderStatusLabelDisplay = {
  [orderStatusType.STATUS_UNPAID]: '未支付',
  [orderStatusType.STATUS_PAID]: '已支付',
  [orderStatusType.STATUS_PRE_TRADE]: '未支付', // 预交易暂存，用户侧显示未支付
  [orderStatusType.STATUS_ORDER_CANCELED]: '交易取消',
  [orderStatusType.STATUS_ORDER_REFUND]: '交易退款'
}
