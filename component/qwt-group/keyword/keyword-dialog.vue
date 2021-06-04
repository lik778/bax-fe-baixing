<template>
  <el-dialog title="批量添加关键词"
             :visible="visible"
             @close="handleClose"
             :before-close="handleClose"
             width="40%"
             class="keywords-dialog"
             :close-on-press-escape="false"
             :close-on-click-modal="false">
    <div class="header">
      <div class="search-container">
        <el-input class="search"
                  placeholder="请批量添加关键词"
                  v-model="search"></el-input>
        <el-button class="add-btn"
                   type="primary"
                   :loading="loading"
                   @click="addWordList">批量添加</el-button>
      </div>
      <div class="tip">提示:
        <p>1、请用逗号区分关键词进行批量关键词添加，如合肥家政服务公司，合肥月嫂，合肥钟点工</p>
        <p>2、如关键词已存在，会自动过滤掉存在的内容</p>
      </div>
    </div>
    <div class="content">
      <div class="sec"
           v-if="keywords.normalList.length || deletedWords.length">
        <div class="sec-title">成功添加关键词</div>
        <div class="sec-content">
          <el-tag type="success"
                  v-for="item in keywords.normalList.concat(deletedWords)"
                  :key="item.word"
                  class="tag-item">{{item.word}}
          </el-tag>
        </div>
      </div>
      <div class="sec"
           v-if="keywords.bannedList.length">
        <div class="sec-title">因投放平台限制，以下关键词无法添加，请修改：</div>
        <div class="sec-content">
          <el-tag type="danger"
                  v-for="item in keywords.bannedList"
                  :key="item.word"
                  class="tag-item">{{item.word}}
          </el-tag>
        </div>
      </div>
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
import { recommendByWordList } from 'api/fengming'
import { isObj } from 'util'
import { validateKeyword } from 'util/campaign'
import { fmtNewKeywordsPrice, getNotExistWords } from 'util/group'

export default {
  name: 'qwt-keyword-dialog',
  props: {
    extraQuery: {
      type: Object,
      default () {
        return {}
      }
    },
    visible: {
      type: Boolean,
      required: true
    },
    allWords: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      keywords: {
        normalList: [],
        bannedList: []
      },
      loading: false,
      search: '',
      deletedWords: []
    }
  },
  methods: {
    handleConfirm () {
      this.$emit('update', this.keywords.normalList)
      this.$emit('add-remove-keywords', this.deletedWords)
      this.handleClose()
    },
    handleClose () {
      this.$emit('update:visible', false)
      this.search = ''
      this.getInitKeywords()
    },
    getInitKeywords () {
      for (const key in this.keywords) {
        this.keywords[key] = []
      }
      this.deletedWords = []
    },
    async addWordList () {
      // 空字符校验
      if (this.search.trim() === '') {
        return this.$message.warning('还未添加关键词')
      }

      // 数组去重并去掉首尾的逗号
      let words = this.search.trim().split(/[，,]]*/g)
      words = Array.from(new Set(words.map(row => {
        return row.trim().toLowerCase()
      }).filter(row => row !== '')))

      if (words.length > 100) {
        return this.$message.warning('每次最多支持上传100个关键词')
      }

      try {
        validateKeyword(words)
        const normalList = (this.keywords && this.keywords.normalList) || []
        const allWords = this.allWords.concat(normalList)

        // 校验是否已存在
        const newWords = getNotExistWords(allWords.filter(o => !o.isDel), words)

        // 校验是否在已删除关键词列表
        const existDeletedWords = []
        const deletedWords = allWords.filter(o => o.isDel)
        words.forEach(w => {
          const idx = deletedWords.findIndex(o => o.word.toLowerCase() === w.toLowerCase())
          if (idx > -1) {
            existDeletedWords.push(deletedWords[idx])
          }
        })

        if (!existDeletedWords.concat(newWords).length) throw new Error('关键词已存在关键词或否词列表中，请更换关键词')

        // 拼接关键词
        const newKeywords = await this.fetchWords(newWords)
        for (const key in this.keywords) {
          this.keywords[key] = [...new Set(this.keywords[key].concat(newKeywords[key]))]
        }
        this.deletedWords = existDeletedWords

        this.search = ''
      } catch (e) {
        return this.$message.error(e.message)
      }
    },
    async fetchWords (words) {
      const result = await recommendByWordList(words, { ...this.extraQuery })
      if (!(result && isObj(result))) return
      for (const key in result) {
        result[key] = fmtNewKeywordsPrice(result[key])
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.keywords-dialog {
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
      color: #ff7533;
    }
  }
  .content {
    margin-top: 20px;
    max-height: 300px;
    overflow-y: auto;
    .sec {
      font-weight: bold;
      font-size: 14px;
      margin-top: 20px;
    }
    .sec-title {
      margin-bottom: 10px;
    }
    .tag-item {
      margin-right: 5px;
      margin-top: 8px;
    }
  }
}
</style>
