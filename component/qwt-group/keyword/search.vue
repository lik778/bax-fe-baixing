<template>
  <div class="search">
    <el-input v-model="word"
              class="input"
              placeholder="添加自定义词" />
    <el-button type="primary"
               :loading="loading.addBtn"
               @click="handleAddKeyword">添加关键词</el-button>
    <el-button type="primary"
               plain
               :loading="loading.recommendBtn"
               @click="recommendKeywords">一键拓词</el-button>
    <el-button type="primary"
               plain
               @click="baiduExpandWordsDialogVisible = true">规划拓词工具</el-button>

    <!-- 添加关键词模态框 -->
    <keyword-dialog :visible.sync="keywordDialogVisible"
                    :all-words="allWords"
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
import { recommendByWord, recommendByUrl } from 'api/fengming'
import { fmtNewKeywordsPrice, filterExistCurrentWords } from 'util/group'

export default {
  name: 'keyword-search',
  props: {
    allWords: {
      type: Array,
      required: true,
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
    },
    landingType: {
      type: Number
    },
    landingPage: {
      type: String,
      default: ''
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
      baiduExpandWordsDialogVisible: false,
      loading: {
        addBtn: false,
        recommendBtn: false
      }
    }
  },
  mounted () {
    // 一键拓词推荐关键词临时数据
    this._recommendKeywords = []
  },
  methods: {
    async handleAddKeyword () {
      const val = this.word.trim()
      if (val === '') {
        this.keywordDialogVisible = true
        return
      }

      // 本地校验：是否已存在关键词或否词
      const newWords = filterExistCurrentWords(this.allWords, [{ word: val }])
      if (!newWords.length) return this.$message.error(`已存在关键词或否定关键词：${val}`)

      // TODO: 根据接口获取当前keyword是否已存在否词或关键词列表

      // 打点
      this.$emit('track', 'click-button: add-keyword')

      try {
        this.loading.addBtn = true
        validateKeyword([val])
        // TODO: campaignId 是否要更换为groupId
        const recommendKeywords = (await recommendByWord(val, { campaignId: this.campaignId })) || []
        const newKeywords = fmtNewKeywordsPrice(recommendKeywords).find(k => k.word === val)
        if (!newKeywords) return this.$message.info('没有合适的关键词')
        this.$emit('add-keywords', [{ ...newKeywords, isNew: true }])
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.loading.addBtn = false
        this.word = ''
      }
    },
    async recommendKeywords () {
      const { landingType, landingPage, areas, campaignId } = this
      const recommendBody = {
        url: landingPage,
        areas,
        campaignId,
        landingType
      }
      // TODO: 针对官网做了创意标题和创意内容的传递，本期是否要做
      try {
        this.loading.recommendBtn = true
        const recommendKeywords = await recommendByUrl(recommendBody)
        this._recommendKeywords = this._recommendKeywords.concat(recommendKeywords)
        if (!recommendKeywords.length) return this.$message.info('无法提供推荐关键词')

        // 每次选取5个推荐词
        const newKeywords = filterExistCurrentWords(this.allWords, fmtNewKeywordsPrice(recommendKeywords)).slice(0, 5)

        // TODO: 根据接口获取当前keyword是否已存在否词或关键词列表

        if (!newKeywords.length) return this.$message.info('没有更多的关键词可以推荐啦')
        this.$emit('add-keywords', newKeywords.map(o => ({ ...o, isNew: true })))

        // TODO: 凤凰于飞打点，查看凤凰于飞的使用情况（请教于飞）
        // this.$emit('track-recommend', this._recommendKeywords)
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.loading.recommendBtn = false
      }
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
