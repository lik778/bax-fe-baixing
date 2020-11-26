/**
 * ! 谨慎修改
 * 这个组件在“千词新建订单”、“千词优选词列表”都有用到
 */
export default {
  A: {
    type: 'A',
    title: '服务城市/地区（A类词）',
    inputTitle: '添加服务城市',
    info: `<p>可通过“城市选择”添加服务城市，也可以在输入框中自填地域；</p>
           <p>多个关键词换行、中英文逗号隔开；</p>
           <p>单个词长度不少于2个字，不超过8个字。</p>`,
    placeholder: '如:，上海，闵行区，徐汇区，七莘路，七宝镇，...',
    keywords: [],
    keywordsAlias: 'provinces',
    wordsLimit: [15, 500],
    wordLenLimit: [2, 8],
    isEdit: false
  },
  B: {
    type: 'B',
    title: '前缀词（B类词）',
    inputTitle: '添加前缀词',
    info: `<p>多个关键词换行、中英文逗号隔开；</p>
           <p>词不少于10个不超过20个；</p>
           <p>单个词长度不少于2个字，不超过8个字；</p>
           <p>百度投放仅支持小写，输入大写时数据会被强制更改为小写。</p>`,
    placeholder:
      '如：，A380、工业、民用、塑料、不锈钢、金属、进口、国产、靠谱、专业、……',
    keywords: [],
    keywordsAlias: 'prefixWords',
    wordsLimit: [10, 20],
    wordLenLimit: [2, 8],
    isEdit: true
  },
  C: {
    type: 'C',
    title: '业务关键词（C类词）',
    inputTitle: '添加业务关键词',
    info: ``,
    placeholder:
      '如：，空调维修，空调移机，物品回收，黄金回收，挖掘机，推土机，...',
    keywords: [],
    keywordsAlias: 'coreWord',
    wordsLimit: [15, 100],
    wordLenLimit: [2, 8],
    isEdit: false
  },
  D: {
    type: 'D',
    title: '后缀词（D类词）',
    inputTitle: '添加后缀词',
    info: `<p>多个关键词换行、中英文逗号隔开；</p>
           <p>词不少于10个不超过20个；</p>
           <p>单个词长度不少于2个字，不超过8个字；</p>
           <p>百度投放仅支持小写，输入大写时数据会被强制更改为小写。</p>`,
    placeholder: '如：，价格、厂商、厂家、批发、多少钱、怎么样、……',
    keywords: [],
    keywordsAlias: 'suffixWords',
    wordsLimit: [10, 20],
    wordLenLimit: [2, 8],
    isEdit: true
  }
}
