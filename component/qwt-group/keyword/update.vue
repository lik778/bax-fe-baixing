<template>
  <div class="keywords-container">
    <div class="pane">
      <header>添加推广关键词</header>
      <search-comp
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>
    <div class="pane">
      <header>搜索推广关键词</header>
      <el-input v-model="search" size="small" class="input" placeholder="请输入关键词查询" />
      <el-button size="small" type="primary" @click="searchKeyword">搜索</el-button>
    </div>

    <keyword-list-comp />
  </div>
</template>

<script>
import SearchComp from './search'
import KeywordListComp from './keyword-list'

export default {
  name: 'qwt-update-keyword',
  props: {

  },
  data () {
    return {
      search: '',
      activeName: 'origin',
      keywords: [
        {
          word: '',
          pcAvg: '',
          mobileAvg: '',
          status: '',
          price: ''
        }
      ]
    }
  },
  methods: {
    searchKeyword () {

    }
  },
  components: {
    SearchComp,
    KeywordListComp
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
