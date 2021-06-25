<template>
    <section class="bw-query-price">
        <el-card class="box-card">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="查价" name="first">
                    <InqueryForm :allAreas="allAreas" @inquery="inquery"/>
                    <section class="bw-query-price_item">
                      <Title title="关键词热度明细"/>
                      <KeywordHotDetail :tableData="keywordHots"/>
                    </section>
                    <section class="bw-query-price_item">
                      <Title title="查价结果" extra="请选择需要的平台*时段*时长"/>
                      <InqueryResult :tableData="inqueryResult" />
                    </section>
                    <el-row type="flex" justify="start" align="middle">
                      <el-col :span="3">
                        <h2 class="wefare-title">超值福利</h2>
                      </el-col>
                      <el-col :span="3">
                        <DiamondShopWelfare/>
                      </el-col>
                      <el-col :span="5" :push="13">
                        <div class="submit">
                          <h3>总价： 38777元</h3>
                          <el-popconfirm
                            title="确定提交审核吗？"
                            @confirm="submit"
                          >
                            <el-button slot="reference" type="danger" plain>提交审核</el-button>
                          </el-popconfirm>
                        </div>
                      </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <BwPlusDialog :BwPlusDialogMsg="BwPlusDialogMsg" @close="BwPlusDialogMsg.dialogVisible = false"/>
    </section>
</template>

<script>
import { InqueryForm, KeywordHotDetail, Title, InqueryResult, DiamondShopWelfare, BwPlusDialog } from './components'
import { querySystemResult } from 'api/biaowang-plus'
export default {
  name: 'bw-plus-query-price',
  components: {
    InqueryForm,
    KeywordHotDetail,
    Title,
    InqueryResult,
    DiamondShopWelfare,
    BwPlusDialog
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      BwPlusDialogMsg: {
        type: 'success',
        dialogVisible: false,
        content: '',
        title: ''
      },
      keywordHots: [
        {
          keyword: '总热度',
          pcHot: 60,
          wapHot: 40
        },
        {
          keyword: '发电机',
          pcHot: 40,
          wapHot: 20
        },
        {
          keyword: '发电机哪家强',
          pcHot: 20,
          wapHot: 20
        }
      ],
      inqueryResult: [
        {
          type: '360天',
          bothse: 38766,
          bothfe: 29800,
          wapse: 29640,
          wapfe: 18800,
          pcse: 25700,
          pcfe: 19800
        },
        {
          type: '360天',
          bothse: 38765,
          bothfe: 29800,
          wapse: 29640,
          wapfe: 18800,
          pcse: 25700,
          pcfe: 19800
        }
      ]
    }
  },
  methods: {
    handleClick () {},
    submit () {
      console.log('提交')
      this.BwPlusDialogMsg = {
        dialogVisible: true,
        type: 'error',
        content: ['审核预计1-3个工作日，去查看审核进度', '审核预计1-3个工作日，去查看审核进度', '审核预计1-3个工作日，去查看审核进度'],
        title: '提交失败'
      }
    },
    async inquery (form) {
      console.log('form', form)
      const params = {
        cities: form.cities,
        coreCity: form.coreCities[0],
        industry: form.industry,
        words: form.words.split(/[\s\n]/)
      }
      await querySystemResult(params)
    }
  }
}
</script>

<style lang="scss" scoped>
    .bw-query-price{
        height: 100%;
        &_item{
          margin-bottom: 30px;
        }
    }
   .box-card{
       margin: 10px;
   }
   .wefare-title{
     font-size: 18px;
     color: #FF6350;
   }
   .el-row{
     margin-top: 60px;
   }
   .submit{
     width: 100%;
     display: flex;
     flex-direction: column;
     justify-content: flex-end;
     align-items: flex-end;
      h3{
        font-size: 24px;
        color: #FF6350;
        margin-bottom: 20px;
      }
   }
</style>
