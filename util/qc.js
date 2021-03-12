/**
 * 计算千词的 ABCD 词的个数
 * @param {Object} wordsMap，形如 {A:[],B:[],C:[],D:[]}
 * @param {Array} combineRules example: ['AC', 'AB', 'ACD']
 */
export function qcWordAll (wordsMap, combineRules) {
  return combineRules.reduce((curr, rule) => {
    const total = rule.split('').reduce((iCurr, word) => {
      return iCurr * wordsMap[word]
    }, 1)
    return curr + total
  }, 0)
}
