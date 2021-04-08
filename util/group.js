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

export function filterExistCurrentWords (originKeywords, newWords) {
  const words = originKeywords.map(w => w.word.toLowerCase())
  return newWords.filter(w => !words.includes(w.word.toLowerCase()))
}

export function getKeyByLen (arr, obj, key) {
  if (!Array.isArray(arr)) return obj
  if (arr.length) {
    return {
      ...obj,
      key: arr
    }
  }
}
