<template>
    <section class="bw-query-price">
        <el-card class="box-card">
          <InqueryForm :allAreas="allAreas" @inquery="inquery" :isPending="isPending" @resetResult="resetResult"/>
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
        <CommitDialog :allAreas="allAreas" :preInfo="preInfo" :visible="isSubmit" :isPending="isPending" @cancel="cancel" @submit="submit"/>
    </section>
</template>

<script>
import { InqueryForm, KeywordHotDetail, Title, InqueryResult, BwPlusDialog, WelfareLayout, ErrorFooter, CommitDialog, SoldCityLayout, BwProducts, BwCreativity } from '../components'
import { querySystemResult, commit } from 'api/biaowang-plus'
import { APPLY_TYPE_NORMAL, APPLY_TYPE_ERROR, DEVICE_PROPS, DEVICE_THREE, SEO_PRODUCT_TYPE } from 'constant/bw-plus'
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
    },
    userInfo: {
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
      checkedProducts: []
    }
  },
  computed: {
    preInfo () {
      const { queryInfo, productList, currentPrice } = this
      const checkedProducts = productList.filter(p => p.checked)
      const additionProduct = checkedProducts.map(o => (
        {
          dealPrice: o.type === SEO_PRODUCT_TYPE ? o.certainDealPrice : o.currentPrice.price * o.dealPriceRatio,
          device: o.currentPrice.device,
          duration: o.currentPrice.duration,
          name: o.title,
          originPrice: o.currentPrice.price * o.originalPriceRatio,
          scheduleType: o.currentPrice.scheduleType,
          type: o.type
        }
      ))
      const BAIDU_BW = [{
        dealPrice: currentPrice.price,
        originPrice: currentPrice.price,
        name: '百度标王标准版',
        ...currentPrice
      }]
      const preInfo = {
        keywords: queryInfo.words,
        cities: queryInfo.cities,
        additionProductMap: currentPrice.price && currentPrice.price > 0 ? [...additionProduct, ...BAIDU_BW] : additionProduct
      }
      return preInfo
    },
    showResult () {
      const { queryResult, ifSoldAvailable } = this
      return !(queryResult.error && queryResult.overHeat) && queryResult.keywordPriceList && ifSoldAvailable
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
      return productList.reduce((a, b) => {
        return b.checked ? [...a, { ...b.currentPrice, skuId: b.id }] : a
      }, [])
    },
    totalPrice () {
      const { productList } = this
      const total = productList.reduce((producPrev, producNext) => {
        const priceB = producNext.checked ? (producNext.type === 2 ? producNext.certainDealPrice : producNext.currentPrice.price * producNext.dealPriceRatio) : 0
        return producPrev + priceB
      }, 0)
      console.log(total)
      return total
    }
  },
  methods: {
    cancel () {
      this.isSubmit = false
      this.isPending = false
    },
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
      const { queryInfo, applyTypeFilter, currentPrice, checkedAdditionProduct: additionProduct } = this
      const baseParams = { targetUserId, applyType: currentPrice.price === 0 ? 2 : applyTypeFilter(error, overHeat, industryError) }
      let params = {}
      if (!error && !overHeat && !industryError) {
        // error、overHeat、industryError都为false时为系统报价，参数如下
        params = {
          ...baseParams,
          applyBasicAttr: { priceId, ...currentPrice },
          additionProduct
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
      try {
        const { code, data } = await commit(params)
        if (code === 0) {
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
      } catch (error) {
        console.log(error)
      } finally {
        this.isPending = false
        this.isSubmit = false
      }
    }, 300),
    async inquery (form) {
      this.isPending = true
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
      } catch (error) {
        console.log('error', error)
      } finally {
        loading.close()
        this.isPending = false
      }
    },
    getCurrentPrice (value) {
      this.currentPrice = value
      const { productList, transformCurrentPrice } = this
      if (Object.values(value).length > 0) {
        this.productList = productList.map(product => {
          let currentPrice = value
          if (product.options) {
            currentPrice = transformCurrentPrice(product, product.options)
          }
          return { ...product, currentPrice }
        })
      } else {
        this.productList = productList.map(product => product.type === 0 ? { ...product, checked: false, currentPrice: value } : product)
      }
    },
    getExtraProductValue (value) {
      const { productList } = this
      this.productList = productList.map(product => {
        if (product.id === value.productId) {
          product.currentPrice = value
        }
        return product
      })
    },
    transformCurrentPrice (product, options) {
      const { currentPrice: { device, scheduleType, duration } } = this
      const { limit: { platform, schedule, type } } = product
      return options.find(option => {
        const props = {
          device: platform[0] === DEVICE_THREE ? device : platform[0],
          scheduleType: schedule.includes(scheduleType) ? scheduleType : schedule[0],
          duration: type.includes(duration) ? duration : type[0]
        }
        return option.device === props.device && option.scheduleType === props.scheduleType && option.duration === props.duration
      })
    },
    transformProductList (additionalProducts) {
      const { currentPrice, queryResult: { keywordPriceList } } = this
      this.productList = [...additionalProducts].map(additionalProduct => {
        if (!additionalProduct.limit || Object.values(additionalProduct.limit).length === 0) {
          return ({ ...additionalProduct, currentPrice, checked: false })
        } else {
          const { platform, schedule, type } = additionalProduct.limit
          const optionsPlatformProp = DEVICE_PROPS[Object.keys(DEVICE_PROPS).filter(d => platform[0] === (Number(d)))[0]]
          const optionsType = keywordPriceList.filter(keywordPrice => type.includes(keywordPrice.type))
          const optionsPlatform = optionsType.reduce((optionPrev, optionNext) => [
            ...optionPrev, ...optionsPlatformProp.map(platformProp => optionNext[platformProp])
          ], [])
          const options = optionsPlatform.filter(platform => schedule.includes(platform.scheduleType))
          const resultPrice = this.transformCurrentPrice(additionalProduct, options)
          return ({ ...additionalProduct, currentPrice: resultPrice, options, checked: false })
        }
      })
      console.log(this.productList)
    }
  }
}
</script>

<style lang="scss" scoped src="./index.scss"/>
