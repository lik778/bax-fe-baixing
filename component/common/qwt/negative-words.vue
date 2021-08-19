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
    <div class="res"
         v-if="negativeWords.length">
      <el-tag class="tag"
              type="primary"
              v-for="(item, idx) in negativeWords"
              :key="item.word"
              @close="removeNegativeWord(idx)"
              closable>{{ item.word }}
      </el-tag>
    </div>
    <negative-words-dialog :visible="negativeWordsDialogVisible"
                           :all-words="allWords"
                           :negative-keywords-max="negativeKeywordsMax"
                           @close="negativeWordsDialogVisible = false"
                           @update-negative-words="updateNegativeWords"
                           :negative-words="negativeWords" />
  </div>
</template>

<script>
import negativeWordsDialog from 'com/common/qwt/negative-word-dialog'

import { NEGATIVE_KEYWORDS_MAX } from 'constant/fengming'
import { validateKeyword } from 'util/campaign'
import { getNotExistWords } from 'util/group'

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
    }
  },
  data () {
    return {
      word: '',
      negativeWordsDialogVisible: false,
      loading: false
    }
  },
  methods: {
    async addNegativeWords () {
      const val = this.word.trim()
      if (val === '') return
      if (this.negativeWords.length + 1 > this.negativeKeywordsMax) {
        return this.$message.error(`否定关键词个数不能超过${this.negativeKeywordsMax}`)
      }

      this.loading = true

      try {
        validateKeyword([val])

        const newWords = getNotExistWords(this.allWords, [val])
        if (!newWords.length) throw new Error('否词已存在关键词或否词列表中，请更换关键词')

        this.$emit('add-negative-words', [{ word: val }])
        this.$emit('track', 'click-button: add-negative-keyword')
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.word = ''
        this.loading = false
      }
    },
    removeNegativeWord (idx) {
      this.$emit('remove-negative-words', idx)
    },
    updateNegativeWords (words) {
      this.$emit('add-negative-words', words)

      this.$emit('track', 'click-button: add-negative-keyword-list', {
        negativeWordsLen: words.length,
        negativeWords: words.map(o => o.word).join(',')
      })
    }
  },
  components: {
    negativeWordsDialog
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
  }
}
</style>
