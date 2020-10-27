/* eslint-disable */

import Fetch from 'fetch.io'
import { paginationWrapper, pause } from 'util'
import { qianci, baseOptions } from './base'

const isDev = process.env.NODE_ENV === 'development'
const useTestData = isDev && true
// 锁词逻辑
export async function keywordLocked(opts) {
  return qianci
    .get('/promote/keyword/isLocked')
    .query(opts)
    .json()
}

// 获取千词核心词
export async function getQcAllAreas() {
  const { data } = await qianci
    .get('/area/all')
    .json()
  const { cnToEnMap, enToCnMap, provinceCitiesMap } = data
  return { cnToEnMap, enToCnMap, provinces: provinceCitiesMap }
}

// 获取单条计划信息
export async function getPromote(promoteId) {
  const body = await qianci
    .get(`/promote/keyword/${promoteId}`)
    .json()
  return body.data
}

// 优选词逻辑
export async function createPreferredWords(opts) {
  return await qianci
    .post('/promote/create')
    .send(opts)
    .json()
}

// 更新BD类词
export async function updatePromoteWords(opts) {
  return await qianci
    .post('/promote/keyword/update')
    .send(opts)
    .json()
}

// 获取查词记录
export async function getKeywordsList(opts) {
  return (await qianci
    .get('/promote/keywords')
    .query(opts)
    .json())
    .data
}

// 获取优选词展现数据
export async function getPreferredWordsPV(opts = {}) {
  const id = opts.id
  return (await qianci
    .get(`/promote/keyword/show/${id}`)
    .query()
    .json())
    .data
}

// 获取优选词列表
export const getPreferredWordsList = paginationWrapper(async function (opts = {}) {
  // * for test const id = 22
  const id = opts.id
  return (await qianci
    .get(`/promote/keyword/expandedWord/${id}`)
    .query()
    .json())
    .data
}, resp => ({
  ...resp,
  data: (resp.expandedWords || []).map(x => ({
    coreWord: resp.coreWord,
    createdTime: resp.createdTime,
    expandedWord: x
  }))
}))

// 获取推广物料信息
export async function getCreative(opts = {}) {
  if (useTestData) {
    return {
      coreWord: '测试核心词',
      landingType: 2,
      landingPage: 'http://laomuziji.mvp.baixing.com',
      landingPageId: 4198,
      creativeTitle: '测试投放标题9个字长度',
      creativeContent: '投放内容投放内容投放内容投放内容投放内容投放内容'
    }
  }
  const id = opts.id
  return await qianci
    .get(`/creative/${id}`)
    .query()
    .json()
}

// 更新推广物料信息
export async function saveCreative(opts = {}) {
  return await qianci
    .post('/promote/creative/update')
    .send(opts)
    .json()
}

// 创建预订单
export async function createPreOrder(opts = {}) {
  return await qianci
    .post('/trade/order/pre')
    .send(opts)
    .json()
}

// 获取推广管理列表
export async function getPromoteList(opts = {}) {
  const { data } = await qianci
    .get('/promote/user/promotes')
    .query(opts)
    .json()

  return {
    content: data.content,
    total: data.totalElements
  }
}

// 获取报表页计划的关键词数据列表
export async function getWordPVsList(opts = {}) {
  if (useTestData) {
    const data = Array.apply(null, { length: 15 }).map((x, i) => ({
      id: String(i),
      coreWord: '核心词',
      crawledBy: '百度',
      platform: Math.floor(Math.random() * 2),
      date: Math.floor(+new Date() / 1000),
    }))
    await pause()
    return {
      data,
      total: data.length * 5
    }
  }
  return (await qianci
    .get('')
    .query(opts)
    .json())
    .data
}

// 获取快照页面
const fetchWithoutPrefix = new Fetch({ ...baseOptions })
export async function getSnapshot(url) {
  // * test file 'https://test-files.obs.cn-east-3.myhuaweicloud.com/snapshot.html.gz'
  return await fetchWithoutPrefix.get(url)
}
