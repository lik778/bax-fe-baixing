<template>
  <div class="negative-words">
    <div class="search">
      <el-input class="input"
                v-model="word"
                placeholder="请输入否词" />
      <el-button class="btn"
                 type="warning"
                 :disabled="isSales"
                 :loading="loading"
                 @click="addNegativeWords">添加</el-button>
      <el-button class="btn"
                 type="primary"
                 :disabled="isSales"
                 @click="negativeWordsDialogVisible = true">批量添加否定关键词</el-button>
      <span class="num"
            v-if="showTip">(否词关键词个数不得超过<strong>{{ negativeKeywordsMax }}</strong>个, 当前否词数量:
        <strong>{{ negativeWords.length }}</strong>个）</span>
    </div>
    <div class="res">
      <template v-if="isAllowWord">
      <div class="accurate" v-if="accurateWord.length">
        <span>精确否定：</span>
        <div class="word">
            <el-tag class="tag"
              type="primary"
              v-for="(item) in accurateWord"
              :key="item.word"
              @close="removeNegativeWord(item)"
              closable>{{ item.word }}
           </el-tag>
        </div>
      </div>
      <div class="accurate" v-if="phraseWord.length">
        <span>短语否定：</span>
        <div class="word">
            <el-tag class="tag"
              type="primary"
              v-for="(item) in phraseWord"
              :key="item.word"
              @close="removeNegativeWord(item)"
              closable>{{ item.word }}
           </el-tag>
        </div>
      </div>
      </template>
      <template v-else>
            <el-tag class="tag"
              type="primary"
              v-for="(item,idx) in negativeWords"
              :key="item.word"
              @close="removeOtherWord(idx)"
              closable>{{ item.word }}
           </el-tag>
      </template>

    </div>
    <negative-words-dialog :visible="negativeWordsDialogVisible"
                           :all-words="allWords"
                           :negative-keywords-max="negativeKeywordsMax"
                           @close="negativeWordsDialogVisible = false"
                           @update-negative-words="updateNegativeWords"
                           :WordUser="isAllowWord"
                           :negative-words="negativeWords" />
    <negative-word-alone
      :visible="negativeWordsAloneVisible"
      @close="negativeWordsAloneVisible = false"
      @upWord="upWordAlone"
    />
  </div>
</template>

<script>
import negativeWordsDialog from 'com/common/qwt/negative-word-dialog'
import negativeWordAlone from 'com/common/qwt/negative-word-alone'
import { NEGATIVE_KEYWORDS_MAX } from 'constant/fengming'
import { getWordAuthority } from 'api/fengming'
import { validateKeyword } from 'util/campaign'
import { getNotExistWords } from 'util/group'
import qs from 'query-string'
export default {
  name: 'negative-words',
  props: {
    allWords: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    negativeKeywordsMax: {
      type: Number,
      default: NEGATIVE_KEYWORDS_MAX
    },
    negativeWords: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    showTip: {
      type: Boolean,
      default: true
    },
    isSales: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default () {
        return {}
      },
      required: true
    }
  },
  data () {
    return {
      word: '',
      negativeWordsDialogVisible: false,
      loading: false,
      negativeWordsAloneVisible: false,
      upWordAloneDialog: '',
      accurateWord: [],
      phraseWord: [],
      userId: this.$route.query.user_id || '',
      isAllowWord: false
    }
  },
  methods: {
    async addNegativeWords () {
      if (this.isAllowWord) {
        this.negativeWordsAloneVisible = true
      } else {
        this.negativeWordsAloneVisible = false
        this.addUpWordAlone()
      }
    },
    removeNegativeWord (item) {
      this.$emit('remove-negative-words', item)
    },
    removeOtherWord (item) {
      this.$emit('remove-other-words', item)
    },
    updateNegativeWords (words) {
      this.$emit('add-negative-words', words)

      this.$emit('track', 'click-button: add-negative-keyword-list', {
        negativeWordsLen: words.length,
        negativeWords: words.map(o => o.word).join(',')
      })
    },
    upWordAlone (word) {
      this.upWordAloneDialog = word
      if (this.upWordAloneDialog === '') {
        return
      }
      this.addUpWordAlone()
    },
    addUpWordAlone () {
      const val = this.word.trim()
      let emitWords = []
      if (val === '') return
      if (this.negativeWords.length + 1 > this.negativeKeywordsMax) {
        return this.$message.error(`否定关键词个数不能超过${this.negativeKeywordsMax}`)
      }
      this.loading = true
      try {
        validateKeyword([val])
        const newWords = getNotExistWords(this.allWords, [val])
        if (!newWords.length) throw new Error('否词已存在关键词或否词列表中，请更换关键词')
        if (this.isAllowWord) {
          const matchType = this.upWordAloneDialog === 'accurate' ? 0 : 1
          emitWords = [{ word: val, matchType }]
        } else {
          emitWords = [{ word: val, matchType: 0 }]
        }
        this.$emit('add-negative-words', emitWords)
        this.$emit('track', 'click-button: add-negative-keyword')
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.word = ''
        this.loading = false
      }
    }
  },
  watch: {
    negativeWords: {
      deep: true,
      immediate: true,
      handler (newV, oldV) {
        if (newV && newV.length > 0) {
          this.accurateWord = newV.filter(item => item.matchType === 0)
          this.phraseWord = newV.filter(item => item.matchType === 1)
        } else {
          this.accurateWord = this.phraseWord = []
        }
      }
    }
  },
  components: {
    negativeWordsDialog,
    negativeWordAlone
  },
  async created () {
    const { user_id: userId } = qs.parse(location.search)
    const { data } = await getWordAuthority({ userId })
    this.isAllowWord = data !== 0
  }

}
</script>

<style lang="scss" scoped>
.negative-words {
  .title {
    color: #666;
    font-size: 14px;
    .el-icon-question {
      cursor: pointer;
    }
  }
  .search {
    // margin-top: 20px;
    .input {
      width: 240px;
      margin-right: 14px;
    }
    .num {
      font-size: 12px;
      font-weight: 400;
      margin-left: 10px;
      > strong {
        color: $c-strong;
      }
    }
  }
  .tip {
    font-size: 12px;
    color: #6a778c;
  }
  .res {
    margin-top: 20px;
    .tag {
      margin-right: 5px;
      margin-bottom: 5px;
    }
    .accurate {
      display: flex;
      flex-direction: column;
      margin: 10px 0;
      .word {
        width: 100%;
        margin-top: 10px;
      }
    }
  }
}
</style>
