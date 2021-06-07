import {
  centToYuan
} from 'utils'

import {
  MIN_WORD_PRICE,
  MAX_WORD_PRICE
} from 'constant/keyword'

export const cpcTopPriceTip = '首次为您推荐新词左侧（上方）指导价。您设置的出价是您愿意为一次电脑端点击所支付的最高费用。实际点击价格不超过您的出价，一些情况下甚至可能远低于您的出价，为您尽可能地节省推广预算。'

export const cpcPriceTip = `
您设置的出价是您愿意为任何一个您所选择的关键词
发生一次点击所支付的最高费用。实际点击价格不超过
您的出价，一些情况下甚至可能远低于您的出价，为您
尽可能地节省推广预算
`

export const searchIndexTip = '最近30天内网民的日均搜索情况，指数越高表明网民搜索次数越多。日均搜索量大小仅与关键词本身、推广地域有关系，一般来说，推广地域越多，同一个关键词的日均搜索量越大。'

export const mobileRatioTip = '移动端关键词最高出价 = 电脑端关键词最高出价 * 移动端出价比例'

export const campaignCreativeTooltip = `
1、推广内容和推广标题请勿完全相同；
2、请填写完整通顺的语句，切勿堆叠词语，以免影响投放效果；
3、请勿连续使用标点符号，如：“非常好！！！”，否则无法通过审核；
4、未经品牌授权，创意中不允许包含行业知名品牌的拼音、中文名、英文名和变形词汇，如：苹果（apple）手机维修、大众（dazhong）搬家、蚂蚁（mayi）搬家等，多次违规提交，冻结账户。
`

export const campaignStatusTooltip = `
计划包含以下6种状态：
  1. 有效：表示计划当前可以推广，但是计划能否正常展现，由审核状态决定；
  2. 下线：表示当前计划被删除；
  3. 计划预算不足：表示当前计划推广预算已花完；
  4. 账户余额不足：表示当前账户余额不足以开启该计划，无法推广；
  5. 不在投放期：表示当前计划当前不在推广日期内；
  6. 暂停投放：表示当前计划设置了暂停，无法正常展现。
`

export const keywordStatusTip = `
关键词有以下7种状态：<br/>
  (1) 有效（推广中）；<br/>
  (2) 不宜推广/审核拒绝（关键词不符合规定）；<br/>
  (3) 搜索无效（关键词出价低于最低展现价格，此时推广无法展现）<br/>
  (4) 计算机搜索无效（关键词计算机端出价低于最低展现价格，此时计算机端无法展现，移动端推广正常）；<br/>
  (5) 移动搜索无效（关键词移动端出价低于最低展现价格，此时移动端无法展现，计算机端推广正常）；<br/>
  (6) 搜索量过低（表明由于最近一段时间，网民搜索该词的次数极少，推广平台已经暂停了该关键词的推广）；<br/>
  (7) 审核中。<br/>
`

export const campaignAuditStatusTooltip = `
审核包含以下3种状态：
  1. 审核驳回
  2. 审核中
  3. 审核通过
`

export const keywordPriceTip = `
关键词有效出价区间为[${centToYuan(MIN_WORD_PRICE)}, ${centToYuan(MAX_WORD_PRICE)}]元，请调整出价
`

export const matchTypeTip = `<div style='margin: 6px 0'>
  <div>智能匹配：（流量通道-大）</div>
  <div>您提交的关键词，会被系统智能识别并匹配出搜索意图相关的用户搜索词。</div>
</div>
<div style='margin: 6px 0'>
  <div>短语匹配：（流量通道-中）</div>
  <div>提交的关键词或关键词的同义变体， 会被包含在用户搜索词中，或是在意思一致的前提下， 于搜索词的前中后插入或变换顺序。</div>
</div>
<div style='margin: 6px 0'>
  <div>精确匹配：（流量通道-小）</div>
  <div>广告主提交的关键词及关键词的同义变体，会与用户的搜索词一致。</div>
</div>
<div style='margin: 6px 0'>
  <span style='color: #ff6350'><i class='el-icon-warning' style="margin-right: 4px"></i>提示：</span>为了保障您的基本流量和广告效果，系统会智能限制计划可设置精确匹配的关键词数。
</div>`
