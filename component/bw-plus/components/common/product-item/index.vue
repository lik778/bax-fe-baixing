<template>
  <div
    :class="{
      'product-wrapper': true,
      'product-checked': product.checked || flag,
      'product-notAllowCheck': notAllowCheck.disable
    }"
    @click="checkProduct"
  >
    <h3 class="product-title">
      <span class="product-title-wrapper">
        {{ product.title }}
        <el-popover
          placement="top-start"
          :title="product.title"
          trigger="hover"
          :disabled="!!product.available"
          popper-class="detail-popover"
          @show="showDetail"
        >
          <ProductDetail :product="product" />
          <i slot="reference" class="el-icon-info"></i>
        </el-popover>
      </span>
      <span class="available-tips" v-if="!!product.available"
        >待上线，请咨询客服</span
      >
      <i v-if="product.tag === 'hot'" class="hot-icon"></i>
    </h3>
    <ul class="product-specification" v-if="showProps">
      <li>{{ showDuration }}天</li>
      <li v-if="product.type === 1">{{ showDevice }}</li>
      <li v-if="product.type === 1">{{ showSchedule }}</li>
    </ul>
    <div class="product-option">
      <div class="price-info">
        <span class="current-price">抢鲜价：{{  skipAudit ? dealPrice : 'XXX' }}元</span>
        <span class="origin-price">原价：{{ skipAudit ?  originalPrice  : 'XXX'}}元</span>
      </div>
      <el-button
        class="mini-button"
        @click.stop="changeCombo"
        v-if="product.type === REGULAR_PRODUCT_TYPE"
        size="mini"
        :disabled="notAllowCheck.disable"
        >更换套餐</el-button
      >
    </div>
  </div>
</template>
<script>
import {
  DEVICE,
  SCHEDULE_TYPE,
  SEO_PRODUCT_TYPE,
  REGULAR_PRODUCT_TYPE,
  CREATIVE_PRODUCT_TYPE,
  IMAGE_PRODUCT_SOURCE,
  DAIL_BUTTON_PRODUCT_SOURCE,
  VIDEO_PRODUCT_SOURCE
} from 'constant/bw-plus'
import { f2y } from 'util'
import { bwPlusTrack } from '../../../utils/track'
import ProductDetail from '../product-detail/index.vue'
const PRODUCT_OFFLINE = 1
export default {
  name: 'product-item',
  props: {
    product: {
      type: Object,
      default: () => {},
      require: true
    },
    currentPrice: {
      type: Object,
      default: () => {},
      require: false
    },
    currentExcludes: {
      type: Array,
      default: () => [],
      require: true
    },
    disableDeviceListBySku: {
      type: Object,
      default: () => {},
      require: false
    },
    skipAudit: {
      type: Boolean,
      default: false,
      require: true
    },
    isRenew: {
      type: Boolean,
      default: false,
      require: false
    },
    flag: {
      type: Boolean,
      default: false,
      require: false
    }
  },
  data () {
    return {
      REGULAR_PRODUCT_TYPE
    }
  },
  computed: {
    showProps () {
      const { limit } = this.product
      return limit && Object.keys(limit).length
    },
    notAllowCheck () {
      const {
        product: {
          currentPrice: { price, skuId },
          additionRenewDetai: { extraOriginPrice } = {}
        },
        isRenew
      } = this
      if (isRenew) {
        return {
          disable: this.currentExcludes.includes(this.product.id) || extraOriginPrice + price <= 0,
          reason: this.currentExcludes.includes(this.product.id) ? '当前商品与所选商品存在互斥' : ''
        }
      }
      if (price <= 0) {
        return {
          disable: true,
          reason: '当前渠道商品已被售出～请更换关键词或城市重新查价购买哦～'
        }
      }
      if (
        !price &&
        [
          IMAGE_PRODUCT_SOURCE,
          DAIL_BUTTON_PRODUCT_SOURCE,
          VIDEO_PRODUCT_SOURCE
        ].includes(skuId)
      ) {
        return {
          disable: true,
          reason: '须购买百度标王标准版，才可以购买此商品'
        }
      }
      // 当前商品与所选商品存在互斥，或者当前商品未上线,或者当前商品是创意相关商品并且其价格<=0(即未选中百度标王产品，不允许单独购买)
      return {
        disable:
          this.currentExcludes.includes(this.product.id) ||
          !!this.product.available ||
          (this.product.type === CREATIVE_PRODUCT_TYPE &&
            Object.values(this.product.currentPrice).length <= 0) ||
          this.product.currentPrice.price <= 0,
        reason: ''
      }
    },
    showDevice () {
      const {
        product: {
          currentPrice: { device }
        }
      } = this
      return DEVICE[device]
    },
    showDuration () {
      const {
        product: {
          currentPrice: { days, duration },
          additionRenewDetai: { extraDays = 0 } = {}
        },
        isRenew
      } = this
      const isRenewDays = days ? `${extraDays}天+${days}` : extraDays
      return isRenew ? isRenewDays : duration || '?'
    },
    showSchedule () {
      const {
        product: {
          currentPrice: { scheduleType }
        }
      } = this
      return SCHEDULE_TYPE[scheduleType]
    },
    baiduBwIsChecked () {
      return this.currentPrice && this.currentPrice.price > 0
    },
    dealPrice () {
      const {
        product: {
          withoutPackageCertainDealPrice,
          certainDealPrice,
          dealPriceRatio,
          withoutPackagePriceRatio,
          type,
          additionRenewDetai,
          currentPrice: { price = 0 }
        },
        isRenew
      } = this
      const defaultPrice = isRenew && additionRenewDetai ? additionRenewDetai.extraOriginPrice + price : price
      const ratio = this.baiduBwIsChecked
        ? dealPriceRatio
        : withoutPackagePriceRatio
      if (type === SEO_PRODUCT_TYPE) {
        return this.baiduBwIsChecked
          ? Math.floor(f2y(certainDealPrice))
          : Math.floor(f2y(withoutPackageCertainDealPrice))
      }
      return defaultPrice > 0 ? Math.floor(f2y(defaultPrice * ratio)) : '?'
    },
    originalPrice () {
      const {
        product: {
          currentPrice: { price = 0 },
          originalPriceRatio,
          certainOriginPrice,
          type,
          additionRenewDetai
        },
        isRenew
      } = this
      const defaultPrice = isRenew && additionRenewDetai ? additionRenewDetai.extraOriginPrice + price : price
      return type === SEO_PRODUCT_TYPE
        ? Math.floor(f2y(certainOriginPrice))
        : defaultPrice > 0
          ? Math.floor(f2y(defaultPrice * originalPriceRatio))
          : '?'
    }
  },
  methods: {
    showDetail () {
      const { product } = this
      bwPlusTrack('bwplus: hover product', { productName: product.title })
    },
    checkProduct () {
      if (this.notAllowCheck.disable) {
        let message = this.notAllowCheck.reason || '请先勾选百度标王产品！'
        if (this.product.available === PRODUCT_OFFLINE) {
          message = this.product.id === 307 ? '敬请期待～' : '当前商品未上线，请咨询客服'
        } else if (!this.notAllowCheck.reason) {
          if (!this.product.currentPrice.index) {
            message = '须购买百度标王标准版，才可以购买此商品'
          } else if (this.product.currentPrice.price <= 0) {
            message = '当前行业过热，暂无报价'
          } else {
            message = '您的所选商品中存在与当前商品相同的服务'
          }
        }
        this.$message({
          message: message,
          type: 'warning'
        })
        return
      }
      const { product } = this
      if (!product.checked) {
        bwPlusTrack('bwplus: click product', { productName: product.title })
      }
      this.$emit('check', product)
    },
    changeCombo () {
      this.$emit('changeCombo', this.product)
    }
  },
  components: {
    ProductDetail
  }
}
</script>
<style lang="scss">
.detail-popover {
  padding: 0px;
  .el-popover__reference-wrapper {
    width: 100%;
  }
  .el-popover__title {
    width: 587px;
    font-size: 14px;
    padding: 11px 13px;
    margin-bottom: 0px;
    background-color: #fff1e2;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #333333;
  }
}
</style>
<style lang="scss" scoped src="./index.scss" />
