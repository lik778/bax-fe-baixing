<template>
    <section class="bw-query-price">
        <el-card class="box-card">
          <InqueryForm :allAreas="allAreas" @inquery="inquery" @resetResult="resetResult"/>
          <div ref="viewScrollTop" class="placeHolder"></div>
          <SoldCityLayout :allAreas="allAreas" :keywordsLockDetails="keywordsLockDetails" :keywordLockText="keywordLockText" v-if="ifExistLockCity"/>
          <section class="bw-query-price_item" v-if="queryResult.keywordPvList">
            <Title title="关键词热度明细"/>
            <KeywordHotDetail :tableData="queryResult && queryResult.keywordPvList"/>
          </section>
        </el-card>
        <div v-if="showResult">
        <el-card class="box-card">
          <section class="bw-query-price_item">
            <Title title="百度标王，王牌产品" extra="请选择需要的平台*时段*时长"/>
            <InqueryResult :deviceAvailableStatus="deviceAvailableStatus" :currentPrice="currentPrice" @getValue="getCurrentPrice" :tableData="queryResult && queryResult.keywordPriceList" />
            <BwCreativity @checked="checked" :productList="productList.filter(o => o.type === 0)"/>
          </section>
        </el-card>
        <BwProducts @checked="checked" @getExtraProductValue="getExtraProductValue" :currentPrice="currentPrice" :deviceAvailableStatus="deviceAvailableStatus" :priceList="queryResult && queryResult.keywordPriceList" :productList="productList.filter(o => o.type !== 0)" />
        </div>
        <el-card class="box-card" v-if="showResult">
          <WelfareLayout :currentPrice="currentPrice"/>
          <div class="submit">
            <h3>总价： {{transformPrice}}元</h3>
            <el-button @click="isSubmit = true" :disabled="!(transformPrice > 0 && ifSoldAvailable)" type="danger" :loading="isPending">提交审核</el-button>
          </div>
          <ErrorFooter v-if="queryResult.error || queryResult.overHeat || queryResult.industryError" :queryResult="queryResult"/>
        </el-card>
        <BwPlusDialog :BwPlusDialogMsg="BwPlusDialogMsg" @close="BwPlusDialogMsg.dialogVisible = false"/>
        <CommitDialog :visible="isSubmit" :isPending="isPending" @cancel="isSubmit = false" @submit="submit"/>
    </section>
</template>

<script>
import { InqueryForm, KeywordHotDetail, Title, InqueryResult, BwPlusDialog, WelfareLayout, ErrorFooter, CommitDialog, SoldCityLayout, BwProducts, BwCreativity } from '../components'
import { querySystemResult, commit } from 'api/biaowang-plus'
import { APPLY_TYPE_NORMAL, APPLY_TYPE_ERROR, DEVICE_PROPS, DEVICE_ALL } from 'constant/bw-plus'
import { f2y } from 'util'
import debounce from 'lodash.debounce'
export default {
  name: 'bw-plus-query-price',
  components: {
    InqueryForm,
    KeywordHotDetail,
    Title,
    InqueryResult,
    BwPlusDialog,
    WelfareLayout,
    ErrorFooter,
    CommitDialog,
    SoldCityLayout,
    BwProducts,
    BwCreativity
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
      debounce,
      activeName: 'first',
      isSubmit: false,
      BwPlusDialogMsg: {
        type: 'success',
        dialogVisible: false,
        content: '',
        title: ''
      },
      queryResult: {},
      currentPrice: {}, // 用户当前选中的价格
      queryInfo: {},
      keywordsLockDetails: [], // 当前关键词锁词详情
      ifExistLockCity: false, // 当前关键词是否存在已售城市
      keywordLockText: '', // 关键词已售文案
      deviceAvailableStatus: {}, // 判断当前关键词在各设备端是否可售
      ifSoldAvailable: false, // 是否存在可售卖的平台,
      isPending: false,
      productList: [],
      checkedProducts: [],
      checkedCreativities: []
    }
  },
  computed: {
    showResult () {
      const { queryResult } = this
      return !(queryResult.error && queryResult.overHeat) && queryResult.keywordPriceList
    },
    transformPrice () {
      const { currentPrice } = this
      if (!currentPrice.price || currentPrice.price < 0) {
        currentPrice.price = 0
      }
      return f2y(currentPrice.price + this.totalPrice) > 0 ? f2y(currentPrice.price + this.totalPrice) : '-'
    },
    checkedAdditionProduct () {
      const { productList } = this
      const checkedProducts = productList.filter(p => p.checked)
      return checkedProducts.map(c => ({
        ...c.currentPrice,
        skuId: c.id
      }))
    },
    totalPrice () {
      const { productList } = this
      console.log(productList)
      const total = productList.reduce((a, b) => {
        const priceB = b.checked ? (b.type === 2 ? b.certainDealPrice : b.currentPrice.price * b.dealPriceRatio) : 0
        return a + priceB
      }, 0)
      console.log(total)
      return total
    }
  },
  methods: {
    checked (product) {
      const { productList } = this
      this.productList = productList.map(p => product.id === p.id ? product : p)
    },
    applyTypeFilter (error, overHeat, industryError) {
      if (error || overHeat || industryError) {
        return APPLY_TYPE_ERROR
      } else {
        return APPLY_TYPE_NORMAL
      }
    },
    resetResult () {
      this.queryResult = {}
      this.currentPrice = {}
      this.queryInfo = {}
      this.keywordsLockDetails = []
      this.ifExistLockCity = false
    },
    submit: debounce(async function () {
      this.isPending = true
      const { error, overHeat, priceId, tempPvId, industryError } = this.queryResult
      const { userId: targetUserId } = this.salesInfo
      const { queryInfo, applyTypeFilter, currentPrice, checkedAdditionProduct } = this
      const baseParams = { targetUserId, applyType: applyTypeFilter(error, overHeat, industryError) }
      let params = {}
      if (!error && !overHeat && !industryError) {
        // error、overHeat、industryError都为false时为系统报价，参数如下
        params = {
          ...baseParams,
          applyBasicAttr: { priceId, ...currentPrice },
          checkedAdditionProduct
        }
      } else {
        // error、overHeat、industryError不都为false时为人工报价，参数如下
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
        this.isSubmit = false
        this.resetResult()
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
      this.isPending = false
    }, 300),
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
        const { data, code, message, data: { additionalProducts, keywordsLockDetails: { keywordsLockDetails, ifExistLockCity, ifSoldAvailable, deviceAvailableStatus: { ifMobileAvailable, ifPcAvailable }, deviceAvailableStatus } } } = await querySystemResult(params)
        if (code === 0) {
          this.queryResult = data
          // 锁词相关逻辑
          this.ifExistLockCity = ifExistLockCity
          this.keywordsLockDetails = keywordsLockDetails
          this.deviceAvailableStatus = deviceAvailableStatus
          this.ifSoldAvailable = ifSoldAvailable
          if (!ifSoldAvailable) {
            this.currentPrice = {}
            this.keywordLockText = '手机端、电脑端的“部分词的部分城市”已售出，详情如下。请更换已售出关键词/城市重新查价～'
          } else if (!ifPcAvailable) {
            this.currentPrice = data.keywordPriceList && data.keywordPriceList[0].wapSeven
            this.keywordLockText = '电脑端的“部分词的部分城市”已售出，详情如下。请更换已售出关键词/城市重新查价～'
          } else if (!ifMobileAvailable) {
            this.currentPrice = data.keywordPriceList && data.keywordPriceList[0].pcSeven
            this.keywordLockText = '手机端的“部分词的部分城市”已售出，详情如下。请更换已售出关键词/城市重新查价～'
          } else {
            this.currentPrice = data.keywordPriceList && data.keywordPriceList[0].bothSeven
          }
          this.transformProductList(additionalProducts)
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
      if (Object.values(value).length > 0) {
        const { productList, transformCurrentPrice } = this
        this.productList = productList.map(p => {
          let currentPrice = value
          if (p.options) {
            currentPrice = transformCurrentPrice(p, p.options)
          }
          return { ...p, currentPrice }
        })
      }
    },
    getExtraProductValue (value) {
      const { productList } = this
      this.productList = productList.map(o => {
        if (o.id === value.productId) {
          o.currentPrice = value
        }
        return o
      })
    },
    transformCurrentPrice (product, options) {
      const { currentPrice: { device, scheduleType, duration } } = this
      const { limit: { platform, schedule, type } } = product
      return options.find(k => {
        const props = {
          device: platform[0] === DEVICE_ALL ? device : platform[0],
          scheduleType: schedule.includes(scheduleType) ? scheduleType : schedule[0],
          duration: type.includes(duration) ? duration : type[0]
        }
        return k.device === props.device && k.scheduleType === props.scheduleType && k.duration === props.duration
      })
    },
    transformProductList (additionalProducts) {
      const { currentPrice, queryResult: { keywordPriceList } } = this
      this.productList = [...additionalProducts].map(o => {
        if (!o.limit || Object.values(o.limit).length === 0) {
          return ({ ...o, currentPrice, checked: false })
        } else {
          const { platform, schedule, type } = o.limit
          const optionsPlatformProp = DEVICE_PROPS[Object.keys(DEVICE_PROPS).filter(d => platform[0] === (Number(d)))[0]]
          const optionsType = keywordPriceList.filter(k => type.includes(k.type))
          const optionsPlatform = optionsType.reduce((a, b) => [
            ...a, ...optionsPlatformProp.map(p => b[p])
          ], [])
          const options = optionsPlatform.filter(k => schedule.includes(k.scheduleType))
          const resultPrice = this.transformCurrentPrice(o, options)
          return ({ ...o, currentPrice: resultPrice, options, checked: false })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped src="./index.scss"/>
