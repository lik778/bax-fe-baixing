<template>
  <div class="keyword-view-container">
    <keyword-view v-for="(value, key) in keywordOptions"
                  :key="key"
                  :type="key"
                  :title="value.title"
                  :keywords="value.keywords"
                  @edit="editKeyword"
                  @delete="deleteKeyword"
                  @pop-keyword-input="popKeywordInputDialog"></keyword-view>
    <keyword-input :visible="visible"
                   @words="updateKeywords"
                   @close="visible = false"
                   :type="activeType"
                   :info="getProp('info')"
                   :title="getProp('inputTitle')"
                   :placeholder="getProp('placeholder')"></keyword-input>
  </div>
</template>

<script>
import KeywordView from './view'
import KeywordInput from './input'

const keywordOptions = {
  A: {
    type: 'A',
    title: '服务城市/地区（A类词）',
    inputTitle: '添加服务城市',
    info: `<p>可通过“城市选择”添加服务城市，也可以在输入框中自填地域；</p>
           <p>多个关键词换行、中英文逗号隔开；</p>
           <p>词数不低于15个。</p>`,
    placeholder: '如:，闵行区，徐汇区，七莘路，七宝镇，...',
    keywords: [],
    keywordsAlias: 'customAreas',
    wordsLimit: [15, Number.MAX_SAFE_INTEGER]
  },
  B: {
    type: 'B',
    title: '前缀词（B类词）',
    inputTitle: '添加前缀词',
    info: `<p>多个关键词换行、中英文逗号隔开；</p>
           <p>词数不低于10个。</p>`,
    placeholder:
      '如：，专业的，靠谱的，周边，附近，电话，费用，价格，推荐，...',
    keywords: [],
    keywordsAlias: 'prefixWordList',
    wordsLimit: [10, 100]
  },
  C: {
    type: 'C',
    title: '业务关键词（C类词）',
    inputTitle: '添加业务关键词',
    info: `<p>多个关键词换行、中英文逗号隔开；</p>
            <p>词数不低于15个。</p>`,
    placeholder:
      '如：，空调维修，空调移机，物品回收，黄金回收，挖掘机，推土机，...',
    keywords: [],
    keywordsAlias: 'keywords',
    wordsLimit: [10, 100]
  },
  D: {
    type: 'D',
    title: '后缀词（D类词）',
    inputTitle: '添加后缀词',
    info: `<p>多个关键词换行、中英文逗号隔开；</p>
           <p>词数不低于10个。</p>`,
    placeholder: '如：电话，费用，价格，推荐，...',
    keywords: [],
    keywordsAlias: 'suffixWordList',
    wordsLimit: [10, 100]
  }
}

const validateKeywordLen = (typeObj) => {
  const { wordsLimit, keywords, type } = typeObj
  const len = keywords.length
  if (len < wordsLimit[0]) return `${type}类词数限制不低于${wordsLimit[0]}`
  if (len > wordsLimit[1]) return `${type}类词数限制不高于${wordsLimit[1]}`
}

export default {
  name: 'Keyword',
  data() {
    return {
      visible: false,
      keywordOptions,
      activeType: 'A'
    }
  },
  components: {
    KeywordInput,
    KeywordView
  },
  // created() {
  //   for (let key in this.keywordOptions) {
  //     this.keywordOptions[key].placeholder = this.keywordOptions[key].placeholder.replace(/[,，]]/, '&#13;&#10;')
  //   }
  // },
  methods: {
    getProp(prop) {
      const existKeywordObj = this.keywordOptions[this.activeType]
      return existKeywordObj && existKeywordObj[prop]
    },
    popKeywordInputDialog(type) {
      this.visible = true
      this.activeType = type
    },
    updateKeywords(obj) {
      let { type, words } = obj
      words = words
        .trim()
        .split(/[\n，,]]*/g)
        .map((row) => row.trim())
        .filter((row) => row !== '')
      let keywords = this.keywordOptions[type].keywords
      keywords = [...new Set(words.concat(keywords))]

      this.keywordOptions[type].keywords = keywords
    },
    editKeyword(obj) {
      const { type, index } = obj
      this.$prompt('', '编辑词语', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.keywordOptions[type].keywords[index]
      })
        .then(({ value }) => {
          this.keywordOptions[type].keywords.splice(index, 1, value)
        })
        .catch(() => {})
    },
    deleteKeyword(obj) {
      const { type, index } = obj
      this.keywordOptions[type].keywords.splice(index, 1)
    },
    getValues() {
      return Object.values(this.keywordOptions).reduce((curr, item) => {
        const errMsg = validateKeywordLen(item)
        if (errMsg) throw new Error(errMsg)
        const keywordLabel = item.keywordsAlias
        curr[keywordLabel] = item.keywords
        return curr
      }, {})
    }
  }
}
</script>

<style lang="postcss" scoped>
.keyword-view-container {
  display: flex;
  align-items: center;
  & > div {
    margin-right: 16px;
  }
}
</style>