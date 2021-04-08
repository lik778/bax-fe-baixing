<template>
  <div class="negative-words">
    <div class="search">
      <el-input class="input"
                v-model="word"
                placeholder="请输入标题（字数限制9～25个字）" />
      <el-button class="btn"
                 type="primary"
                 @click="addNegativeWords">添加否定关键词</el-button>
      <span class="num" v-if="showTip">(否词关键词个数不得超过<strong>{{ NEGATIVE_KEYWORDS_MAX }}</strong>个, 当前否词数量:
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
                           @close="negativeWordsDialogVisible = false"
                           @update-negative-words="updateNegativeWords"
                           :negative-words="negativeWords" />
  </div>
</template>

<script>
import negativeWordsDialog from 'com/common/qwt/negative-word-dialog'

import { NEGATIVE_KEYWORDS_MAX } from 'constant/fengming'
import { validateKeyword } from 'util/campaign'
import { filterExistCurrentWords } from 'util/group'

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
    }
  },
  data () {
    return {
      word: '',
      negativeWordsDialogVisible: false,

      NEGATIVE_KEYWORDS_MAX
    }
  },
  methods: {
    addNegativeWords () {
      const val = this.word.trim()
      if (val === '') {
        this.negativeWordsDialogVisible = true
        return
      }
      if (this.negativeWords.length + 1 > NEGATIVE_KEYWORDS_MAX) {
        return this.$message.error(`否定关键词个数不能超过${NEGATIVE_KEYWORDS_MAX}`)
      }

      const newWords = filterExistCurrentWords(this.allWords, [{ word: val }])
      if (!newWords.length) return this.$message.error(`已存在该关键词或否定关键词：${val}`)

      // TODO: 打接口获取已有的关键词列表

      try {
        validateKeyword([val])
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.word = ''
      }
      this.$emit('add-negative-words', [{ word: val }])
    },
    removeNegativeWord (idx) {
      this.$emit('remove-negative-words', idx)
    },
    updateNegativeWords (words) {
      this.$emit('add-negative-words', words)
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
