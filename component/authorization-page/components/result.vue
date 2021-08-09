<template>
    <section class="result-section">
        <div class="content">
            <i v-if="type === 'success'" class="el-icon-circle-check"></i>
            <i v-if="type === 'error'" class="el-icon-circle-close"></i>
            <p>{{text}}</p>
            <el-button @click="goHome">返回首页</el-button>
        </div>
    </section>
</template>

<script>
export default {
  name: 'result',
  props: {
    visible: {
      type: Boolean,
      default: false,
      require: true
    },
    type: {
      type: String,
      default: 'success',
      require: true
    },
    text: {
      type: String,
      default: '恭喜，您已授权成功！',
      require: true
    }
  },
  methods: {
    goHome () {
      this.$emit('goHome')
    }
  }
}
</script>
<style lang="scss" scoped>
    .result-section{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100%;
        height: 100%;
        .content{
            width: 60%;
            display: flex;
            flex-direction: column;
            align-items: center;
            i{
                font-size: 65px;
                margin-bottom: 17px;
            }
            .el-icon-circle-check{
                color: #67C23A;
            }
            .el-icon-circle-close{
                color: #F56C6C;
            }
            p{
                margin-bottom: 31px;
                font-size: 16px;
                color: #666666;
            }
        }
    }
</style>
