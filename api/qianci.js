/* eslint-disable */

import { paginationWrapper, pause } from 'util'
import { qianci } from './base'

const isDev = process.env.NODE_ENV === 'development'
const useTestData = isDev && true

// 获取查词记录
export async function getKeywordsList(opts) {
  if (useTestData) {
    const data = Array.apply(null, { length: 15 }).map((x, i) => ({
      createdAt: Math.floor(+new Date() / 1000),
      id: String(i),
      word: '核心词',
      provinces: ['上海', '北京'],
      status: Math.floor(Math.random() * 18),
      reason: '一条长长的失败原因是一条长长的失败原因是一条长长的失败原因是一条长长的失败原因是一条长长的失败原因是一条长长的失败原因',
      auditStatus: 1
    }))
    await pause()
    return await {
      data,
      total: data.length * 5
    }
  }
  return (await qianci
    .get('/api/sem-batch/promote/keywords')
    .query(opts)
    .json())
    .data
}

// 获取优选词展现数据
export async function getPreferredWordsPV(opts = {}) {
  return await {
    count: Math.floor(Math.random() * 500 + 100),
    pvs: Math.floor(Math.random() * 2800 + 200)
  }
  return (await qianci
    .post('/promote/user/ranking')
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
    return await {
      data,
      total: data.length
    }
  }
  return (await qianci
    .get('/api/sem-batch/promote/keyword/expandedWord')
    .query(opts)
    .json())
})

// 获取推广物料信息
export async function getCreative(opts = {}) {
  return await {
    keyword: '核心词',
  }
}

// 创建/更新推广物料信息
export async function saveCreative(opts = {}) {
  return await {}
}

// 创建预订单
export async function createPreOrder(opts = {}) {
  return await 'test'
}

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
    return await {
      data,
      total: data.length * 5
    }
  }
  return (await qianci
    .get('/api/sem-batch/user/promotes')
    .query(opts)
    .json())
    .data
}
