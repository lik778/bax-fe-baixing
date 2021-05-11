import { MATCH_TYPE_PHRASE } from 'constant/fengming'
import { MIN_WORD_PRICE } from 'constant/keyword'

export function fmtNewKeywordsPrice (words) {
  return words.map(w => {
    const { price: serverPrice } = w
    let price = serverPrice * 1.2
    if (price < MIN_WORD_PRICE) {
      price = MIN_WORD_PRICE
    }
    return {
      ...w,
      serverPrice,
      matchType: MATCH_TYPE_PHRASE,
      price // override price, price is display value
    }
  })
}

/**
 * @param {array} originKeywords [{word: '1'}]
 * @param {array} newWords [{word: '1'}]
 */
export function filterExistCurrentWords (originKeywords, newWords) {
  const words = originKeywords.map(w => w.word.toLowerCase())
  return newWords.filter(w => !words.includes(w.word.toLowerCase()))
}

export function getNotExistWords (
  originKeywords = [], // [{word: '1'}]
  newWords = [] // ['1', '2']
) {
  // 本地校验：（单元否词、单元关键词）直接过滤
  const resWords = filterExistCurrentWords(originKeywords, newWords)

  if (!resWords.length) throw new Error('关键词已存在关键词或否词列表中，请更换关键词')
  return resWords
}
