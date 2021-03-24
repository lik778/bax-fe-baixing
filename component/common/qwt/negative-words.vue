<template>
  <div class="negative-words">
    <div class="title">
      设置否定关键词
      <el-tooltip content="请注意，否词和关键词不能重复" placement="top">
        <i class="el-icon-question" />
      </el-tooltip>
    </div>
    <p class="tip">
      当网民的搜索词与精确否定关键词完全一致时，您的推广结果将不会展现。
      <span>否词个数不得超过<b class="red">{{ NEGATIVE_KEYWORDS_MAX }}</b>个</span>
    </p>
    <div class="search">
      <el-input class="input" size="small" v-model="word" placeholder="请输入标题（字数限制9～25个字）"/>
      <el-button class="btn" type="primary" size="small" @click="addNegativeWords">添加否定关键词</el-button>
      <strong class="num">当前否定关键词数量: <b class="red">{{ negativeWords.length }}</b>个</strong>
    </div>
    <div class="res">
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
    },
    campaignId: {
      type: String,
      required: true
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
      }
      this.$emit('update-promotion', 'negativeWords', [{ word: val }].concat(this.negativeWords))
    },
    removeNegativeWord (w) {
      this.$emit('update-promotion', 'negativeWords', this.negativeWords.filter(o => o.word !== w.word))
    },
    updateNegativeWords (words) {
      this.$emit('update-promotion', 'negativeWords', words.concat(this.negativeWords))
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
    margin-top: 20px;
    .input {
      width: 240px;
      margin-right: 14px;
    }
    .num {
      font-size: 12px;
      font-weight: 400;
      margin-left: 10px;
    }
  }
  .red {
    color: $c-strong;
  }
  .tip {
    font-size: 12px;
    color: #6a778c;
    margin-top: 20px;
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
