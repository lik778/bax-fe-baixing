<template>
    <div class="box">
        <el-row :gutter="20">
             <el-col :span="8" v-for="(item,index) in templateList" :key="index" >
                <div class="grid-content bg-purple">
                    <div class="title" v-html="item.displayTitle">{{item.displayTitle}}</div>
                    <div class="content"  v-html="item.displayContent">
                        {{item.displayContent}}
                    </div>
                    <div class="footer">
                        <div class="tip">
                            <img src="../../../../asset/bw-plus-bw-edit-plan3.png" alt="">
                            <span>百姓网</span>
                            <span>广告</span>
                            <span>保障</span>
                        </div>
                        <div class="btn-box">
                            <el-button size="mini" class="btn" @click="applyBtn(index)">应用该创意</el-button>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { CREATIVE_TEMPLATE } from 'constant/bw-plus'
import { bwPlusTrack } from '../../utils/track'
export default {
  name: 'recommend',
  data () {
    return {
      CREATIVE_TEMPLATE
    }
  },
  props: {
    templateList: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    keyword: {
      type: String,
      require: true,
      default () {
        return ''
      }
    },
    id: {
      type: Number,
      require: true,
      default () {
        return 0
      }
    }
  },
  methods: {
    applyBtn (index) {
      bwPlusTrack('bwplus: click apply ', { keyword: this.keyword, promoteId: this.id })
      this.$confirm('选用当前推荐后将更新您已填写的信息，确定要继续操作吗？', '提示:', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '应用成功!'
        })
        bwPlusTrack('bwplus: click and confirm ', { keyword: this.keyword, promoteId: this.id })
        this.$emit('getIndex', index)
      }).catch(() => {
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.box{
    position: relative;
    font-size: 14px;
    padding: 15px 0px;
    .text{
        font-size: 14px;
        padding: 8px 0px;
    }
    width:846px;
    .closeClick{
        position: absolute;
        right: 20px;
        top: 30px;
        cursor: pointer;
    }
    .grid-content{
        background: #FFFFFF;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        padding: 15px 10px 15px;
        height: 165px;
        display: flex;
        flex-direction: column;
        .title{
            margin-bottom: 10px;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333333;
            letter-spacing: 0;
            line-height: 20px;
        }
        .content{
            flex: 1;
            margin-bottom: 10px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            letter-spacing: 0;
            line-height: 17px;
        }
        .footer{
            font-size: 12px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .tip{
                img{
                    width: 16px;
                    height: 16px;
                    vertical-align: middle;
                    margin-right: 5px;
                }
                span{
                    vertical-align: middle;
                    margin-right: 8px;
                }
                :nth-child(2){
                    font-family: PingFangSC-Regular;
                    color: #999999;
                    letter-spacing: 0;
                }
                :nth-child(3),:nth-child(4){
                    font-family: PingFangSC-Regular;
                    color: #74B8FF;
                    letter-spacing: 0;
                }
            }
            .btn-box{
                .btn{
                    font-family: PingFangSC-Medium;
                    color: #FF6350;
                    letter-spacing: 0;
                    background-color: #FFEFED;
                    border-radius: 4px;
                    border: none;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>
