<template>
  <el-dialog :title="title"
             :visible="visible"
             @close="handleClose"
             :before-close="handleClose"
             width="40%"
             class="qwt-add-keywords-dialog"
             :close-on-press-escape="false"
             :close-on-click-modal="false">
    <div class="header">
      <div class="search-container">
        <el-input class="search"
                  placeholder="请批量添加关键词"
                  size="small"
                  v-model="search"></el-input>
        <el-button class="add-btn"
                   type="primary"
                   size="small"
                   @click="addWordList">批量添加</el-button>
      </div>
      <div class="tip">提示: 请用逗号区分关键词进行批量关键词添加，如合肥家政服务公司，合肥月嫂，合肥钟点工</div>
    </div>
    <div class="content">
      <div class="sec"
           v-if="keywords.normalList.length">
        <div class="sec-title">成功添加关键词</div>
        <div class="sec-content">
          <el-tag type="success"
                  v-for="item in keywords.normalList"
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
                 @click="handleConfirm"
                 size="small">确认
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Message } from 'element-ui'

import { recommendByWordList } from 'api/fengming'
import { isObj } from 'util'
import { MIN_WORD_PRICE } from 'constant/keyword'
import { validateKeyword } from 'util/campaign'
import { filterBannedListByContent } from 'constant/fengming'

export default {
  name: 'QwtAddKeywordsDialog',
  props: {
    title: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    isNegative: {
      type: Boolean,
      default: false
    },
    isUpdateQwt: {
      type: Boolean,
      default: false
    },
    areas: {
      type: Array,
      default: () => {
        return []
      }
    },
    sources: {
      type: Array,
      default: () => {
        return []
      }
    },
    campaignId: {
      type: Number
    },
    originalKeywords: {
      type: Array,
      required: true,
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
      search: ''
    }
  },
  methods: {
    handleConfirm () {
      this.$emit('update-keywords', this.keywords)
    },
    handleClose () {
      this.search = ''
      this.getInitKeywords()
      this.$emit('close')
    },
    getInitKeywords () {
      for (const key in this.keywords) {
        this.keywords[key] = []
      }
    },
    async addWordList () {
      // 空字符校验
      if (this.search.trim() === '') {
        return Message.warning('还未添加关键词')
      }

      // 数组去重并去掉首尾的逗号
      let words = this.search.trim().split(/[，,]]*/g)
      words = Array.from(new Set(words.map(row => {
        return row.trim().toLowerCase()
      }).filter(row => row !== '')))

      if (words.length > 100) {
        return Message.warning('每次最多支持上传100个关键词')
      }

      try {
        validateKeyword(words)
      } catch (e) {
        return Message.error(e.message)
      }

      // 判断关键词已存在
      let normalList = (this.keywords && this.keywords.normalList) || []
      const bannedList = (this.keywords && this.keywords.bannedList) || []
      normalList = this.originalKeywords.concat(normalList)
      for (let i = 0; i < normalList.length; i++) {
        const row = normalList[i]
        if (words.includes(row.word.toLowerCase())) {
          return Message.warning(`${row.word}该关键词已存在关键词或否定关键词列表`)
        }
      }
      for (let i = 0; i < bannedList.length; i++) {
        const row = bannedList[i]
        if (words.includes(row.word)) {
          return Message.warning(`因平台限制，${row.word}无法添加，请修改`)
        }
      }

      // 拼接关键词
      const newKeywords = await this.fetchWords(words)
      for (const key in this.keywords) {
        this.keywords[key] = this.keywords[key].concat(newKeywords[key])
      }
      this.search = ''
    },
    async fetchWords (words) {
      if (this.isNegative) {
        return await this._fetchNegativeKeywords(words, {
          campaignId: this.campaignId,
          sources: this.sources
        })
      }
      if (this.isUpdateQwt) {
        return await this._fetchKeywords(words, {
          campaignId: this.campaignId
        })
      } else {
        return await this._fetchKeywords(words, {
          areas: this.areas,
          sources: this.sources
        })
      }
    },
    async _fetchKeywords (words, opts) {
      const result = await recommendByWordList(words, opts)
      if (result && isObj(result)) {
        for (const key in result) {
          if (Array.isArray(result[key])) {
            result[key] = result[key].map(word => {
              const { price: serverPrice } = word
              let price = serverPrice
              if (price < MIN_WORD_PRICE) {
                price = MIN_WORD_PRICE
              }
              return {
                ...word,
                serverPrice,
                price, // override price, price is display value
                value: word.word
              }
            })
          }
        }
      }
      return result
    },
    async _fetchNegativeKeywords (words) {
      const result = await filterBannedListByContent(words)
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.qwt-add-keywords-dialog {
  & .header {
    & .search-container {
      display: flex;
      align-items: center;
    }
    & .search {
      width: 300px;
    }
    & .add-btn {
      margin-left: 20px;
    }
    & .tip {
      font-size: 12px;
      margin-top: 10px;
      color: #ff7533;
    }
  }
  & .content {
    margin-top: 20px;
    & .sec {
      font-weight: bold;
      font-size: 14px;
      margin-top: 20px;
    }
    & .sec-title {
      margin-bottom: 10px;
    }
    & .tag-item {
      margin-right: 5px;
      margin-top: 8px;
    }
  }
}
</style>
