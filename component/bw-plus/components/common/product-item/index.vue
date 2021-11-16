<template>
  <div>
    <div :class="{'product-wrapper': true, 'product-checked': isActive, 'product-notAllowCheck': notAllowCheck}" @click="checkProduct">
        <h3 class="product-title">
            <span>{{product.title}}</span>
            <i class="hot-icon"></i>
        </h3>
        <ul class="product-specification" v-if="showProps">
            <li>{{showDuration}}天</li>
            <li>{{showDevice}}</li>
            <li>{{showSchedule}}</li>
        </ul>
        <div class="product-option">
            <div>
                <span class="current-price">抢鲜价:{{dealPrice}}元</span>
                <span class="origin-price">原价:{{originalPrice}}元</span>
            </div>
            <el-button @click.stop="changeCombo" v-if="product.limit" size="mini" :disabled="notAllowCheck">更换套餐</el-button>
        </div>
    </div>
  </div>
</template>
<script>
import { DEVICE, SCHEDULE_TYPE } from 'constant/bw-plus'
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
  data () {
    return {
      active: 0
    }
  },
  computed: {
    showProps () {
      const { limit } = this.product
      return limit && Object.keys(limit).length
    },
    isActive () {
      return this.active === this.product.id
    },
    notAllowCheck () {
      return this.currentExcludes.includes(this.product.id)
    },
    showDevice () {
      const { product: { currentPrice: { device } } } = this
      return DEVICE[device]
    },
    showDuration () {
      const { product: { certainType, currentPrice: { duration } } } = this
      if (!this.showProps) {
        return certainType
      }
      return duration
    },
    showSchedule () {
      const { product: { currentPrice: { scheduleType } } } = this
      return SCHEDULE_TYPE[scheduleType]
    },
    dealPrice () {
      const { product: { certainDealPrice, dealPriceRatio, type, currentPrice: { price } } } = this
      if (type === 2) {
        return certainDealPrice
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
        return
      }
      const { product, product: { id }, isActive } = this
      this.$emit('check', { isActive, product })
      this.active = isActive ? 0 : id
    },
    changeCombo () {
      this.$emit('changeCombo', this.product)
    }
  }
}
</script>
<style lang="scss" scoped src="./index.scss"/>
