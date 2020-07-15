<template>
  <div class="keyword-view">
    <div class="header">
      <span>{{title}}</span>
      <i class="el-icon-circle-plus-outline"
         @click="popKeywordInputDialog"></i>
    </div>
    <div class="content">
      <div class="item"
           v-for="(word,index) in keywords"
           :key="word">
        <span class="word">{{word}}</span>
        <span>
          <i class="el-icon-edit"
             @click="editWord(index)"></i>
          <i class="el-icon-delete"
             @click="deleteWord(index)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
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
      default() {
        return []
      }
    }
  },
  methods: {
    editWord(index) {
      this.$emit('edit', {
        type: this.type,
        index
      })
    },
    deleteWord(index) {
      this.$emit('delete', {
        type: this.type,
        index
      })
    },
    popKeywordInputDialog() {
      this.$emit('pop-keyword-input', this.type)
    }
  }
}
</script>

<style lang="postcss" scoped>
.keyword-view {
  border: 1px solid #ddd;
  width: 25%;
  min-width: ;
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
}
</style>
