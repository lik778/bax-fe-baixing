/* eslint-disable */

import { pause } from 'util'
import { qianci } from './base'

// 获取查词记录
export async function getKeywordsList() {
  const data = Array.apply(null, { length: 21 }).map((x, i) => ({
    createdAt: Math.floor(+new Date() / 1000),
    id: String(i),
    word: '核心词',
    areas: ['上海', '北京'],
    status: 1,
    auditStatus: 1
  }))
  return await {
    data,
    total: data.length * 5
  }
}

// 获取优选词展现数据
export async function getPreferredWordsPV(opts = {}) {
  return await {
    pvs: Math.floor(Math.random() * 2800 + 200)
  }
  return (await qianci
    .post('/promote/user/ranking')
    .send(opts)
    .json())
    .data
}

// 根据核心词获取优选词
export async function getPreferredWordsList(opts = {}) {
  const data = Array.apply(null, { length: 15 }).map((x, i) => ({
    createTime: Math.floor(+new Date() / 1000),
    id: String(i),
    word: '核心词',
    preferredWords: ['测试优选词', '测试优选词', '测试优选词', '测试优选词', '测试优选词'],
  }))
  await pause()
  return await {
    data,
    total: data.length * 5
  }
}

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
