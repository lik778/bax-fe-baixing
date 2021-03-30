<template>
  <div class="keywords-container">
    <p class="tip">
      请选取<b class="red">20</b>个以上关键词，关键词越多您的创意被展现的机会越多。根据当月数据，为您推荐如下关键词
    </p>
    <div class="search">
      <el-input v-model="word" @blur="handleWordBlur" class="input" size="small" placeholder="添加自定义词"  />
      <el-button type="primary" size="small" @click="handleAddKeywords">添加关键词</el-button>
      <el-button type="primary" size="small" plain>规划拓词工具</el-button>
    </div>

    <!-- 添加关键词模态框 -->
    <keyword-dialog-comp
      @close="keywordDialogVisible = false"
      :visible="keywordDialogVisible"
      />
    <!-- 规划拓词模态框 -->
  </div>
</template>

<script>
import KeywordDialogComp from './keyword-dialog'

export default {
  name: 'qwt-keywords',
  data () {
    return {
      word: '',
      keywordDialogVisible: false
    }
  },
  methods: {
    handleWordBlur () {
    },
    handleAddKeywords () {
      this.keywordDialogVisible = true
    }
  },
  components: {
    KeywordDialogComp
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
  .red {
    color: $c-strong;
  }
  .input {
    width: 240px;
  }
}
</style>
