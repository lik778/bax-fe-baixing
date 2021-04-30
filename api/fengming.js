import qs from 'query-string'
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'

import { fengming, trim } from './base'
import { getCurrentBalanceBreif } from './account'
import { isPro } from 'config'
import { paginationWrapper, isObj } from 'util'
import { SPUCODES } from 'constant/product'

const isArray = Array.isArray
const { WHOLE_SPU_CODE } = SPUCODES

// 获取创意配图物料
export async function getMaterialPictures (opts) {
  return await fengming
    .get(`/creative/${opts.groupId}/image`)
    .json()
}

// 更新创意配图物料
export async function updateMaterialPictures (opts) {
  return await fengming
    .post('/creative/image')
    .send(reverseCamelcase(opts))
    .json()
}

// 查询规划师拓词
export const queryBaiduExpandWords = paginationWrapper(
  async (opts) => (await fengming
    .post('/keyword/recommand-details/word')
    .send(reverseCamelcase(opts))
    .json())
    .data,
  resp => ({
    data: (resp || []).map(x => ({
      ...x,
      keyword: x.word
    }))
  })
)

export async function queryAds (opts = {}) {
  const q = {
    offset: 0,
    limit: 3,
    ...opts
  }

  if (isArray(q.adIds)) {
    q.adIds = q.adIds.join(',')
  }

  if (!isPro && localStorage.getItem('__bax_user_ads')) {
    const data = JSON.parse(localStorage.getItem('__bax_user_ads'))
    return {
      ads: toCamelcase(data),
      total: data.length
    }
  }

  const body = await fengming
    .get('/simple/ad')
    .query(reverseCamelcase(trim(q)))
    .json()

  return {
    ads: toCamelcase(body.data),
    total: body.meta.count
  }
}

export async function updateCampaignDailyBudget (opts) {
  const body = await fengming
    .post('/campaign/daily_budget')
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function updateCampaignRatio (opts) {
  const body = await fengming
    .post('/campaign/ratio')
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function updateCampaignTimeRange (opts) {
  const body = await fengming
    .post('/campaign/valid_time')
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function addUserLead (opts) {
  const body = await fengming
    .post('/new_user_leads')
    .send(reverseCamelcase(opts))
    .json()

  return body
}

export async function createOrder (order) {
  const body = await fengming
    .post('/order')
    .send(reverseCamelcase(order))
    .json()

  return body.data
}

export async function getProducts (type = 3) {
  const body = await fengming
    .get('/product')
    .query(reverseCamelcase({
      productTypes: isArray(type) ? type.join(',') : type
    }))
    .json()

  return toCamelcase(body.data)
}

export async function getProductsByMchId (mchId) {
  const body = await fengming
    .get('/products')
    .query(reverseCamelcase({
      mchId
    }))
    .json()

  return toCamelcase(body.data)
}

export async function getProductsByMchCode (mchCode) {
  const body = await fengming
    .get('/products/merchantcode')
    .query(reverseCamelcase({
      mchCode
    }))
    .json()

  return toCamelcase(body.data)
}

export async function getProductPackages (type = 0) {
  const body = await fengming
    .get('/product/package')
    .query({
      package_type: type
    })
    .json()

  return toCamelcase(body.data)
}

export async function getCampaignInfo (id) {
  const body = await fengming
    .get(`/campaign/${id}`)
    .json()

  return toCamelcase(body.data)
}

export async function updateCampaign (id, data) {
  const body = await fengming
    .post(`/campaign/${id}`)
    .send(reverseCamelcase(data))
    .json()

  return body
}

export async function createCampaign (data) {
  const body = await fengming
    .post('/campaign/create')
    .send(reverseCamelcase(data))
    .json()

  return body.data
}

export async function activeCampaigns (ids) {
  const body = await fengming
    .post('/campaign/pause')
    .send(reverseCamelcase({
      campaignIds: [...ids],
      pause: 0
    }))
    .json()

  return body
}

export async function pauseCampaigns (ids) {
  const body = await fengming
    .post('/campaign/pause')
    .send(reverseCamelcase({
      campaignIds: [...ids],
      pause: 1
    }))
    .json()
  return body
}

export async function pauseGroup (ids) {
  const body = await fengming
    .post('/group/pause')
    .send(reverseCamelcase({
      group_ids: [...ids],
      pause: 0
    }))
    .json()
  return body
}

export async function getCurrentCampaigns (opts) {
  const query = reverseCamelcase(trim({
    offset: 0,
    limit: 20,
    ...opts
  }))

  if (query.id) {
    // 这里的逻辑是不是怪怪的 ? 哈哈, 因为:
    // @嘟嘟噜 说: 你自己根据 `id` 调详情接口吧
    const campaigns = []
    try {
      const campaign = await getCampaignInfo(query.id)
      campaigns.push(campaign)
    } catch (err) {
      console.warn(err)
    }

    return {
      query: {
        ...query,
        total: campaigns.length
      },
      campaigns
    }
  }

  const [campaigns, total] = await Promise.all([
    _getCurrentCampaigns(query),
    getCurrentCampaignCount(query)
  ])

  return {
    query: {
      ...query,
      total
    },
    campaigns
  }
}

export async function getCurrentBalance () {
  const body = await fengming
    .get('/balance/current')
    .json()

  return body.data
}

export async function checkCreativeContent (opts) {
  const body = await fengming
    .post('/creative/validate')
    .send(reverseCamelcase(opts))
    .json()

  return body.data
}

export async function getQiqiaobanPageList () {
  const body = await fengming
    .get('/creative/url/qiqiaoban')
    .json()

  return toCamelcase(body.data)
}

export async function getRecommandCreative (opts) {
  const body = await fengming
    .get('/creative/recommand')
    .query(reverseCamelcase(opts))
    .json()

  return toCamelcase(body.data)
}

// TODO: 添加计划ID
export async function recommendByUrl (opts) {
  const body = await fengming
    .post('/keyword/recommand/vad')
    .send(reverseCamelcase(opts))
    .json()

  return fmtWords(toCamelcase(body.data))
}

export async function recommendByWord (word, opts) {
  const body = await fengming
    .post('/keyword/recommand/word')
    .send(reverseCamelcase({ word, ...opts }))
    .json()

  const words = fmtWords(toCamelcase(body.data))
  if (isArray(words)) {
    const first = words.find(w => w.word === word)
    if (first) {
      return [first, ...words.filter(w => w.word !== word)]
    }
  }

  return words
}

export async function recommendByWordList (word, opts) {
  const body = await fengming
    .post('/keyword/recommand/word-list')
    .send(reverseCamelcase({ words: word, ...opts }))
    .json()

  const result = toCamelcase(body.data)
  if (result && isObj(result)) {
    for (const key in result) {
      result[key] = fmtWords(toCamelcase(result[key]))
    }
  }
  return result
}

export async function chibiRobotAudit (words, opts) {
  const body = await fengming
    .post('/chibi/robot/audit')
    .send(reverseCamelcase({ contents: words, ...opts }))
    .json()

  const result = toCamelcase(body.data)
  if (result && isObj(result)) {
    for (const key in result) {
      result[key] = fmtWordsByContent(toCamelcase(result[key]))
    }
  }
  return result
}

export async function getChangeLogs (opts) {
  const { data } = await fengming
    .get('/balance/changelog')
    .query(reverseCamelcase(opts))
    .json()

  return {
    total: data.totalElements,
    logs: toCamelcase(data.data)
  }
}

export async function getLogs (queryParmas = {}) {
  const { meta, data } = await fengming
    .get('/timeline/query')
    .query(reverseCamelcase(queryParmas))
    .json()

  return toCamelcase({
    logs: data,
    total: meta.count
  })
}

export async function getSummary () {
  const [balance, daily] = await Promise.all([
    getCurrentBalance(),
    _getDailySummary()
  ])

  return {
    balance,
    ...daily
  }
}

export async function getHomepageSummary () {
  const [campaignCount, balance, daily] = await Promise.all([
    getCurrentCampaignCount(),
    getCurrentBalance(),
    _getDailySummary()
  ])

  return {
    balance,
    campaignCount,
    ...daily
  }
}

export async function getHomePageFengmingData () {
  const [balanceBrief, daily, notices] = await Promise.all([
    getCurrentBalanceBreif(WHOLE_SPU_CODE),
    _getDailySummary(),
    getFengmingNotice()
  ])

  return {
    balance: balanceBrief.currentBalance, // tip： 兼容原有逻辑，二期更改
    freezeBalance: balanceBrief.freezeBalance,
    notices,
    ...daily
  }
}

export async function getFengmingNotice (opts) {
  const body = await fengming
    .get('/dashboard/notice')
    .query(opts)
    .json()

  return body.data
}

export async function getQiqiaobanCoupon (campaignId) {
  const body = await fengming
    .get('/coupon/qiqiaoban')
    .query(reverseCamelcase({ campaignId }))
    .json()

  return body.data
}

export async function getCurrentCampaignCount (opts) {
  const body = await fengming
    .get('/campaign/current/count')
    .query(opts)
    .json()

  return body.data
}

export async function sendQuestion (content) {
  const body = await fengming
    .post('/qa')
    .send({ content })
    .json()

  return body.data
}

export async function huodongLeads (opts) {
  const option = {
    contactName: '无',
    sourceType: 50,
    remark: '您的用户对搜索通年终狂欢购活动有意向，快去跟进吧！',
    ...opts
  }
  const body = await fengming
    .post('/crm_leads')
    .send(reverseCamelcase({ data: option }))
    .json()

  return body
}

export async function changeCampaignKeywordsPrice (campaignId, price) {
  const body = await fengming
    .post(`/campaign/${campaignId}/keyword`)
    .send({ price })
    .json()

  return body.data
}

export async function getDashboardHeader () {
  const [balance, dailyReport] = await Promise.all([
    getCurrentBalance(),
    _getDailySummary()
  ])

  return {
    balance,
    ...dailyReport
  }
}

export async function changeCampaignKeywordsMatchType (campaignId, matchType) {
  const body = await fengming
    .post(`/campaign/${campaignId}/keyword_match`)
    .send(reverseCamelcase({ matchType }))
    .json()

  return body.data
}

/**
 * 创建单元
 * @param {string} name
 * @param {string} landing_page
 * @param {number} landing_type
 * @param {number} landing_page_id
 * @param {array} creatives [{title: '', content: ''}]
 * @param {array} negative_words [{word: ''}]
 * @param {array} keywords [{word: ''}]
 * @param {number} price
 * @param {number} mobile_price_ratio
 */
export async function createGroup (data) {
  const body = await fengming
    .post('/group')
    .send(reverseCamelcase(data))
    .json()

  return body.data
}

/**
 * 更新单元
 * @param {string} name
 * @param {string} landing_page
 * @param {number} landing_type
 * @param {number} landing_page_id
 * @param {array} newCreatives [{title: '', content: ''}]
 * @param {array} updatedCreatives [{id: '', title: '', content: ''}]
 * @param {array} deletedCreatives [1, 2, 3]
 * @param {array} newKeywords [{word: '', price: '', matchType: ''}]
 * @param {array} updatedKeywords [{id: '', word: '', price: '', matchType: ''}]
 * @param {array} deletedKeywords [1, 2, 3]
 * @param {array} newNegativeWords [{word: ''}]
 * @param {array} deletedNegativeWords [1, 2, 3]
 * @param {number} mobile_price_ratio
 */
export async function updateGroup (id, data) {
  const body = await fengming
    .post(`/group/${id}`)
    .send(reverseCamelcase(data))
    .json()

  return body.data
}

/**
 * 更加单元id获取单元下的关键词
 * @param {number} group_id
 */
export async function getKeywordsByGroupId (groupId) {
  const body = await fengming
    .get('/keyword/list_by_group')
    .query(reverseCamelcase({
      groupId
    }))
    .json()

  return toCamelcase(body.data)
}

/**
 * 根据计划id获取用户关键词的总数（包含所有单元的关键词数量）
 * @param {number} campaign_id
 */
export async function getCampaignKeywordsCount (campaignId) {
  const body = await fengming
    .get('/keyword/count')
    .query(reverseCamelcase({
      campaignId
    }))
    .json()

  return body.data
}

/**
 * 根据单元id获取关键词或否定关键词是否已在（计划关键词、单元关键词、单元否词）中
 * @param {number} group_id
 * @param {number} campaign_id
 * @param {array} keywords
 */
export async function getWordsExistInGroupOrCampaign (data) {
  const body = await fengming
    .post('/keyword/check_keywords_in_words')
    .send(reverseCamelcase(data))
    .json()

  return (body.data || []).map(o => o.toLowerCase())
}

/**
 * 获取用户下的所有计划信息
 * @param {number} campaign_id
 * @param {array} statuses
 * @param {array} areas
 * @param {string} sources
 * @param {number} limit
 * @param {number} offset
 */
export async function getAllCampaigns (opts) {
  const body = await fengming
    .post('/campaign/info')
    .send(reverseCamelcase(opts))
    .json()

  return toCamelcase(body.data)
}

/**
 * 获取用户下的所有单元信息
 * @param {number} campaign_id
 * @param {array} statuses
 * @param {array} sources
 * @param {string} group_name
 * @param {string} user_id
 * @param {number} limit
 * @param {number} offset
 */
export async function getAllGroups (opts) {
  const body = await fengming
    .post('/group/info')
    .send(reverseCamelcase(opts))
    .json()

  return toCamelcase(body.data)
}

/**
 * 根据单元id获取单元详情
 * @param {number} groupId
 */
export async function getGroupDetailByGroupId (groupId) {
  const body = await fengming
    .get(`/group/${groupId}`)
    .json()

  const group = toCamelcase(body.data)

  if (!group.landingPageId) {
    // why ? 不想多说什么了, 呵呵
    if (group.landingPage && group.landingPage.includes('vad_id')) {
      const search = (new URL(group.landingPage)).search
      const o = qs.parse(search)
      if (o.vad_id) {
        group.landingPageId = o.vad_id
      }
    }
  }

  return group
}

/**
 * 激活单元
 * @param {array} groupIds
 * @param {number} pause
 */
export async function activeGroups (ids) {
  const body = await fengming
    .post('/group/pause')
    .send(reverseCamelcase({
      groupIds: [...ids],
      pause: 0
    }))
    .json()

  return body
}

/**
 * 暂停单元
 * @param {array} groupIds
 * @param {number} pause
 */
export async function pauseGroups (ids) {
  const body = await fengming
    .post('/group/pause')
    .send(reverseCamelcase({
      groupIds: [...ids],
      pause: 1
    }))
    .json()

  return body
}

/**
 * 单元接口批量改价
 * @param {number} groupId
 * @param {number} price
 */
export async function changeGroupKeywordsPrice (groupId, price) {
  const body = await fengming
    .post(`/group/${groupId}/keyword`)
    .send({ price })
    .json()

  return body.data
}

/**
 * 单元接口批量匹配模式
 * @param {number} groupId
 * @param {number} matchType
 */
export async function changeGroupKeywordsMatchType (groupId, matchType) {
  const body = await fengming
    .post(`/group/${groupId}/keyword_match`)
    .send(reverseCamelcase({ matchType }))
    .json()

  return body.data
}

/**
 * private
 */

async function _getCurrentCampaigns (opts) {
  const body = await fengming
    .get('/campaign/current')
    .query(opts)
    .json()

  return toCamelcase(body.data)
}

async function _getDailySummary () {
  const body = await fengming
    .get('/campaign/daily_simple_report')
    .json()

  return toCamelcase(body.data)
}

/**
 * private
 */

function fmtWords (words) {
  if (!isArray(words)) {
    return words
  }

  return words.map(w => ({
    id: w.word,
    ...w
  }))
}

function fmtWordsByContent (words) {
  if (!isArray(words)) {
    return words
  }

  return words.map(w => ({
    id: w.content,
    word: w.content,
    ...w
  }))
}
