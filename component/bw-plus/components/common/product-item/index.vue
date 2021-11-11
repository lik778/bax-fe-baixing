<template>
    <div :class="{'product-wrapper': true, 'product-checked': isActive, 'product-notAllowCheck': notAllowCheck}" @click="checkProduct">
        <h3 class="product-title">
            <span>{{product.title}}</span>
            <i class="hot-icon"></i>
        </h3>
        <ul class="product-specification">
            <li>360天</li>
            <li>双端</li>
            <li>7天*24小时</li>
        </ul>
        <div class="product-option">
            <div>
                <span class="current-price">抢鲜价:8000元</span>
                <span class="origin-price">原价:8000元</span>
            </div>
            <el-button size="mini" :disabled="notAllowCheck">更换套餐</el-button>
        </div>
    </div>
</template>
<script>
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
    isActive () {
      return this.active === this.product.id
    },
    notAllowCheck () {
      return this.currentExcludes.includes(this.product.id)
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
    }
  }
}
</script>
<style lang="scss" scoped src="./index.scss"/>
