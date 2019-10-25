<template>
  <el-dialog title="批量添加关键词" :visible.sync="show" width="40%" :before-close="handleClose">
    <div v-if="data">
      <div class="add-dialog-section" v-if="data.normalList.length>0">
        <h2 class="sec-title">成功添加关键词</h2>
        <div>
          <el-tag class="tag-item" v-for="item in data.normalList" type="success" :key="item.word">
            {{item.word}}
          </el-tag>
        </div>
      </div>
      <div class="add-dialog-section" v-if="data.bannedList.length>0">
        <h2 class="sec-title">因投放平台限制，以下关键词无法添加，请修改：</h2>
        <div>
          <el-tag class="tag-item" v-for="item in data.bannedList" type="danger" :key="item.word">
            {{item.word}}
          </el-tag>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props:{
    show:{
      type:Boolean,
      required:true,
      default:false
    },
    data:{
      required:true
    }
  },
  methods:{
    handleClose(){
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="postcss">
.add-dialog-section {
  margin-bottom: 20px;
  & .sec-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  & .tag-item {
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
</style>