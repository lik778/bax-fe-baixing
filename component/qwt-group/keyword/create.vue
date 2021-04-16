<template>
  <div class="keywords-container">
    <p class="tip">
      请选取<strong>20</strong>个以上关键词，关键词越多您的创意被展现的机会越多。
      当前单元关键词数量<strong>{{originKeywords.length}}</strong>个
    </p>
    <search-comp :campaign-id="campaignId"
                 :areas="areas"
                 :sources="sources"
                 v-on="$listeners"
                 :all-words="allWords" />
    <div class="res"
         v-if="originKeywords.length">
      <el-tag class="tag"
              :class="{'tag-fh': RECOMMAND_SOURCES.includes(kw.recommandSource)}"
              v-for="(kw, index) in originKeywords"
              :key="index"
              closable
              type="primary"
              @close="removeKeyword(index)">
        {{ kw.word }}
        {{ RECOMMAND_SOURCES.includes(kw.recommandSource) ? '(好词)': '' }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import SearchComp from './search'

import { RECOMMAND_SOURCE_FH, NEW_RECOMMAND_SOURCE_FH } from 'constant/fengming'
const RECOMMAND_SOURCES = [RECOMMAND_SOURCE_FH, NEW_RECOMMAND_SOURCE_FH]

export default {
  name: 'qwt-create-keyword',
  props: {
    allWords: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    originKeywords: {
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
      type: [String, Number]
    }
  },
  data () {
    return {
      RECOMMAND_SOURCES
    }
  },
  methods: {
    removeKeyword (idx) {
      this.$emit('remove-keywords', idx)
    }
  },
  components: {
    SearchComp
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
    font-size: 14px;
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
