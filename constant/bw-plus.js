import { f2y } from 'util'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
// 审核状态
export const AUDIT_STATUS_PENGDING = 0
export const AUDIT_STATUS_AUDITING = 5
export const AUDIT_STATUS_PASS = 10
export const AUDIT_STATUS_REJECT = 20
export const AUDIT_STATUS_MAP = {
  [AUDIT_STATUS_PENGDING]: '待审核',
  [AUDIT_STATUS_AUDITING]: '审核中',
  [AUDIT_STATUS_PASS]: '审核通过',
  [AUDIT_STATUS_REJECT]: '审核驳回'
}
export const AUDIT_STATUS_COLOR_MAP = {
  [AUDIT_STATUS_PENGDING]: 'info',
  [AUDIT_STATUS_AUDITING]: 'info',
  [AUDIT_STATUS_PASS]: 'success',
  [AUDIT_STATUS_REJECT]: 'warning'
}

// 计划状态
export const PROMOTE_STATUS_PENDING_EDIT = 0
export const PROMOTE_STATUS_PENDING_ONLINE = 5
export const PROMOTE_STATUS_ONLINE = 10
export const PROMOTE_STATUS_OFFLINE = 50
export const PROMOTE_STATUS_MAP = {
  [PROMOTE_STATUS_PENDING_EDIT]: '待编辑',
  [PROMOTE_STATUS_PENDING_ONLINE]: '待投放',
  [PROMOTE_STATUS_ONLINE]: '投放中',
  [PROMOTE_STATUS_OFFLINE]: '已下线'
}
export const PACKEAGE_STATUS_MAP = {
  [PROMOTE_STATUS_PENDING_EDIT]: '待设置',
  [PROMOTE_STATUS_PENDING_ONLINE]: '待投放',
  [PROMOTE_STATUS_ONLINE]: '投放中',
  [PROMOTE_STATUS_OFFLINE]: '已下线'
}
export const PROMOTE_STATUS_COLOR_MAP = {
  [PROMOTE_STATUS_PENDING_EDIT]: 'info',
  [PROMOTE_STATUS_PENDING_ONLINE]: 'info',
  [PROMOTE_STATUS_ONLINE]: 'success',
  [PROMOTE_STATUS_OFFLINE]: 'warning'
}

// 查价
export const APPLY_TYPE_NORMAL = 0 // 正常报价
export const APPLY_TYPE_ERROR = 1 // 非正常报价
export const APPLY_TYPE_ERROR_APPLY_TYPE_OVERHEAT = 3 // 热度过高或热度缺失
export const APPLY_AUDIT_STATUS_PENDING = 0 // 待审核
export const APPLY_AUDIT_STATUS_PASS = 1 // 审核通过
export const APPLY_AUDIT_STATUS_REJECT = 2 // 审核拒绝

export const APPLY_AUDIT_STATUS_OPTIONS = Object.freeze({
  [APPLY_AUDIT_STATUS_PENDING]: '待审核',
  [APPLY_AUDIT_STATUS_PASS]: '已审核',
  [APPLY_AUDIT_STATUS_REJECT]: '审核拒绝'
})

export const DEVICE_ALL = 0 // 双端
export const DEVICE_PC = 1 // pc
export const DEVICE_WAP = 2 // wap
export const DEVICE_THREE = 3 // 全平台
export const DEVICE_PROPS = {
  [DEVICE_THREE]: ['bothFive', 'bothSeven', 'pcFive', 'pcSeven', 'wapFive', 'wapSeven'],
  [DEVICE_ALL]: ['bothFive', 'bothSeven'],
  [DEVICE_PC]: ['pcFive', 'pcSeven'],
  [DEVICE_WAP]: ['wapFive', 'wapSeven']
}
export const SCHEDULE_PROPS = {
  58: ['wapFive', 'bothFive', 'pcFive'],
  724: ['bothSeven', 'pcSeven', 'wapSeven']
}
export const DEVICE = Object.freeze({
  [DEVICE_ALL]: '全平台',
  [DEVICE_PC]: '电脑',
  [DEVICE_WAP]: '手机'
})
export const SCHEDULE_TYPE = Object.freeze({
  58: '5天*8小时',
  724: '7天*24小时'
})
export const SERVICE_DAYS = Object.freeze({
  365: '365天',
  180: '180天',
  90: '90天',
  30: '30天'
})
export const THIRTY_DAYS = 30

export const OPTION_STATUS_AWAIT_OPERATION = 0 // 待运营处理
export const OPTION_STATUS_AWAIT_USER = 10 // 待用户选择
export const OPTION_STATUS_AWAIT_TIDAN = 20 // 待提单
export const OPTION_STATUS_COPY_URL = 30 // 可复制链接
export const OPTION_STATUS_BUY = 40 // 已购买
export const OPTION_STATUS_EXPIRED = 50 // 已过期

export const PROVINCE_LIST = [
  {
    id: 1,
    value: 'jiangsu',
    label: '江苏'
  },
  {
    id: 2,
    value: 'guangdong',
    label: '广东'
  },
  {
    id: 3,
    value: 'zhejiang',
    label: '浙江'
  },
  {
    id: 4,
    value: 'fujian',
    label: '福建'
  },
  {
    id: 5,
    value: 'jiangxi',
    label: '江西'
  },
  {
    id: 6,
    value: 'shandong',
    label: '山东'
  },
  {
    id: 7,
    value: 'henan',
    label: '河南'
  },
  {
    id: 8,
    value: 'hebei',
    label: '河北'
  },
  {
    id: 9,
    value: 'shanxi',
    label: '山西'
  },
  {
    id: 10,
    value: 'neimenggu',
    label: '内蒙古'
  },
  {
    id: 11,
    value: 'hubei',
    label: '湖北'
  },
  {
    id: 12,
    value: 'hunan',
    label: '湖南'
  },
  {
    id: 13,
    value: 'shaanxi',
    label: '陕西'
  },
  {
    id: 14,
    value: 'sichuan',
    label: '四川'
  },
  {
    id: 15,
    value: 'guangxi',
    label: '广西'
  },
  {
    id: 16,
    value: 'yunnan',
    label: '云南'
  },
  {
    id: 17,
    value: 'guizhou',
    label: '贵州'
  },
  {
    id: 18,
    value: 'liaoning',
    label: '辽宁'
  },
  {
    id: 19,
    value: 'jilinn',
    label: '吉林'
  },
  {
    id: 20,
    value: 'heilongjiang',
    label: '黑龙江'
  },
  {
    id: 21,
    value: 'gansu',
    label: '甘肃'
  },
  {
    id: 22,
    value: 'ningxia',
    label: '宁夏'
  },
  {
    id: 23,
    value: 'xinjiang',
    label: '新疆'
  },
  {
    id: 24,
    value: 'xizang',
    label: '西藏'
  },
  {
    id: 25,
    value: 'hannan',
    label: '海南'
  },
  {
    id: 26,
    value: 'qinghai',
    label: '青海'
  },
  {
    id: 27,
    value: 'anhui',
    label: '安徽'
  }
]

export const RENEW_OPRATION_STATUS_OPEN = 20
export const RENEW_OPRATION_STATUS_COPY = 30
export const RENEW_OPRATION_STATUS_DISABLED = 60
const showWelfare = () => {
  const now = dayjs()
  return dayjs(now).isBetween('2021-11-1', dayjs('2021-11-19'))
}

export const welfareInfo = [
  {
    id: 1,
    title: '会员钻石店铺',
    value: (price) => 1200,
    desc: '',
    content: ['双端适配', '视频展示', '智能接待系统', '支持seo优化'],
    isActive: (duration, price) => {
      const active = duration >= 90
      return {
        active,
        tag: active ? `已解锁，赠送${duration}天` : '至少购买90天标王可解锁',
        detail: `${duration}天`
      }
    },
    show: () => true
  },
  {
    id: 2,
    title: '精准关键词',
    value: (price) => price > 0 ? Math.floor(f2y(price) / 10000) * 5000 : 5000,
    desc: '限时11.1-11.18 仅前111名',
    content: ['一周至尊标王或标王关键词二选一', '每满¥10000即赠2个5热度关键词'],
    isActive: (duration, price) => {
      price = price > 0 ? price : 0
      const active = f2y(price) >= 10000
      const num = Math.floor(f2y(price) / 10000) * 2
      return {
        active,
        tag: active ? `已解锁，赠送${num}个` : `还差${10000 - f2y(price)}元即可解锁`,
        detail: `${num}个`
      }
    },
    show: showWelfare
  },
  {
    id: 3,
    title: '三网整合营销',
    value: (price) => 8000,
    desc: '限时11.1-11.18 仅前30名',
    content: ['360/搜狗/神马3大搜索引擎首页排名', '365天超长时长'],
    isActive: (duration, price) => {
      price = price > 0 ? price : 0
      const active = f2y(price) >= 20000
      return {
        active,
        tag: active ? '已解锁，赠送365天' : `还差${20000 - f2y(price)}元即可解锁`,
        detail: '365天'
      }
    },
    show: showWelfare
  }
]

export const PRODUCT_STATUS_ONLINE = 1
export const PRODUCT_STATUS_OFLINE = 0
export const PRODUCT_LIST = Object.freeze([
  {
    name: '360标王',
    day: '180天',
    device: DEVICE_WAP,
    hot: true,
    originPrice: '',
    currentPrice: '',
    status: PRODUCT_STATUS_ONLINE,
    statusDesc: ''
  },
  {
    name: '头条标王',
    day: [],
    device: DEVICE_WAP,
    hot: true,
    originPrice: '',
    currentPrice: '',
    status: PRODUCT_STATUS_ONLINE,
    statusDesc: ''
  }
])

export const SEO_PRODUCT_TYPE = 2
export const CREATIVE_PRODUCT_TYPE = 0
export const REGULAR_PRODUCT_TYPE = 1
export const BAIDUBW_PRODUCT_TYPE = 3
