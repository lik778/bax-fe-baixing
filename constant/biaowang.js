import {toOpt} from './fengming'

export const PROMOTE_STATUS_INIT = 0
export const PROMOTE_STATUS_AUDITING = 1
export const PROMOTE_STATUS_ADUIT_REFUSE = 2
export const PROMOTE_STATUS_ONLINE = 3
export const PROMOTE_STATUS_OFFLINE = 4

export const PROMOTE_STATUS = {
  '0': '待设置',
  '1': '审核中',
  '2': '审核驳回',
  '3': '投放中',
  '4': '已下线'
}

export const promoteStatusOpts = toOpt(PROMOTE_STATUS)

export const DEVICE = {
  '0': '电脑',
  '1': '手机',
  '2': '全平台'
}
