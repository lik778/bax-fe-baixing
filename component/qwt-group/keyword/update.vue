<template>
  <div class="keywords-container">
    <div class="pane">
      <header>添加推广关键词</header>
      <search-comp
        :campaign-id="campaignId"
        :areas="areas"
        :sources="sources"
        v-on="$listeners"
      />
    </div>
    <div class="pane">
      <header>搜索推广关键词</header>
      <el-input v-model="search" size="small" class="input" placeholder="请输入关键词查询" />
      <el-button size="small" type="primary" @click="searchKeyword">搜索</el-button>
    </div>
  </div>
</template>

<script>
import SearchComp from './search'

export default {
  name: 'qwt-update-keyword',
  props: {
    keywords: {
      type: Array,
      required: true
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
  data () {
    return {
      search: '',
      activeName: 'origin'
    }
  },
  methods: {
    searchKeyword () {

    }
  },
  components: {
    SearchComp
  }
}
</script>

<style lang="scss" scoped>
.keywords-container {
  .pane {
    display: flex;
    align-items: center;
    &:not(:first-child) {
      margin-top: 10px;
    }
    > header {
      flex: 0 0 120px;
    }
    .input {
      width: 240px;
      margin-right: 6px;
    }
  }
  .tabs {
    margin-top: 20px;
  }
}
</style>
