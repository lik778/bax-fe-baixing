<template>
  <section class="bw-query-price">
    <el-card class="box-card query-card">
      <InqueryForm
        :allAreas="allAreas"
        @inquery="inquery"
        :isPending="isPending"
        @resetResult="resetResult"
      />
      <div ref="viewScrollTop" class="viewScrollTop"></div>
      <SoldCityLayout
        :allAreas="allAreas"
        :keywordsLockDetails="keywordLockDetails.lockList"
        v-if="keywordLockDetails.lockList && keywordLockDetails.lockList.length"
      />
      <section class="bw-query-price_item" v-if="showKeywordPv">
        <Title title="关键词热度明细" />
        <KeywordHotDetail :tableData="queryResult.keywordPvList" />
      </section>
    </el-card>
    <div v-if="showResult">
      <el-card class="box-card">
        <section class="bw-query-price_item">
          <Title
            title="百度标王"
            subTitle="标准版"
            subExtra="（不含配图）请选择需要的平台*时段*时长"
          />
          <InqueryResult
            :disableDeviceListBySku="keywordLockDetails.disableDeviceListBySku"
            :currentPrice="currentPrice"
            @getValue="getCurrentPrice"
            :tableData="queryResult.keywordPriceList"
            :skipAudit="queryResult.industryAuditResult.skipManualAudit"
          />
          <BwCreativity
            v-if="productList && productList.length"
            @checked="checked"
            :currentPrice="currentPrice"
            :skipAudit="queryResult.industryAuditResult.skipManualAudit"
            :productList="productList.filter((o) => o.type === 0)"
          />
        </section>
      </el-card>
      <BwAdditionProducts
        v-if="productList && productList.length"
        @checked="checked"
        @getExtraProductValue="getAdditionProductValue"
        :skipAudit="queryResult.industryAuditResult.skipManualAudit"
        :currentPrice="currentPrice"
        :disableDeviceListBySku="keywordLockDetails.disableDeviceListBySku"
        :priceList="queryResult.keywordPriceList"
        :productList="productList.filter((o) => o.type !== 0)"
      />
    </div>
    <div :style="{height: '80px'}"></div>
    <div class="box-card submit-fixed" v-if="showResult">
      <WelfareLayout @postActivityID="acceptActivityID" :isInit="isInits" :currentPrice="getWelfareInfo" />
      <div class="submit">
        <h3>总价： {{queryResult.industryAuditResult.skipManualAudit?transformPrice:' XXX ' }}元</h3>
        <el-button
          @click="isSubmit = true"
          :disabled="allowCommit"
          type="danger"
          :loading="isPending"
          >{{ showCommitDesc }}</el-button
        >
      </div>
    </div>
    <el-card class="box-card" v-if="showErrorFooter">
      <ErrorFooter :queryResult="queryResult" />
    </el-card>
    <CommitDialog
      v-if="queryResult.industryAuditResult"
      :industryAuditResult="queryResult.industryAuditResult"
      :welfare="getWelfareInfo"
      :destroy-on-close="true"
      :allAreas="allAreas"
      :preInfo="preInfo"
      :visible="isSubmit"
      :isPending="isPending"
      @cancel="cancel"
      @submit="submit"
    />
  </section>
</template>

<script>
import {
  InqueryForm,
  KeywordHotDetail,
  Title,
  InqueryResult,
  WelfareLayout,
  ErrorFooter,
  CommitDialog,
  SoldCityLayout,
  BwAdditionProducts,
  BwCreativity
} from '../components'
import { querySystemResult, commit } from 'api/biaowang-plus'
import {
  APPLY_TYPE_NORMAL,
  APPLY_TYPE_ERROR,
  DEVICE_PROPS,
  DEVICE_THREE,
  SEO_PRODUCT_TYPE,
  CREATIVE_PRODUCT_TYPE,
  BAIDU_PRODUCT_SOURCE
} from 'constant/bw-plus'
import { f2y } from 'util'
import clone from 'clone'
import debounce from 'lodash.debounce'
export default {
  name: 'bw-plus-query-price',
  components: {
    InqueryForm,
    KeywordHotDetail,
    Title,
    InqueryResult,
    WelfareLayout,
    ErrorFooter,
    CommitDialog,
    SoldCityLayout,
    BwAdditionProducts,
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
      copyResult: [],
      currentPrice: {}, // 用户当前选中的价格
      queryInfo: {},
      keywordLockDetails: [], // 当前关键词锁词详情
      isPending: false,
      productList: [],
      cloneProductList: [],
      checkedProducts: [],
      isHight: true,
      isInits: false
    }
  },
  computed: {
    allowCommit () {
      return !(this.transformPrice > 0)
    },
    showCommitDesc () {
      const {
        queryResult: { industryAuditResult }
      } = this
      return industryAuditResult && industryAuditResult.skipManualAudit
        ? '确 认'
        : '提交审核'
    },
    getWelfareInfo () {
      const { productList, currentPrice, totalPrice } = this
      const checkedProducts = productList.filter((p) => p.checked)
      const durationArray = [
        ...checkedProducts.map((info) => info.currentPrice.duration),
        currentPrice.duration || 0
      ]
      return {
        ...currentPrice,
        duration: Math.max(...durationArray),
        price: currentPrice.price && currentPrice.price > 0 ? currentPrice.price + totalPrice : totalPrice
      }
    },
    preInfo () {
      // 构造选中商品列表数据，给用户确认
      const { queryInfo, productList, currentPrice } = this
      const ratio =
        currentPrice.price && currentPrice.price > 0
          ? 'dealPriceRatio'
          : 'withoutPackagePriceRatio'
      const checkedProducts = productList.filter((p) => p.checked)
      const additionProduct = checkedProducts.map((o) => ({
        dealPrice:
          o.type === SEO_PRODUCT_TYPE
            ? currentPrice.price && currentPrice.price > 0
                ? o.certainDealPrice
                : o.withoutPackageCertainDealPrice
            : o.currentPrice.price * o[ratio],
        device: o.currentPrice.device,
        duration: o.currentPrice.duration,
        name: o.title,
        originPrice:
          o.type === SEO_PRODUCT_TYPE
            ? o.certainOriginPrice
            : o.currentPrice.price * o.originalPriceRatio,
        scheduleType: o.currentPrice.scheduleType,
        displayType:
          o.type === SEO_PRODUCT_TYPE || o.type === CREATIVE_PRODUCT_TYPE
            ? 1
            : 0
      }))
      const BAIDU_BW = [
        {
          dealPrice: currentPrice.price,
          originPrice: currentPrice.price,
          name: '百度标王标准版',
          ...currentPrice,
          displayType: 0
        }
      ]
      const preInfo = {
        keywords: queryInfo.words,
        cities: queryInfo.cities,
        additionProductMap:
          currentPrice.price && currentPrice.price > 0
            ? [...additionProduct, ...BAIDU_BW]
            : additionProduct
      }
      return preInfo
    },
    showKeywordPv () {
      return (
        this.queryResult.keywordPvList &&
        this.queryResult.keywordPvList.length > 0
      )
    },
    showErrorFooter () {
      const {
        queryResult: { error, overHeat, industryError }
      } = this
      return !!error || !!overHeat || !!industryError
    },
    showResult () {
      const { queryResult, showErrorFooter } = this
      return !showErrorFooter && !!queryResult.keywordPriceList
    },
    transformPrice () {
      const { currentPrice } = this
      if (!currentPrice.price || currentPrice.price < 0) {
        currentPrice.price = 0
      }
      return f2y(currentPrice.price + this.totalPrice) > 0
        ? Math.round(f2y(currentPrice.price + this.totalPrice))
        : '-'
    },
    checkedAdditionProduct () {
      const { productList } = this
      return productList.reduce((a, b) => {
        return b.checked ? [...a, { ...b.currentPrice, skuId: b.id }] : a
      }, [])
    },
    totalPrice () {
      const { productList, currentPrice } = this
      const ratio =
        currentPrice.price && currentPrice.price > 0
          ? 'dealPriceRatio'
          : 'withoutPackagePriceRatio'
      const total = productList.reduce((producPrev, producNext) => {
        const priceB = producNext.checked
          ? producNext.type === SEO_PRODUCT_TYPE
              ? currentPrice.price && currentPrice.price > 0
                  ? producNext.certainDealPrice
                  : producNext.withoutPackageCertainDealPrice
              : producNext.currentPrice.price * producNext[ratio]
          : 0
        return producPrev + priceB
      }, 0)
      return total
    }
  },
  methods: {
    acceptActivityID (id) {
      if (Number(id) === 1) { // 涨5%
        this.isHight = true
        const cloneKeyWordPriceList = clone(this.queryResult.keywordPriceList)
        const cloneProduct = clone(this.productList)
        for (const i in cloneKeyWordPriceList) {
          cloneKeyWordPriceList[i] = this.changePriceObject(cloneKeyWordPriceList[i])
        }
        this.queryResult.keywordPriceList = cloneKeyWordPriceList
        const lastCurrentPrice = clone(this.currentPrice)
        this.currentPrice = { ...lastCurrentPrice, price: clone(lastCurrentPrice).price * 1.05 }
        // product 也涨5%
        for (const p in cloneProduct) {
          const pItem = clone(cloneProduct[p])
          if (pItem.hasOwnProperty('currentPrice')) {
            pItem.currentPrice.price = pItem.currentPrice.price * 1.05
          }
          // if (pItem.hasOwnProperty('options')) {
          //   pItem.options = pItem.options.map(pOptions => {
          //     return { ...pOptions, price: pOptions.price * 1.05 }
          //   })
          // }
          cloneProduct[p] = pItem
        }
        this.productList = cloneProduct
      } else {
        this.isHight = false
        this.queryResult.keywordPriceList = this.copyResult
        const cloneProduct = clone(this.productList)
        const lastCurrentPrice = clone(this.currentPrice)
        this.currentPrice = { ...lastCurrentPrice, price: clone(lastCurrentPrice).price / 1.05 }
        // product 减少5%
        for (const p in cloneProduct) {
          const pItem = clone(cloneProduct[p])
          if (pItem.hasOwnProperty('currentPrice')) {
            pItem.currentPrice.price = pItem.currentPrice.price / 1.05
          }
          // if (pItem.hasOwnProperty('options')) {
          //   pItem.options = pItem.options.map(pOptions => {
          //     return { ...pOptions, price: pOptions.price / 1.05 }
          //   })
          // }
          cloneProduct[p] = pItem
        }
        this.productList = cloneProduct
      }
    },
    changePriceObject (obj) {
      const cloneObject = clone(obj)
      const arr = Object.keys(cloneObject)
      arr.forEach(item => {
        if (typeof cloneObject[item] === 'object') {
          const curObj = clone(cloneObject[item])
          if (curObj.hasOwnProperty('price')) {
            curObj.price += curObj.price * 0.05
            cloneObject[item] = curObj
          }
        }
      })
      return cloneObject
    },
    getIndustryAuditType (industryAuditResult) {
      if (industryAuditResult && industryAuditResult.industryManualAuditType) {
        switch (industryAuditResult.industryManualAuditType) {
          case 1:
            return '需要人工审核哦，关键词行业比较特殊！提单价格以人工审核结果为准～'
          case 2:
            return '需要人工审核哦，关键词行业比较特殊！提单价格以人工审核结果为准～'
          case 3:
            return '需要人工审核哦，关键词竞争极其激烈！提单价格以人工审核结果为准～'
          default:
            return ''
        }
      }
      return ''
    },
    cancel () {
      this.isSubmit = false
      this.isPending = false
    },
    checked (product) {
      const { productList } = this
      this.productList = productList.map((p) =>
        product.id === p.id ? product : p
      )
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
    },
    submit: debounce(async function () {
      this.isPending = true
      const {
        error,
        overHeat,
        priceId,
        tempPvId,
        industryError
      } = this.queryResult
      const { userId: targetUserId } = this.salesInfo
      const {
        queryInfo,
        applyTypeFilter,
        currentPrice,
        checkedAdditionProduct: additionProduct,
        isHight
      } = this
      const baseParams = {
        targetUserId,
        applyType:
          currentPrice.price === 0
            ? 2
            : applyTypeFilter(error, overHeat, industryError)
      }
      let params = {}
      if (!error && !overHeat && !industryError) {
        // error、overHeat、industryError都为false时为系统报价，参数如下
        // 5%减掉
        const clonePostCurrentprice = clone(currentPrice)
        const clonePostAdditionProduct = clone(additionProduct)
        if (isHight) {
          clonePostCurrentprice.price = clonePostCurrentprice.price / 1.05
          clonePostAdditionProduct.length > 0 && clonePostAdditionProduct.forEach(item => { item.price = item.price / 1.05 })
        }
        params = {
          ...baseParams,
          applyBasicAttr: { priceId, ...clonePostCurrentprice },
          additionProduct: clonePostAdditionProduct
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
          //   const applyId = data.applyId
          //   const skipAudit = industryAuditResult.skipManualAudit
          this.$router.push({
            name: 'bw-plus-price-records'
          })
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
    findSomeoneAllowSold (priceList, skuId) {
      const {
        keywordLockDetails: { disableDeviceListBySku }
      } = this
      const disabledDevice = disableDeviceListBySku[skuId] || []
      // 若找不到，即该关键词在该渠道所有平台全部已售出
      const target = priceList.find(
        (item) => item.price > 0 && !disabledDevice.includes(item.device)
      )
      return target
        ? { ...target, skuId }
        : { ...priceList[0], price: 0, skuId }
    },
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
        const {
          data,
          code,
          message,
          data: { additionalProducts, keywordLockDetails }
        } = await querySystemResult(params)
        if (code === 0) {
          this.queryResult = data
          this.copyResult = data.keywordPriceList
          this.keywordLockDetails = keywordLockDetails
          this.currentPrice =
            data.keywordPriceList &&
            this.findSomeoneAllowSold(
              Object.values(data.keywordPriceList[0]),
              BAIDU_PRODUCT_SOURCE
            )
          additionalProducts && this.transformProductList(additionalProducts)
          data.industryAuditResult &&
            this.showIndustryAuditResult(data.industryAuditResult)
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
        this.acceptActivityID(1)
        this.isInits = !this.isInits
      }
    },

    showIndustryAuditResult (industryAuditResult) {
      const content = industryAuditResult.skipManualAudit
        ? '关键词已审核通过，确认套餐后可以确认订单~'
        : this.getIndustryAuditType(industryAuditResult)
      this.$alert(content, '温馨提示', {
        confirmButtonText: '确定',
        callback: () => {
          this.$refs.viewScrollTop.scrollIntoView()
        }
      })
    },
    // 根据当前百度标王选中的属性计算创意类型加购商品的价格，与当前选中的百度标王的价格属性一致（并且在limit内）
    transformCreativeCurrentPrice (product, options) {
      const {
        currentPrice: { device, scheduleType, duration }
      } = this
      const {
        limit: { platform, schedule, type }
      } = product
      return options.find((option) => {
        const props = {
          device: platform[0] === DEVICE_THREE ? device : platform[0],
          scheduleType: schedule.includes(scheduleType)
            ? scheduleType
            : schedule[0],
          duration: type.includes(duration) ? duration : type[0]
        }
        return (
          option.device === props.device &&
          option.scheduleType === props.scheduleType &&
          option.duration === props.duration
        )
      })
    },
    getCurrentPrice (value) {
      const { currentPrice: { skuId } } = this
      this.currentPrice = { skuId, ...value }
      const { productList, transformCreativeCurrentPrice } = this
      if (Object.values(value).length > 0) {
        // 当前为选中百度标王状态时，遍历所有加购商品，计算出在当前百度标王的属性下，加购商品的价格
        this.productList = productList.map((product) => {
          if (product.options && product.type === CREATIVE_PRODUCT_TYPE) {
            const currentPrice = transformCreativeCurrentPrice(
              product,
              product.options
            )
            return { ...product, currentPrice: { ...currentPrice, price: this.currentPrice.price } }
          } else {
            return product
          }
        })
      } else {
        // 取消选中百度标王状态，创意相关商品重置为未选中、价格置空，其他商品不变
        this.productList = productList.map((product) =>
          product.type === CREATIVE_PRODUCT_TYPE
            ? {
                ...product,
                checked: false,
                currentPrice: { ...value, skuId: product.id }
              }
            : product
        )
      }
    },
    getAdditionProductValue (value) {
      const { productList } = this
      this.productList = productList.map((product) => {
        if (product.id === value.skuId) {
          product.currentPrice = value
        }
        return product
      })
    },
    // 计算当前小渠道商品的价格
    transformCurrentPrice (product, options) {
      const {
        limit: { platform },
        id: skuId
      } = product
      const {
        queryResult: { keywordPriceList }
      } = this
      const priceListAllow =
        platform[0] === DEVICE_THREE
          ? Object.values(keywordPriceList[0])
          : options.filter((o) => platform.includes(o.device))
      return this.findSomeoneAllowSold(priceListAllow, skuId)
    },
    // 将加购商品根据limit计算出每个加购商品的可选价格项和默认价格，以及商品初始状态，该方法在初始化时执行一遍
    // checked: false（默认未选中）currentPrice（默认初始价格）options（可选价格项）
    transformProductList (additionalProducts) {
      const {
        currentPrice,
        queryResult: { keywordPriceList }
      } = this
      this.productList = [...additionalProducts].map((additionalProduct) => {
        if (
          !additionalProduct.limit ||
          Object.values(additionalProduct.limit).length === 0
        ) {
          return { ...additionalProduct, currentPrice, checked: false }
        } else {
          const { platform, schedule, type } = additionalProduct.limit
          const optionsPlatformProp =
            DEVICE_PROPS[
              Object.keys(DEVICE_PROPS).filter(
                (d) => platform[0] === Number(d)
              )[0]
            ]
          const optionsType = keywordPriceList.filter((keywordPrice) =>
            type.includes(keywordPrice.type)
          )
          const optionsPlatform = optionsType.reduce(
            (optionPrev, optionNext) => [
              ...optionPrev,
              ...optionsPlatformProp.map(
                (platformProp) => optionNext[platformProp]
              )
            ],
            []
          )
          const options = optionsPlatform.filter((platform) =>
            schedule.includes(platform.scheduleType)
          )
          let resultPrice = {}
          if (additionalProduct.type === CREATIVE_PRODUCT_TYPE) {
            resultPrice = this.transformCreativeCurrentPrice(
              additionalProduct,
              options
            )
          } else {
            resultPrice = this.transformCurrentPrice(
              additionalProduct,
              options
            )
          }
          return {
            ...additionalProduct,
            currentPrice: { ...resultPrice, skuId: additionalProduct.id },
            options,
            checked: false
          }
        }
      })
      this.cloneProductList = clone(this.productList)
    }
  }
}
</script>

<style lang="scss" scoped src="./index.scss" />
