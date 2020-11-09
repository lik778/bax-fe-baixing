/**
 * 计算千词的 ABCD 词的个数
 * @param {Object} wordsMap，形如 {A:[],B:[],C:[],D:[]}
 */
export function qcWordAll(wordsMap) {
  return wordsMap.A * wordsMap.B + wordsMap.B * wordsMap.C +
    wordsMap.C * wordsMap.D + wordsMap.A * wordsMap.B * wordsMap.C +
    wordsMap.A * wordsMap.C * wordsMap.D +
    wordsMap.B * wordsMap.C * wordsMap.D +
    wordsMap.A * wordsMap.B * wordsMap.C * wordsMap.D
}
