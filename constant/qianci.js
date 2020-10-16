// 拓词状态
export const wordExpaddingType = {
  EXPAINDG_WORD: 0,
  EXPAINDG_WORD_SUCCEED: 1,
  PENDING_PAYMENT: 2,
  UNPAID_EXPIRED: 3,
  PAYMENT_EXPIRED: 4,
  PAID: 5,
  PENDING_EDIT: 6,
  EDITED: 7,
  ONLINE: 8,
  CEASED: 9,
  FINISHED: 10,
  EXPAINDG_WORD_FAILED: -1,
  B2B_AUDIT_FAILED: -2
}

// 审核状态
export const wordAuditType = {
  PASSED_EXPANDING_WORDS: 0,
  STATUS_AUDIING_B2B: 1,
  PASSED_B2B: 2,
  AUDITING_SUPPLIES: 3,
  PASSED_SUPPLIES: 4,
  REJECT_MAIN_WORD: -1,
  REJECT_B2B: -2
}

// 拓词状态（界面展示）
export const wordType = {
  EXPAND: {
    label: '优选中',
    value: 1
  },
  AUDIT: {
    label: '审核中',
    value: 2
  },
  PAY: {
    label: '待支付',
    value: 3
  },
  EXPIRED: {
    label: '过期',
    value: 4
  }
}
