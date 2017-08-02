
/**
 * 赤壁状态对用户不可知
 *   - 关键词, 创意, 推广
 */
export const KEYWORD_CHIBI_REJECT = -10 // 审核失败 (关键词 直接删除)
export const KEYWORD_CHIBI_PENDING = 0
export const KEYWORD_CHIBI_ACCEPT = 10

export const CREATIVE_CHIBI_REJECT = -20
export const CREATIVE_CHIBI_PENDING = 0
export const CREATIVE_CHIBI_TITLE_PENDING = 1
export const CREATIVE_CHIBI_CONTENT_PENDING = 2
export const CREATIVE_CHIBI_ACCEPT = 10

export const CAMPAIGN_CHIBI_REJECT = -20 // 审核失败 (创意 直接删除)
export const CAMPAIGN_CHIBI_SENDBACK = -10 // 审核失败
export const CAMPAIGN_CHIBI_PENDING = 0
export const CAMPAIGN_CHIBI_ACCEPT = 10

export const keywordStatus = {
  '0': '投放中',
  '-1': '已删除',
  '1': '审核中',
  '5': '准备创建',
  '6': '准备删除',
  '7': '准备更新',
  '-10': '审核失败'
}

export const semPlatform = {
  '0': 'baidu',
  '1': 'qihu',
  '3': 'baidu test',
  '4': 'qihu test',
  '5': 'sogou'
}

export const semPlatformCn = {
  '0': '百度',
  '1': '360',
  '3': '百度测试',
  '4': '360测试',
  '5': '搜狗'
}

export const semPlatformOpts = [{
  label: '搜狗',
  value: 5
}, {
  label: '360',
  value: 1
}]

export const campaignStatus = {
  '100': '推广中',
  '10': '审核中',
  '0': '等待投放',
  '-1': '下线',
  '-10': '审核失败'
}

export const landingType = {
  '0': '帖子详情页',
  '1': '企业官网',
  '2': '活动定制页',
  '3': '微店'
}

export const campaignStatusOpts = Object.keys(campaignStatus)
  .map(k => ({
    label: campaignStatus[k],
    value: k | 0
  }))

export const landingTypeOpts = Object.keys(landingType)
  .filter(k => k !== '1') // 临时隐藏: 企业官网
  .map(k => ({
    label: landingType[k],
    value: k | 0
  }))

export const device = {
  '0': 'PC',
  '1': 'WAP'
}
