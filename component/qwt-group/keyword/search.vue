<template>
  <div class="search">
    <el-input v-model="word"
              class="input"
              placeholder="添加自定义词" />
    <el-button type="warning"
               :loading="loading.addBtn"
               @click="handleAddKeyword">添加</el-button>
    <el-button type="primary"
               @click="keywordDialogVisible = true">批量添加关键词</el-button>
    <el-button type="primary"
               v-if="landingType !== LANDING_TYPE_STORE"
               plain
               :loading="loading.recommendBtn"
               @click="recommendKeywords">一键拓词</el-button>
    <el-button type="primary"
               plain
               @click="baiduExpandWordsDialogVisible = true">规划拓词工具</el-button>

    <!-- 添加关键词模态框 -->
    <keyword-dialog :visible.sync="keywordDialogVisible"
                    :all-words="allWords"
                    :extra-query="{ group_id: groupId, sources: sources }"
                    :sources="sources"
                    v-on="$listeners"
                    @update="handleAddKeywords" />

    <!-- 规划拓词模态框 -->
    <baidu-expand-words-dialog v-if="baiduExpandWordsDialogVisible"
                               :visible.sync="baiduExpandWordsDialogVisible"
                               :extra-query="{ group_id: groupId, areas: areas }"
                               @confirm="handleAddBaiduKeyWords" />
  </div>
</template>

<script>
import KeywordDialog from './keyword-dialog'
import BaiduExpandWordsDialog from 'com/common/qwt-baidu-expand-words'

import { validateKeyword } from 'util/campaign'
import { recommendByWord, recommendByUrl } from 'api/fengming'
import { fmtNewKeywordsPrice, filterExistCurrentWords, getNotExistWords } from 'util/group'
import { LANDING_TYPE_STORE } from 'constant/fengming'

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
    groupId: {
      type: [String, Number]
    },
    landingType: {
      type: Number
    },
    landingPage: {
      type: String,
      default: ''
    },
    creatives: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    KeywordDialog,
    BaiduExpandWordsDialog
  },
  data () {
    return {
      LANDING_TYPE_STORE,

      word: '',
      keywordDialogVisible: false,
      baiduExpandWordsDialogVisible: false,
      loading: {
        addBtn: false,
        recommendBtn: false
      }
    }
  },
  methods: {
    async handleAddKeyword () {
      const val = this.word.trim()
      if (val === '') return

      try {
        // 校验关键词是否满足条件
        validateKeyword([val])

        // 校验关键词是否已存在
        const newWords = getNotExistWords(this.allWords.filter(o => !o.isDel), [val])
        if (!newWords.length) throw new Error('关键词已存在关键词或否词列表中，请更换关键词')

        // 校验关键词是否在已删除列表
        if (this.allWords.filter(o => o.isDel).some(o => o.word.toLowerCase() === val.toLowerCase())) {
          return this.$emit('add-remove-keywords', [{ word: val }])
        }

        this.loading.addBtn = true
        const recommendKeywords = (await recommendByWord(val, {
          groupId: this.groupId,
          areas: this.areas,
          sources: this.sources
        })) || []
        const newKeywords = fmtNewKeywordsPrice(recommendKeywords).find(k => k.word === val)
        if (!newKeywords) return this.$message.info('没有合适的关键词')
        this.$emit('add-keywords', [{ ...newKeywords, isNew: true }])
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.loading.addBtn = false
        this.word = ''
      }

      this.$emit('track', 'click-button: add-keyword')
    },
    async recommendKeywords () {
      const { landingType, landingPage, areas, creatives } = this
      const recommendBody = {
        url: landingPage,
        areas,
        landingType,
        creativeTitle: creatives[0].title,
        creativeContent: creatives[0].content
      }
      if (recommendBody.creativeTitle === '' || recommendBody.creativeContent === '') {
        return this.$message.error('请填写创意')
      }
      if (!landingPage) {
        return this.$message.error('请选择官网落地页')
      }

      try {
        this.loading.recommendBtn = true
        const recommendKeywords = await recommendByUrl(recommendBody)
        if (!recommendKeywords.length) return this.$message.info('无法提供推荐关键词')

        // tip 每次选取5个推荐词
        const newKeywords = filterExistCurrentWords(this.allWords, fmtNewKeywordsPrice(recommendKeywords)).slice(0, 5)

        if (!newKeywords.length) return this.$message.info('没有更多的关键词可以推荐啦')
        this.$emit('add-keywords', newKeywords.map(o => ({ ...o, isNew: true })))
      } catch (e) {
        return this.$message.error(e.message)
      } finally {
        this.loading.recommendBtn = false
      }
    },
    handleAddBaiduKeyWords (words) {
      const newWords = filterExistCurrentWords(this.allWords, words)
      this.handleAddKeywords(newWords)
    },
    handleAddKeywords (words) {
      this.$emit('add-keywords', words.map(o => ({ ...o, isNew: true })), true)

      this.$emit('track', 'click-button: add-keyword-list', {
        keywordsLen: words.length,
        keywords: words.map(o => o.word).join(',')
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
