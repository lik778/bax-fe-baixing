<template>
  <div class="search">
    <el-input v-model="word"
              class="input"
              placeholder="添加自定义词" />
    <el-button type="primary"
               @click="handleAddKeyword">添加关键词</el-button>
    <el-button type="primary"
               plain
               @click="recommendKeywords">一键拓词</el-button>
    <el-button type="primary"
               plain
               @click="baiduExpandWordsDialogVisible = true">规划拓词工具</el-button>

    <!-- 添加关键词模态框 -->
    <keyword-dialog :visible.sync="keywordDialogVisible"
                    :original-keywords="keywords"
                    :sources="sources"
                    @update="handleAddKeywords" />

    <!-- 规划拓词模态框 -->
    <baidu-expand-words-dialog :visible.sync="baiduExpandWordsDialogVisible"
                               :extra-query="{ campaign_id: campaignId, areas: areas }"
                               @confirm="handleAddKeywords" />
  </div>
</template>

<script>
import KeywordDialog from './keyword-dialog'
import BaiduExpandWordsDialog from 'com/common/qwt-baidu-expand-words'

import { validateKeyword } from 'util/campaign'
import { recommendByWord } from 'api/fengming'
import { fmtNewKeywordsPrice } from 'util/group'

export default {
  name: 'keyword-search',
  props: {
    keywords: {
      type: Array,
      default () {
        return []
      }
    },
    areas: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    sources: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    campaignId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    KeywordDialog,
    BaiduExpandWordsDialog
  },
  data () {
    return {
      word: '',
      keywordDialogVisible: false,
      baiduExpandWordsDialogVisible: false
    }
  },
  methods: {
    async handleAddKeyword () {
      const val = this.word.trim()
      if (val === '') {
        this.keywordDialogVisible = true
        return
      }

      const existWord = this.keywords.find(o => o.word.toLowerCase() === val.toLowerCase())
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

      // TODO: 做打点
      // TODO: campaignId是否要更换为groupId
      const recommendKeywords = (await recommendByWord(val, { groupId: this.groupId })) || []
      const newKeywords = fmtNewKeywordsPrice(recommendKeywords)
      if (!newKeywords.length) return this.$message.info('没有合适的关键词')
      this.$emit('add-keywords', newKeywords.map(o => ({ ...o, isNew: true })))
    },
    recommendKeywords () {
      // TODO: 逻辑待定，太混乱了
    },
    handleAddKeywords (words) {
      this.$emit('add-keywords', words.map(o => ({ ...o, isNew: true })))
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  width: 240px;
}
</style>
