import { toOpt } from 'util/kit'

export const PROMOTE_STATUS = {
  待设置: 0,
  待投放: 1,
  投放中: 2,
  已下线: 3
}
export const promoteStatusOpts = toOpt(PROMOTE_STATUS, false, true)

export const AUDIT_STATUS = {
  待审核: 0,
  审核中: 1,
  审核通过: 2,
  审核驳回: 3
}
export const auditStatusOpts = toOpt(AUDIT_STATUS, false, true)
