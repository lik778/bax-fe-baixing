<template>
  <div class="negative-words">
    <div class="search">
      <el-input class="input" size="medium" v-model="word" placeholder="请输入标题（字数限制9～25个字）"/>
      <el-button class="btn" type="primary" size="medium" @click="addNegativeWords">添加否定关键词</el-button>
      <span class="num">(否词关键词个数不得超过<strong>{{ NEGATIVE_KEYWORDS_MAX }}</strong>个, 当前否词数量: <strong>{{ negativeWords.length }}</strong>个）</span>
    </div>
    <div class="res" v-if="negativeWords.length">
      <el-tag class="tag" type="primary" v-for="item in negativeWords" :key="item.word"
        @close="removeNegativeWord(item)" closable>
        {{ item.word }}
      </el-tag>
    </div>
    <negative-words-dialog
      :visible="negativeWordsDialogVisible"
      @close="negativeWordsDialogVisible = false"
      @update-negative-words="updateNegativeWords"
      :negative-words="negativeWords" />
  </div>
</template>

<script>
import negativeWordsDialog from 'com/common/qwt/negative-word-dialog'

import { NEGATIVE_KEYWORDS_MAX } from 'constant/fengming'
import { validateKeyword } from 'util/campaign'

export default {
  name: 'negative-words',
  props: {
    negativeWords: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
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

      const existWord = this.negativeWords.find(o => o.word.toLowerCase() === val.toLowerCase())
      if (existWord) {
        return this.$message.error(`已存在该否定关键词：${val}`)
      }
      try {
        validateKeyword([val])
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.word = ''
      }
      this.$emit('change', 'negativeWords', [{ word: val }].concat(this.negativeWords))
    },
    removeNegativeWord (w) {
      this.$emit('change', 'negativeWords', this.negativeWords.filter(o => o.word !== w.word))
    },
    updateNegativeWords (words) {
      this.$emit('change', 'negativeWords', words.concat(this.negativeWords))
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
