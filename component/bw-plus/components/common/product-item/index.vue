<template>
    <div :class="{'product-wrapper': true, 'product-checked': product.checked, 'product-notAllowCheck': notAllowCheck.disable}" @click="checkProduct">
        <h3 class="product-title">
            <span class="product-title-wrapper">
                {{product.title}}
                <el-popover
                    placement="top-start"
                    :title="product.title"
                    trigger="hover"
                    popper-class="detail-popover"
                    class="detail-popover"
                    >
                    <div class="product-detail">
                        <div class="image-wrapper">
                        <img :src="product.image"/>
                        </div>
                        <p>{{product.description}}</p>
                    </div>
                    <i slot="reference" class="el-icon-info"></i>
                </el-popover>
             </span>
              <span class="available-tips" v-if="!!product.available">待上线，请咨询客服</span>
              <i v-if="product.tag === 'hot'" class="hot-icon"></i>
            </h3>
            <ul class="product-specification" v-if="showProps">
                <li>{{showDuration}}天</li>
                <li v-if="product.type === 1">{{showDevice}}</li>
                <li v-if="product.type === 1">{{showSchedule}}</li>
            </ul>
        <div class="product-option">
            <div class="price-info">
                <span class="current-price">抢鲜价：{{dealPrice}}元</span>
                <span class="origin-price">原价：{{originalPrice}}元</span>
            </div>
            <el-button @click.stop="changeCombo" v-if="product.type === REGULAR_PRODUCT_TYPE" size="mini" :disabled="notAllowCheck.disable">更换套餐</el-button>
        </div>
    </div>
</template>
<script>
import { DEVICE, SCHEDULE_TYPE, SEO_PRODUCT_TYPE, DEVICE_PC, DEVICE_WAP, REGULAR_PRODUCT_TYPE, CREATIVE_PRODUCT_TYPE } from 'constant/bw-plus'
import { f2y } from 'util'
import { DEVICE_ALL } from 'constant/fengming-report'
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
    deviceAvailableStatus: {
      type: Object,
      default: () => ({
        ifAllAvailable: true,
        ifMobileAvailable: true,
        ifPcAvailable: true
      }),
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
      const { product: { currentPrice: { device } }, deviceAvailableStatus: { ifMobileAvailable, ifPcAvailable } } = this
      if (ifMobileAvailable && !ifPcAvailable && (device === DEVICE_PC || device === DEVICE_ALL)) {
        return {
          disable: true,
          reason: '当前商品电脑端已售出'
        }
      }
      if (!ifMobileAvailable && ifPcAvailable && (device === DEVICE_WAP || device === DEVICE_ALL)) {
        return {
          disable: true,
          reason: '当前商品手机端已售出'
        }
      }
      if (!ifMobileAvailable && !ifPcAvailable) {
        return {
          disable: true,
          reason: '当前商品手机端、电脑端已售出'
        }
      }
      // 当前商品与所选商品存在互斥，或者当前商品未上线,或者当前商品是创意相关商品并且其价格<=0(即未选中百度标王产品，不允许单独购买)
      return {
        disable: this.currentExcludes.includes(this.product.id) || !!this.product.available || (this.product.type === CREATIVE_PRODUCT_TYPE && Object.values(this.product.currentPrice).length <= 0) || this.product.currentPrice.price <= 0,
        reason: ''
      }
    },
    showDevice () {
      const { product: { currentPrice: { device } } } = this
      return DEVICE[device]
    },
    showDuration () {
      const { product: { currentPrice: { duration } } } = this
      return duration || '?'
    },
    showSchedule () {
      const { product: { currentPrice: { scheduleType } } } = this
      return SCHEDULE_TYPE[scheduleType]
    },
    dealPrice () {
      const { product: { certainDealPrice, dealPriceRatio, withoutPackagePriceRatio, type, currentPrice: { price } }, currentPrice } = this
      const ratio = currentPrice && currentPrice.price && currentPrice.price > 0 ? dealPriceRatio : withoutPackagePriceRatio
      if (type === SEO_PRODUCT_TYPE) {
        return f2y(certainDealPrice)
      }
      return price > 0 ? f2y(price * ratio) : '?'
    },
    originalPrice () {
      const { product: { currentPrice: { price }, originalPriceRatio } } = this
      return price > 0 ? f2y(price * originalPriceRatio) : '?'
    }
  },
  methods: {
    checkProduct () {
      if (this.notAllowCheck.disable) {
        let message = this.notAllowCheck.reason || '请先勾选百度标王产品！'
        if (this.product.available === 1) {
          message = '当前商品未上线，请咨询客服'
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
      this.$emit('check', product)
    },
    changeCombo () {
      this.$emit('changeCombo', this.product)
    }
  }
}
</script>
<style lang="scss" scoped src="./index.scss"/>
