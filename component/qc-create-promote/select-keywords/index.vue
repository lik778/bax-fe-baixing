<template>
  <div class="keyword-container">
    <section>
      <h3>关键词录入</h3>
      <div class="info">
        <div>说明：
          点击<i class="el-icon-circle-plus-outline"></i>可以添加对应词语，
          点击<i class="el-icon-edit"></i>可以编辑词语，
          点击<i class="el-icon-delete"></i>可以删除词语
        </div>
        <div class="mt-16">添加说明
          <p>A/C类词不支持修改</p>
          <p style="color: #FF6350">B/D类词数限制不低于10词不超过100词</p>
          <p style="color: #FF6350">单个词长度不低于2个字，不超过8个字</p>
          <p style="color: #FF6350">英文字符仅支持小写，输入大写时数据会被强制更改为小写</p>
        </div>
      </div>
    </section>
    <div class="view-container">
      <keyword-view v-for="(value, key) in keywordOptions"
                    :key="key"
                    :type="key"
                    class="keyword-view"
                    :title="value.title"
                    :keywords="value.keywords"
                    :isEdit="value.isEdit"
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
    <div class="mt-45 size-13">
      <div>组合逻辑：A+C、B+C、C+D、A+B+C、A+C+D、B+C+D、A+B+C+D；</div>
      <div>如：上海（A）专业的（B）空调维修（C）多少钱（D）</div>
    </div>
    <div class="action-area">
      <p v-show="!handleDisabled">当前备选词数量：<strong>{{wordNum}}</strong>个</p>
      <p style="color: #FF6350" v-if="errorTips">{{errorTips}}</p>
      <el-button type="primary" :loading="submitWordsLoading" @click="sumbitWords" :disabled="handleDisabled || preventSumbit" size="medium">{{ submitWordsLoading ? '拓词中...' : isEdit ? '更新优选' : '提交优选' }}</el-button>
    </div>
    <el-dialog :close-on-click-modal="false"
               :show-close="false"
               title="提示" :visible.sync="successDialogVisible">
      <div class="success-dialog-box">
        <img src="//file.baixing.net/202010/d4ade9d26b0af9fee07c21665a2de323.png">
        <p>提交成功，后台正在为您优选关键词，稍后请在【查词记录】页面查看进展。</p>
        <router-link :to="{name: 'qc-word-list'}">
          <el-button type="primary" size="medium">确定</el-button>
        </router-link>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import clone from 'clone'

import { createPreferredWords, updatePromoteWords } from 'api/qianci'
import { API_SUCCESS, API_CANNOT_PASS_QUALITY_CHECK } from 'constant/api'
import KeywordView from './view'
import KeywordInput from './input'
import keywordOptions from './keyword-options'

const validateKeywordsLen = (typeObj) => {
  const { wordsLimit, keywords, type } = typeObj
  const len = keywords.length
  if (len < wordsLimit[0]) return `${type}类词数限制不低于${wordsLimit[0]}`
  if (len > wordsLimit[1]) return `${type}类词数限制不高于${wordsLimit[1]}`
}

export default {
  name: 'Keyword',
  props: {
    form: {
      type: Object,
      required: false,
      default() {
        return []
      }
    },
    originKeywords: {
      type: Object,
      required: false,
      default() {
        return Object.values(keywordOptions).reduce((curr, item) => {
          curr[item.keywordsAlias] = []
          return curr
        }, {})
      }
    },
    promote: {
      type: Object
    },
    isEdit: {
      type: Boolean
    }
  },
  data() {
    return {
      visible: false,
      keywordOptions: clone(keywordOptions),
      activeType: 'A',
      successDialogVisible: false,
      submitWordsLoading: false,
      errorTips: '',
      preventSumbit: false
    }
  },
  computed: {
    handleDisabled() {
      return !(this.keywordOptions.B.keywords.length >= 10 && this.keywordOptions.D.keywords.length >= 10)
    },
    wordNum() {
      const ALength = this.keywordOptions.A.keywords.length
      const BLength = this.keywordOptions.B.keywords.length
      const CLength = this.keywordOptions.C.keywords.length
      const DLength = this.keywordOptions.D.keywords.length
      return ALength * BLength + BLength * CLength + CLength * DLength + ALength * BLength * CLength
      + ALength * CLength * DLength + BLength * CLength * DLength + ALength * BLength * CLength * DLength
    }
  },
  components: {
    KeywordInput,
    KeywordView
  },
  async created() {
    Object.keys(this.keywordOptions).forEach(x => {
      if (x === 'A') {
        this.keywordOptions['A'].keywords = this.form.areas.reduce((t, c) => {
          t.push(c.name)
          return t.concat(c.cities)
        }, [])
      } else if (x === 'C') {
        this.keywordOptions['C'].keywords = [this.form.keyword]
      }
    })
    Object.values(this.keywordOptions).map((item) => {
      this.keywordOptions[item.type].placeholder = item.placeholder.replace(
        /[,，]]*/g,
        '<br/>'
      )
    })
  },
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
      const wordLenLimit = this.keywordOptions[type].wordLenLimit

      words = words
        .trim()
        .split(/[\n，,]]*/g)
        .map((row) => row.toLocaleLowerCase().trim())
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
    editKeyword(obj) {
      const { type, index } = obj
      const wordLenLimit = this.keywordOptions[type].wordLenLimit

      this.$prompt('', '编辑词语', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputValue: this.keywordOptions[type].keywords[index]
      })
        .then(({ value }) => {
          const keywords = this.keywordOptions[type].keywords
          if (keywords.includes(value)) {
            return this.$message.error('已存在该关键词，请修改重新提交')
          }
          if (value.toLocaleLowerCase() && keywords.map(k => k.toLocaleLowerCase()).includes(value.toLocaleLowerCase())) {
            return this.$message.error('百度投放仅支持小写，输入大写时数据会被强制更改为小写，输入重复')
          }
          if (value.length < wordLenLimit[0] || value.length > wordLenLimit[1]) {
            return this.$message.error(`单个词长度不少于${wordLenLimit[0]}个字, 不超过${wordLenLimit[1]}个字`)
          }
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
        const errMsg = validateKeywordsLen(item)
        if (errMsg) throw new Error(errMsg)
        const keywordLabel = item.keywordsAlias
        curr[keywordLabel] = item.keywords
        return curr
      }, {})
    },
    async sumbitWords() {
      const { keyword, areas } = this.form
      const { sales_id: salesId } = this.$route.query
      this.submitWordsLoading = true
      const params = { coreWord: keyword,
        provinces: areas.map(x => x.en), prefixWords: this.keywordOptions.B.keywords,
        suffixWords: this.keywordOptions.D.keywords, salesId  }
      const handleFunc = this.isEdit ? updatePromoteWords : createPreferredWords
      if (this.isEdit) {
         params.id = this.promote.id
      }
      const { code, message, data } = await handleFunc(params)
      if (code === API_SUCCESS) {
        this.successDialogVisible = true
      } else if (code === API_CANNOT_PASS_QUALITY_CHECK) {
        this.errorTips = message
      } else {
        Message.warning(message)
      }
      this.submitWordsLoading = false
    }
  },
  watch: {
    wordNum(newVal, oldVal) {
      // 处理编辑逻辑
      if (oldVal !== 0 && this.isEdit) {
        this.preventSumbit = false
      }
    },
    promote:{
      deep: true,
      immediate: true,
      handler(values) {
        if (values) {
          const { coreWord, provinces, prefixWords, suffixWords } = values
          this.keywordOptions.C.keywords = [ coreWord ]
          this.keywordOptions.B.keywords = prefixWords
          this.keywordOptions.D.keywords = suffixWords
          this.preventSumbit = true
        }
      }
    },
    originKeywords(newVal) {
      for (let key in this.keywordOptions) {
        const { keywordsAlias, keywords } = this.keywordOptions[key]
        this.keywordOptions[key].keywords = [
          ...new Set(keywords.concat(this.originKeywords[keywordsAlias]))
        ]
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.view-container {
  display: flex;
  align-items: center;
  & > div:not(:last-child) {
      margin-right: 16px;
  }
}
.keyword-container {
  color: #6a778c;
  margin-top: 28px;
  & h3 {
    position: relative;
    margin-bottom: 20px;
    font-weight: 700;
    &.not-required:after {
       display: none;
     }
    &:after {
       content: '*';
       position: absolute;
       color: red;
       font-size: 12px;
       top: -2px;
       margin-left: 4px;
     }
  }

  & .info {
      font-size: 13px;
      color: inherit;
      padding-bottom: 25px;
  & > p {
      text-indent: 1em;
    }
  & i {
      font-size: 16px;
      margin: 0 3px;
    }
  }
  & .mt-16 {
    margin-top: 16px;
  }
  & .mt-45 {
    margin-top: 45px;
  }
  & .size-13 {
    font-size: 13px;
  }
  & .action-area {
    margin-top: 45px;
    & > p {
      font-size: 14px;
      margin-bottom: 25px;
      & strong {
        font-size: 20px;
        color: #FF6350;
      }
    }
  }
}
.success-dialog-box {
  text-align: center;
  & > img {
    width: 42px;
    height: 42px;
  }
  & > p {
    margin-top: 20px;
    margin-bottom: 47px;
  }
}

</style>
