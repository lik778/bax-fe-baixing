<template>
  <div class="keywords-container">
    <p class="tip">
      请选取<strong>20</strong>个以上关键词，关键词越多您的创意被展现的机会越多。根据当月数据，为您推荐如下关键词
    </p>
    <div class="search">
      <el-input v-model="word" class="input" size="medium" placeholder="添加自定义词"  />
      <el-button type="primary" size="medium" @click="handleAddKeywords">添加关键词</el-button>
      <el-button type="primary" size="medium" plain @click="baiduExpandWordsDialogVisible = true">规划拓词工具</el-button>
    </div>

    <div class="res" v-if="keywords.length">
      <el-tag class="tag"
              :class="{'tag-fh': RECOMMAND_SOURCES.includes(kw.recommandSource)}"
              v-for="(kw, index) in keywords"
              :key="index"
              closable
              @close="removeKeyword(index)">
        {{kw.word}}
        {{RECOMMAND_SOURCES.includes(kw.recommandSource) ? '(好词)': ''}}
      </el-tag>
    </div>

    <!-- 添加关键词模态框 -->
    <keyword-dialog
      :visible.sync="keywordDialogVisible"
      :original-keywords="keywords"
      @update-keywords="updateWords"
      />
    <!-- 规划拓词模态框 -->
    <baidu-expand-words-dialog
      :visible.sync="baiduExpandWordsDialogVisible"
      :extra-query="{
        campaign_id: campaignId,
        areas: areas
      }"
      @confirm="addBaiduWords"
    />

  </div>
</template>

<script>
import KeywordDialog from './keyword-dialog'
import BaiduExpandWordsDialog from 'com/common/qwt-baidu-expand-words'

import { RECOMMAND_SOURCE_FH, NEW_RECOMMAND_SOURCE_FH } from 'constant/fengming'
import { validateKeyword } from 'util/campaign'
const RECOMMAND_SOURCES = [RECOMMAND_SOURCE_FH, NEW_RECOMMAND_SOURCE_FH]

export default {
  name: 'qwt-create-keyword',
  props: {
    keywords: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    campaignId: {
      type: Number
    },
    areas: {
      type: Array
    }
  },
  data () {
    return {
      word: '',
      keywordDialogVisible: false,
      baiduExpandWordsDialogVisible: false,

      RECOMMAND_SOURCES
    }
  },
  methods: {
    handleAddKeywords () {
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
      this.$emit('update-group', 'keywords', [{ word: val }].concat(this.keywords))
    },
    updateWords (words) {
      this.$emit('update-group', 'keywords', words.concat(this.keywords))
    },
    addBaiduWords (words) {
      this.$emit('update-group', 'keywords', words.concat(this.keywords))
    }
  },
  components: {
    KeywordDialog,
    BaiduExpandWordsDialog
  }
}
</script>

<style lang="scss" scoped>
.keywords-container {
  > .tip {
    font-size: 12px;
    color: #6a778c;
  }
  .search {
    margin-top: 20px;
  }
  strong {
    color: $c-strong;
  }
  .input {
    width: 240px;
  }
  .res {
    margin-top: 20px;
    .tag {
      margin-right: 5px;
      margin-bottom: 5px;
      &.tag-fh {
        color: #16b7ff;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
    }
  }
}
</style>
