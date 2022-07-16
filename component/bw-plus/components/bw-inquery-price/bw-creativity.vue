<template>
    <div class="bw-creativity">
      <Title subTitle="创意升级，效果加倍" subExtra="请选择需要升级的创意形式"/>
      <div class="bw-creativity_wrapper">
        <ProductItem
         :isRenew="isRenew"
         :skipAudit="skipAudit"
          @check="checkProduct"
          v-for="product in productList"
          :key="product.id"
          :currentExcludes="[...currentExcludes, ...disableSkuList]"
          :flag="flag"
          :product="transformProduct(product)"/>
      </div>
    </div>
</template>
<script>
import Title from './title.vue'
import ProductItem from '../common/product-item/index.vue'
export default {
  name: 'bw-creativity',
  components: {
    Title,
    ProductItem
  },
  props: {
    productList: {
      type: Array,
      default: () => [],
      require: true
    },
    skipAudit: {
      type: Boolean,
      default: false,
      require: false
    },
    currentPrice: {
      type: Object,
      default: () => {},
      require: false
    },
    isRenew: {
      type: Boolean,
      default: false,
      require: false
    },
    additionRenewDetailList: {
      type: Array,
      default: () => [],
      require: false
    },
    disableSkuList: {
      type: Array,
      default: () => [],
      require: false
    },
    flag: {
      type: Boolean,
      default: () => false,
      require: false
    }
  },
  data () {
    return {
      checkedProducts: [],
      currentExcludes: []
    }
  },
  watch: {
    currentPrice: {
      deep: true,
      handler (v) {
        if (v.days) {
          // 计算所选商品的互斥商品集合
          this.currentExcludes = this.checkedProducts.reduce(
            (a, b) => [...a, ...b.excludes],
            []
          )
        } else {
          this.checkedProducts = this.checkedProducts.filter(p => p.additionRenewDetai.extraOriginPrice > 0)
          this.currentExcludes = []
        }
      }
    },
    productList: {
      deep: true,
      handler (v1) {
        this.productListData = v1
      },
      immediate: true
    }
  },
  methods: {
    transformProduct (product) {
      if (this.isRenew) {
        const { additionRenewDetailList, currentPrice } = this
        return {
          ...product,
          additionRenewDetai: additionRenewDetailList.find(a => a.skuId === product.id),
          currentPrice
        }
      }
      return product
    },
    checkProduct (product) {
      const { checkedProducts } = this
      if (product.checked) {
        this.checkedProducts = checkedProducts.filter(o => o.id !== product.id)
      } else {
        this.checkedProducts = [...checkedProducts, ...[product]]
      }
      product.checked = !product.checked
      this.$emit('checked', product)
      // 计算所选商品的互斥商品集合
      this.currentExcludes = this.checkedProducts.reduce(
        (a, b) => [...a, ...b.excludes],
        []
      )
    }
  },
  updated (pre) {
  }
}
</script>
<style lang="scss" scoped>
    .bw-creativity{
        &_wrapper{
            display: flex;
        }
    }
</style>
