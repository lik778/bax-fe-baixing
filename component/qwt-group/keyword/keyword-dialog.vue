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
                 @click="handleConfirm">确认
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { recommendByWordList } from 'api/fengming'
import { isObj } from 'util'
import { validateKeyword } from 'util/campaign'
import { fmtNewKeywordsPrice } from 'util/group'

export default {
  name: 'qwt-keyword-dialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    sources: {
      type: Array,
      default: () => {
        return []
      }
    },
    originalKeywords: {
      type: Array,
      required: false,
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
      search: ''
    }
  },
  methods: {
    handleConfirm () {
      this.$emit('update', this.keywords.normalList)
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
      } catch (e) {
        return this.$message.error(e.message)
      }

      // 本地校验：是否在单元的关键词和否词已有列表中, 存在直接过滤
      const normalList = (this.keywords && this.keywords.normalList) || []
      const originalKeywords = this.originalKeywords.concat(normalList)
      const newWords = words.filter(
        x => !originalKeywords.find(o => o.word.toLowerCase() === x.word.toLowerCase())
      )

      // TODO: 接口获取关键词是否已存在，并告知存在的列表（后端新增接口）
      // TODO: 如果关键词已存在，直接过滤

      // 拼接关键词
      const newKeywords = await this.fetchWords(newWords)
      for (const key in this.keywords) {
        this.keywords[key] = [...new Set(this.keywords[key].concat(newKeywords[key]))]
      }
      this.search = ''
    },
    async fetchWords (words, sources) {
      const result = await recommendByWordList(words, { sources })
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
