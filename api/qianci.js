/* eslint-disable */

import { qianci } from './base'

// 优选词列表 - 获取优选词展现数据
export async function getPreferredWordsPV(opts = {}) {
  return await {
    wordCounts: 1200,
    pvs: Math.floor(Math.random() * 2800 + 200)
  }
  return (await qianci
    .post('/promote/user/ranking')
    .send(opts)
    .json())
    .data
}

// 优选词列表 - 根据核心词获取优选词
export async function getPreferredWordsList(opts = {}) {
  const data = Array.apply(null, { length: 15 }).map((x, i) => ({
    createTime: Math.floor(+new Date() / 1000),
    id: i,
    word: '核心词',
    preferredWords: ['测试优选词', '测试优选词', '测试优选词', '测试优选词', '测试优选词'],
  }))
  return await {
    data,
    total: data.length * 5
  }
}
