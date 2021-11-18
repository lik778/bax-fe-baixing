<template>
  <div>
    <div :class="{'product-wrapper': true, 'product-checked': product.checked, 'product-notAllowCheck': notAllowCheck}" @click="checkProduct">
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
          <div slot="reference" >
            <h3 class="product-title">
              <span>{{product.title}}</span>
              <span class="available-tips" v-if="!!product.available">待上线，请咨询客服</span>
              <i v-if="product.tag === 'hot'" class="hot-icon"></i>
            </h3>
            <ul class="product-specification" v-if="showProps">
                <li>{{showDuration}}天</li>
                <li v-if="product.type === 1">{{showDevice}}</li>
                <li v-if="product.type === 1">{{showSchedule}}</li>
            </ul>
          </div>
       </el-popover>
        <div class="product-option">
            <div class="price-info">
                <span class="current-price">抢鲜价:{{dealPrice}}元</span>
                <span class="origin-price">原价:{{originalPrice}}元</span>
            </div>
            <el-button @click.stop="changeCombo" v-if="product.type === 1" size="mini" :disabled="notAllowCheck">更换套餐</el-button>
        </div>
    </div>
  </div>
</template>
<script>
import { DEVICE, SCHEDULE_TYPE, SEO_PRODUCT_TYPE } from 'constant/bw-plus'
import { f2y } from 'util'
export default {
  name: 'product-item',
  props: {
    product: {
      type: Object,
      default: () => {},
      require: true
    },
    currentExcludes: {
      type: Array,
      default: () => [],
      require: true
    }
  },
  computed: {
    showProps () {
      const { limit } = this.product
      return limit && Object.keys(limit).length
    },
    notAllowCheck () {
      return this.currentExcludes.includes(this.product.id) || !!this.product.available || (this.product.type === 0 && (Object.values(this.product.currentPrice).length <= 0 || this.product.currentPrice.price <= 0))
    },
    showDevice () {
      const { product: { currentPrice: { device } } } = this
      return DEVICE[device]
    },
    showDuration () {
      const { product: { currentPrice: { duration } } } = this
      return duration
    },
    showSchedule () {
      const { product: { currentPrice: { scheduleType } } } = this
      return SCHEDULE_TYPE[scheduleType]
    },
    dealPrice () {
      const { product: { certainDealPrice, dealPriceRatio, type, currentPrice: { price } } } = this
      if (type === SEO_PRODUCT_TYPE) {
        return f2y(certainDealPrice)
      }
      return price > 0 ? f2y(price * dealPriceRatio) : '-'
    },
    originalPrice () {
      const { product: { currentPrice: { price }, originalPriceRatio } } = this
      return price > 0 ? f2y(price * originalPriceRatio) : '-'
    }
  },
  methods: {
    checkProduct () {
      if (this.notAllowCheck) {
        let message = '请先勾选百度标王产品！'
        if (this.product.available === 1) {
          message = '当前商品未上线，请咨询客服'
        } else if (this.product.type === 1) {
          message = '您的所选商品中存在与当前商品相同的服务'
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
