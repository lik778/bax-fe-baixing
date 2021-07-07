<template>
    <section class="bw-query-price">
        <el-card class="box-card">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="查价" name="first">
                    <InqueryForm :allAreas="allAreas" @inquery="inquery"/>
                    <section class="bw-query-price_item" v-if="queryResult.keywordPvList" ref="viewScrollTop">
                      <Title title="关键词热度明细"/>
                      <KeywordHotDetail :tableData="queryResult && queryResult.keywordPvList"/>
                    </section>
                    <section class="bw-query-price_item" v-if="!(queryResult.error && queryResult.overHeat) && queryResult.keywordPriceList">
                      <Title title="查价结果" extra="请选择需要的平台*时段*时长"/>
                      <InqueryResult @getValue="getCurrentPrice" :tableData="queryResult && queryResult.keywordPriceList" />
                      <el-row type="flex" justify="start" align="middle">
                        <el-col :span="3">
                          <h2 class="wefare-title">超值福利</h2>
                        </el-col>
                        <el-col :span="3">
                          <DiamondShopWelfare :current="currentPrice" />
                        </el-col>
                        <el-col :span="5" :push="13">
                          <div class="submit">
                            <h3>总价： {{currentPrice.price}}元</h3>
                            <el-popconfirm
                              title="确定提交审核吗？"
                              @confirm="submit"
                            >
                              <el-button slot="reference" type="danger" plain>提交审核</el-button>
                            </el-popconfirm>
                          </div>
                        </el-col>
                      </el-row>
                    </section>
                    <section v-if="queryResult.error || queryResult.overHeat">
                      <p v-if="!queryResult.error && queryResult.overHeat">{{queryResult.overHeatWords.join("、")}}热度>500，暂无报价，请申请人工报价</p>
                      <p v-if="queryResult.error && !queryResult.overHeat">{{queryResult.overHeatWords.join("、")}}未获取到热度，请重试或申请人工报价</p>
                      <p v-if="queryResult.error && queryResult.overHeat">{{queryResult.overHeatWords.join("、")}}热度>500，{{queryResult.errorWords.join("、")}}未获取到热度，请申请人工报价</p>
                      <el-popconfirm
                        title="确定提交审核吗？"
                        @confirm="submit"
                      >
                        <el-button slot="reference" style="margin-top: 30px" type="danger" plain>申请人工报价</el-button>
                      </el-popconfirm>
                    </section>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <BwPlusDialog :BwPlusDialogMsg="BwPlusDialogMsg" @close="BwPlusDialogMsg.dialogVisible = false"/>
    </section>
</template>

<script>
import { InqueryForm, KeywordHotDetail, Title, InqueryResult, DiamondShopWelfare, BwPlusDialog } from './components'
import { querySystemResult, commit } from 'api/biaowang-plus'
import { APPLY_TYPE_NORMAL, APPLY_TYPE_ERROR, APPLY_TYPE_OVERHEAT, APPLY_TYPE_ERROR_APPLY_TYPE_OVERHEAT } from 'constant/bw-plus'
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
    },
    salesInfo: {
      type: Object,
      require: true
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
      queryResult: {},
      currentPrice: {},
      queryInfo: {}
    }
  },
  methods: {
    handleClick () {},
    applyTypeFilter (error, overHeat) {
      if (error && overHeat) {
        return APPLY_TYPE_ERROR_APPLY_TYPE_OVERHEAT
      }
      if (error && !overHeat) {
        return APPLY_TYPE_ERROR
      }
      if (!error && !overHeat) {
        return APPLY_TYPE_NORMAL
      }
      if (!error && overHeat) {
        return APPLY_TYPE_OVERHEAT
      }
    },
    async submit () {
      const { error, overHeat, priceId, tempPvId } = this.queryResult
      const { userId: targetUserId } = this.salesInfo
      const { queryInfo, applyTypeFilter, currentPrice } = this
      const baseParams = { targetUserId, applyType: applyTypeFilter(error, overHeat) }
      let params = {}
      if (!error && !overHeat) {
        params = {
          ...baseParams,
          applyBasicAttr: { priceId, ...currentPrice }
        }
      } else {
        params = {
          ...baseParams,
          applyKeywordsAttr: {
            ...queryInfo,
            tempPvId
          }
        }
      }
      const { code, data } = await commit(params)
      if (code === 0) {
        this.BwPlusDialogMsg = {
          dialogVisible: true,
          type: 'success',
          content: '审核预计1-3个工作日，去查看审核进度',
          title: '提交成功'
        }
      }
      if (code === 4080) {
        this.BwPlusDialogMsg = {
          dialogVisible: true,
          type: 'error',
          content: data,
          title: '提交失败'
        }
      }
    },
    async inquery (form) {
      const params = {
        cities: form.cities,
        coreCity: form.coreCities[0],
        industry: form.industry,
        words: form.words.split(/[\s\n]/)
      }
      this.queryInfo = params
      const { data } = await querySystemResult(params)
      console.log(data)
      this.queryResult = data
      this.$nextTick(() => {
        this.$refs.viewScrollTop.scrollIntoView()
      })
    },
    getCurrentPrice (value) {
      this.currentPrice = value
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
