<template>
    <section class="bw-query-price">
        <el-card class="box-card">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="查价" name="first">
                    <InqueryForm :allAreas="allAreas" @inquery="inquery"/>
                    <section v-if="ifExistLockCity" ref="viewScrollTop">
                      <el-alert
                        class="lock-tips"
                        :title="keywordLockText"
                        type="warning"
                        :closable="false"
                        show-icon>
                      </el-alert>
                      <SoldCity :tableData="keywordsLockDetails" :allAreas="allAreas"/>
                    </section>
                    <section class="bw-query-price_item" v-if="queryResult.keywordPvList" ref="viewScrollTop">
                      <Title title="关键词热度明细"/>
                      <KeywordHotDetail :tableData="queryResult && queryResult.keywordPvList"/>
                    </section>
                    <section class="bw-query-price_item" v-if="!(queryResult.error && queryResult.overHeat) && queryResult.keywordPriceList">
                      <Title title="查价结果" extra="请选择需要的平台*时段*时长"/>
                      <InqueryResult :deviceAvailableStatus="deviceAvailableStatus" :currentPrice="currentPrice" @getValue="getCurrentPrice" :tableData="queryResult && queryResult.keywordPriceList" />
                      <el-row type="flex" justify="start" align="middle">
                        <el-col :span="3">
                          <h2 class="wefare-title">超值福利</h2>
                        </el-col>
                        <el-col :span="3">
                          <DiamondShopWelfare :current="currentPrice" />
                        </el-col>
                        <el-col :span="5" :push="13">
                          <div class="submit">
                            <h3>总价： {{transformPrice(currentPrice)}}元</h3>
                            <el-popconfirm
                              title="确定提交审核吗？"
                              @confirm="submit"
                            >
                              <el-button :disabled="(currentPrice.price <0 || currentPrice.price === '-') || !ifSoldAvailable" slot="reference" type="danger">提交审核</el-button>
                            </el-popconfirm>
                          </div>
                        </el-col>
                      </el-row>
                    </section>
                    <section class="footer" v-if="queryResult.error || queryResult.overHeat || queryResult.industryError">
                      <p v-if="!queryResult.error && queryResult.overHeat">{{queryResult.overHeatWords.join("、")}}热度>500，暂无报价，请申请人工报价</p>
                      <p v-if="queryResult.error && !queryResult.overHeat">{{queryResult.overHeatWords.join("、")}}未获取到热度，请重试或申请人工报价</p>
                      <p v-if="queryResult.error && queryResult.overHeat">{{queryResult.overHeatWords.join("、")}}热度>500，{{queryResult.errorWords.join("、")}}未获取到热度，请申请人工报价</p>
                      <p v-if="queryResult.industryError">{{queryInfo.industryCn}}太热，暂无报价，请申请人工报价</p>
                      <el-popconfirm
                        title="确定提交审核吗？"
                        @confirm="submit"
                      >
                        <el-button slot="reference" style="margin-top: 30px" type="danger">申请人工报价</el-button>
                      </el-popconfirm>
                    </section>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <BwPlusDialog :BwPlusDialogMsg="BwPlusDialogMsg" @close="BwPlusDialogMsg.dialogVisible = false"/>
    </section>
</template>

<script>
import { InqueryForm, KeywordHotDetail, Title, InqueryResult, DiamondShopWelfare, BwPlusDialog, SoldCity } from './components'
import { querySystemResult, commit } from 'api/biaowang-plus'
import { APPLY_TYPE_NORMAL, APPLY_TYPE_ERROR } from 'constant/bw-plus'
import { f2y } from 'util'
export default {
  name: 'bw-plus-query-price',
  components: {
    InqueryForm,
    KeywordHotDetail,
    Title,
    InqueryResult,
    DiamondShopWelfare,
    BwPlusDialog,
    SoldCity
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
      queryInfo: {},
      keywordsLockDetails: [], // 当前关键词锁词详情
      ifExistLockCity: false, // 当前关键词是否存在已售城市
      keywordLockText: '', // 关键词已售文案
      deviceAvailableStatus: {}, // 判断当前关键词在各设备端是否可售
      ifSoldAvailable: false // 是否存在可售卖的平台
    }
  },
  methods: {
    handleClick () {},
    transformPrice (currentPrice) {
      return currentPrice.price > 0 ? f2y(currentPrice.price) : '-'
    },
    applyTypeFilter (error, overHeat, industryError) {
      if (error || overHeat || industryError) {
        return APPLY_TYPE_ERROR
      } else {
        return APPLY_TYPE_NORMAL
      }
    },
    async submit () {
      const { error, overHeat, priceId, tempPvId, industryError } = this.queryResult
      const { userId: targetUserId } = this.salesInfo
      const { queryInfo, applyTypeFilter, currentPrice } = this
      const baseParams = { targetUserId, applyType: applyTypeFilter(error, overHeat, industryError) }
      let params = {}
      if (!error && !overHeat && !industryError) {
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
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        cities: form.cities,
        coreCity: form.coreCities[0],
        industry: form.industry,
        words: form.words.split(/[\s\n]/).filter(Boolean)
      }
      this.queryInfo = { ...form, ...params }
      try {
        const { data, code, message, data: { keywordsLockDetails: { keywordsLockDetails, ifExistLockCity, ifSoldAvailable, deviceAvailableStatus: { ifMobileAvailable }, deviceAvailableStatus } } } = await querySystemResult(params)
        if (code === 0) {
          this.queryResult = data
          this.ifExistLockCity = ifExistLockCity
          this.keywordsLockDetails = keywordsLockDetails
          this.deviceAvailableStatus = deviceAvailableStatus
          this.ifSoldAvailable = ifSoldAvailable
          if (!ifSoldAvailable) {
            this.currentPrice = {}
            this.keywordLockText = '手机端、电脑端的“部分词的部分城市”已售出，详情如下。请更换已售出关键词/城市重新查价～'
          } else if (ifMobileAvailable) {
            this.currentPrice = data.keywordPriceList[0].wapSeven
            this.keywordLockText = '电脑端的“部分词的部分城市”已售出，详情如下。请更换已售出关键词/城市重新查价～'
          } else {
            this.currentPrice = data.keywordPriceList[0].pcSeven
            this.keywordLockText = '手机端的“部分词的部分城市”已售出，详情如下。请更换已售出关键词/城市重新查价～'
          }
          this.$nextTick(() => {
            this.$refs.viewScrollTop.scrollIntoView()
          })
        } else {
          this.$message({
            message: message,
            type: 'warning'
          })
        }
        loading.close()
      } catch (error) {
        loading.close()
      } finally {
        loading.close()
      }
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
       padding: 30px;
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
    /deep/ .lock-tips{
      margin-bottom: 10px;
      padding: 14px 16px;
      .el-alert__title{
        font-size: 14px;
      }
    }
</style>
