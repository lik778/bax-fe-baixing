<template>
  <div class="keyword-view">
    <div class="header">
      <span>{{title}}</span>
      <i class="el-icon-circle-plus-outline"
         v-if="isEdit"
         @click="popKeywordInputDialog"></i>
    </div>
    <div class="content">
      <div class="item"
           v-for="(word,index) in keywords"
           :key="index">
        <span class="word">{{type === 'C' ? word.value : word}}</span>
        <span v-if="isEdit">
          <i class="el-icon-edit"
             @click="editWord(index)"></i>
          <i class="el-icon-delete"
             @click="deleteWord(index)"></i>
        </span>
      </div>
    </div>
    <p class="warning-text" v-if="minShowWarningText">
      <i class="el-icon-warning-outline"></i>
      低于10个词，请继续添加</p>
    <p class="warning-text" v-if="maxShowWarningText">
      <i class="el-icon-warning-outline"></i>
      请勿超过20个关键词</p>
  </div>
</template>

<script>
/**
 * ! 谨慎修改
 * 这个组件在“千词新建订单”、“千词优选词列表”都有用到
 */
export default {
  name: 'KeywordView',
  props: {
    type: {
      type: String,
      required: true,
      default: 'A'
    },
    title: {
      type: String,
      required: true,
      default: ''
    },
    keywords: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    isEdit: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    minShowWarningText () {
      return this.keywords.length > 0 && this.keywords.length < 10 && ['B', 'D'].includes(this.type)
    },
    maxShowWarningText () {
      return this.keywords.length > 20 && ['B', 'D'].includes(this.type)
    }
  },
  methods: {
    editWord (index) {
      this.$emit('edit', {
        type: this.type,
        index
      })
    },
    deleteWord (index) {
      this.$emit('delete', {
        type: this.type,
        index
      })
    },
    popKeywordInputDialog () {
      this.$emit('pop-keyword-input', this.type)
    }
  }
}
</script>

<style lang="scss" scoped>
.keyword-view {
  border: 1px solid #ddd;
  width: 25%;
  & > .header {
    position: relative;
    text-align: center;
    height: 40px;
    line-height: 40px;
    & > i {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;
      font-size: 22px;
      cursor: pointer;
    }
  }
  & > .content {
    height: 340px;
    padding: 10px 16px;
    border-top: 1px solid #ddd;
    line-height: 26px;
    overflow: auto;
    & > .empty {
      height: 100%;
      width: 90%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ccc;
      font-size: 13px;
    }
    & > .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > .word {
        flex: 1;
      }
      & i {
        font-size: 16px;
        margin-left: 10px;
        cursor: pointer;
        transition: all 0.2s linear;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }
  & .warning-text {
    font-size: 14px;
    color: #ff6350;
    position: absolute;
    padding-top: 10px;
  }
}
</style>
