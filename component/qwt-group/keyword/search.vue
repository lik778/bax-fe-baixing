<template>
  <div class="search">
    <el-input v-model="word" class="input" size="small" placeholder="添加自定义词"  />
    <el-button type="primary" size="small" @click="handleAddKeyword">添加关键词</el-button>
    <el-button type="primary" size="small" plain @click="recommendKeywords">一键拓词</el-button>
    <el-button type="primary" size="small" plain @click="baiduExpandWordsDialogVisible = true">规划拓词工具</el-button>

    <!-- 添加关键词模态框 -->
    <keyword-dialog
      :visible.sync="keywordDialogVisible"
      :original-keywords="keywords"
      :sources="sources"
      @update="handleAddKeywords"
    />

    <!-- 规划拓词模态框 -->
    <baidu-expand-words-dialog
      :visible.sync="baiduExpandWordsDialogVisible"
      :extra-query="{
        campaign_id: campaignId,
        areas: areas
      }"
      @confirm="handleAddKeywords"
    />
  </div>
</template>

<script>
import KeywordDialog from './keyword-dialog'
import BaiduExpandWordsDialog from 'com/common/qwt-baidu-expand-words'
import { validateKeyword } from 'util/campaign'

export default {
  name: 'keyword-search',
  props: ['keywords', 'sources', 'campaignId', 'areas'],
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
    handleAddKeyword () {
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
      this.$emit('update-keywords', {
        type: 'add',
        data: [{ word: val }]
      })
    },
    recommendKeywords () {
      // TODO: 逻辑待定，太混乱了
    },
    handleAddKeywords (words) {
      this.$emit('update-keywords', {
        type: 'add',
        data: words
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  width: 240px;
}
</style>
