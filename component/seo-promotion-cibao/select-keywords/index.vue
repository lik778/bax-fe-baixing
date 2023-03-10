<template>
  <div class="keyword-container">
    <div class="view-container">
      <keyword-view v-for="(value, key) in keywordOptions"
                    :key="key"
                    :type="key"
                    class="keyword-view"
                    :title="value.title"
                    :keywords="value.keywords"
                    @edit="editKeyword"
                    @delete="deleteKeyword"
                    @pop-keyword-input="popKeywordInputDialog"></keyword-view>
    </div>
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
import clone from 'clone'

const keywordOptions = {
  A: {
    type: 'A',
    title: '服务城市/地区（A类词）',
    inputTitle: '添加服务城市',
    info: `<p>可通过“城市选择”添加服务城市，也可以在输入框中自填地域；</p>
           <p>多个关键词换行、中英文逗号隔开；</p>
           <p>词数不少于15个，不超过500个字；</p>
           <p>单个词长度不少于2个字，不超过8个字。</p>`,
    placeholder: '如:，上海，闵行区，徐汇区，七莘路，七宝镇，...',
    keywords: [],
    keywordsAlias: 'customAreas',
    wordsLimit: [15, 500],
    wordLenLimit: [2, 8]
  },
  B: {
    type: 'B',
    title: '前缀词（B类词）',
    inputTitle: '添加前缀词',
    info: `<p>多个关键词换行、中英文逗号隔开；</p>
           <p>词数不少于10个，不超过100个字；</p>
           <p>单个词长度不少于2个字，不超过8个字。</p>`,
    placeholder:
      '如：，专业的，靠谱的，周边，附近，电话，费用，价格，推荐，...',
    keywords: [],
    keywordsAlias: 'prefixWordList',
    wordsLimit: [10, 100],
    wordLenLimit: [2, 8]
  },
  C: {
    type: 'C',
    title: '业务关键词（C类词）',
    inputTitle: '添加业务关键词',
    info: `<p>多个关键词换行、中英文逗号隔开；</p>
           <p>词数不少于15个，不超过100个字；</p>
           <p>单个词长度不少于2个字，不超过8个字。</p>`,
    placeholder:
      '如：，空调维修，空调移机，物品回收，黄金回收，挖掘机，推土机，...',
    keywords: [],
    keywordsAlias: 'keywords',
    wordsLimit: [15, 100],
    wordLenLimit: [2, 8]
  },
  D: {
    type: 'D',
    title: '后缀词（D类词）',
    inputTitle: '添加后缀词',
    info: `<p>多个关键词换行、中英文逗号隔开；</p>
           <p>词数不少于10个，不超过100个字；</p>
           <p>单个词长度不少于2个字，不超过8个字。</p>`,
    placeholder: '如：，电话，费用，价格，推荐，...',
    keywords: [],
    keywordsAlias: 'suffixWordList',
    wordsLimit: [10, 100],
    wordLenLimit: [2, 8]
  }
}

const validateKeywordsLen = (typeObj) => {
  const { wordsLimit, keywords, type } = typeObj
  const len = keywords.length
  if (len < wordsLimit[0]) return `${type}类词数限制不低于${wordsLimit[0]}`
  if (len > wordsLimit[1]) return `${type}类词数限制不高于${wordsLimit[1]}`
}

export default {
  name: 'Keyword',
  props: {
    originKeywords: {
      type: Object,
      required: false,
      default () {
        return Object.values(keywordOptions).reduce((curr, item) => {
          curr[item.keywordsAlias] = []
          return curr
        }, {})
      }
    }
  },
  data () {
    return {
      visible: false,
      keywordOptions: clone(keywordOptions),
      activeType: 'A'
    }
  },
  components: {
    KeywordInput,
    KeywordView
  },
  created () {
    Object.values(this.keywordOptions).forEach((item) => {
      this.keywordOptions[item.type].placeholder = item.placeholder.replace(
        /[,，]]*/g,
        '<br/>'
      )
    })
  },
  methods: {
    getProp (prop) {
      const existKeywordObj = this.keywordOptions[this.activeType]
      return existKeywordObj && existKeywordObj[prop]
    },
    popKeywordInputDialog (type) {
      this.visible = true
      this.activeType = type
    },
    updateKeywords (obj) {
      let { type, words } = obj
      const wordLenLimit = this.keywordOptions[type].wordLenLimit

      words = words
        .trim()
        .split(/[\n，,]]*/g)
        .map((row) => row.trim())
        .filter(
          (row) =>
            row !== '' &&
            row.length >= wordLenLimit[0] &&
            row.length <= wordLenLimit[1]
        )

      let keywords = this.keywordOptions[type].keywords

      keywords = [...new Set(words.concat(keywords))]

      this.keywordOptions[type].keywords = keywords
    },
    editKeyword (obj) {
      const { type, index } = obj
      const wordLenLimit = this.keywordOptions[type].wordLenLimit

      this.$prompt('', '编辑词语', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.keywordOptions[type].keywords[index]
      })
        .then(({ value }) => {
          const keywords = this.keywordOptions[type].keywords
          if (keywords.includes(value)) {
            return this.$message.error('已存在该关键词，请修改重新提交')
          }
          if (value.length < wordLenLimit[0] || value.length > wordLenLimit[1]) {
            return this.$message.error(`单个词长度不少于${wordLenLimit[0]}个字, 不超过${wordLenLimit[1]}个字`)
          }
          this.keywordOptions[type].keywords.splice(index, 1, value)
        })
        .catch(() => {})
    },
    deleteKeyword (obj) {
      const { type, index } = obj
      this.keywordOptions[type].keywords.splice(index, 1)
    },
    getValues () {
      return Object.values(this.keywordOptions).reduce((curr, item) => {
        const errMsg = validateKeywordsLen(item)
        if (errMsg) throw new Error(errMsg)
        const keywordLabel = item.keywordsAlias
        curr[keywordLabel] = item.keywords
        return curr
      }, {})
    }
  },
  watch: {
    originKeywords (newVal) {
      for (const key in this.keywordOptions) {
        const { keywordsAlias, keywords } = this.keywordOptions[key]
        this.keywordOptions[key].keywords = [
          ...new Set(keywords.concat(this.originKeywords[keywordsAlias]))
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.view-container {
  display: flex;
  align-items: center;
  & > div:not(:last-child) {
    margin-right: 16px;
  }
}
</style>
