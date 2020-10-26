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
  return { provinceMapping: data.cnToEnMap, provinces: data.provinceCitiesMap }
}

// 优选词逻辑
export async function createPreferredWords(opts) {
  return await qianci
    .post('/promote/create')
    .send(opts)
    .json()
}

// 获取查词记录
export async function getKeywordsList(opts) {
  if (useTestData)
    return (await qianci
      .get('/promote/keywords')
      .query(opts)
      .json())
      .data
}

// 获取优选词展现数据
export async function getPreferredWordsPV(opts = {}) {
  return {
    count: Math.floor(Math.random() * 500 + 100),
    pvs: Math.floor(Math.random() * 2800 + 200)
  }
  return (await qianci
    .post('/promotwe/user/ranking')
    .send(opts)
    .json())
    .data
}

// 获取优选词列表
export const getPreferredWordsList = paginationWrapper(async function (opts = {}) {
  if (useTestData) {
    const data = Array.apply(null, { length: 101 }).map((x, i) => ({
      createTime: Math.floor(+new Date() / 1000),
      id: String(i),
      coreWord: '核心词',
      expandedWord: Array.apply(null, { length: Math.floor(Math.random() * 7) + 2 }).join('测试优选词'),
    }))
    await pause()
    return {
      data,
      total: data.length
    }
  }
  return (await qianci
    .get('/promote/keyword/expandedWord')
    .query(opts)
    .json())
})

// 获取推广物料信息
export async function getCreative(opts = {}) {
  if (useTestData) {
    return {
      coreWord: '测试核心词',
      landingType: 2,
      landingPage: 'http://laomuziji.mvp.baixing.com',
      landingPageId: 4198,
      creativeTitle: '测试投放标题',
      creativeContent: '投放内容投放内容投放内容投放内容投放内容投放内容'
    }
  }
  return await qianci
    .post('/user/promote/update')
    .send(opts)
    .json()
}

// 更新推广物料信息
export async function saveCreative(opts = {}) {
  if (useTestData) {
    return { id: 'test' }
  }
  return await qianci
    .post('/user/promote/update')
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
  if (useTestData) {
    const data = Array.apply(null, { length: 15 }).map((x, i) => ({
      id: String(i),
      coreWord: '核心词',
      provinces: ['上海', '北京'],
      platform: Math.floor(Math.random() * 3),
      semStatus: Math.floor(Math.random() * 4),
      status: Math.floor(Math.random() * 18),
      tradeDate: Math.floor(+new Date() / 1000),
      remainDate: '1787184000'
    }))
    await pause()
    return {
      data,
      total: data.length * 5
    }
  }
  return (await qianci
    .get('/user/promotes')
    .query(opts)
    .json())
    .data
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
