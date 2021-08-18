<template>
  <el-dialog title="批量添加否定关键词"
             :visible="visible"
             @close="handleClose"
             :before-close="handleClose"
             width="600px"
             class="negative-words-dialog"
             :close-on-press-escape="false"
             :close-on-click-modal="false">
    <div class="header">
      <div class="search-container">
        <el-input class="search"
                  placeholder="请批量添加否定关键词"
                  v-model="search" />
        <el-button class="add-btn"
                   type="primary"
                   :loading="loading"
                   @click="addWords">批量添加</el-button>
      </div>
      <div class="tip">提示: 请用逗号区分关键词进行批量关键词添加，如合肥家政服务公司，合肥月嫂，合肥钟点工</div>
    </div>
    <div class="content">
      <el-tag type="success"
              v-for="item in words"
              :key="item.word"
              class="tag">{{item.word}}
      </el-tag>
    </div>
    <span slot="footer"
          class="footer">
      <el-button type="primary"
                 @click="handleConfirm">确认
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateKeyword } from 'util/campaign'
import { NEGATIVE_KEYWORDS_MAX } from 'constant/fengming'
import { getNotExistWords } from 'util/group'

export default {
  name: 'negative-word-dialog',
  props: {
    negativeWords: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    negativeKeywordsMax: {
      type: Number,
      default: NEGATIVE_KEYWORDS_MAX
    },
    allWords: {
      type: Array,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      search: '',
      words: [],
      loading: false
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    },
    handleConfirm () {
      this.$emit('update-negative-words', this.words)
      this.handleClose()
      this.search = ''
      this.words = []
    },
    async addWords () {
      if (this.search.trim() === '') {
        return this.$message.warning('还未添加关键词')
      }

      // 数组去重并去掉首尾的逗号
      let words = this.search.trim().split(/[，,]]*/g)
      words = [...new Set(words
        .map(row => row.trim().toLowerCase())
        .filter(row => row !== '')
      )]

      if (words.concat(this.negativeWords).length > this.negativeKeywordsMax) {
        return this.$message.error(`否词个数不得超过${this.negativeKeywordsMax}`)
      }

      try {
        this.loading = true
        validateKeyword(words)

        const allWords = this.allWords.concat(this.words)
        const newWords = getNotExistWords(allWords, words)
        if (!newWords.length) throw new Error('否词已存在关键词或否词列表中，请更换关键词')

        this.words = this.words.concat(newWords.map(o => {
          return { word: o }
        }))
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.negative-words-dialog {
  .header {
    .search-container {
      display: flex;
      align-items: center;
    }
    .search {
      width: 300px;
    }
    .add-btn {
      margin-left: 20px;
    }
    .tip {
      font-size: 12px;
      margin-top: 10px;
      color: $c-tip;
    }
  }
  .content {
    margin-top: 20px;
    max-height: 300px;
    overflow-y: auto;
    .tag {
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
}
</style>
