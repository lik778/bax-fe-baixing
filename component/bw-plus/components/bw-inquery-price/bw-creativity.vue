<template>
    <div class="bw-creativity">
      <Title subTitle="创意升级，效果加倍" subExtra="（请选择需要升级的形式）"/>
      <div class="bw-creativity_wrapper">
        <ProductItem @check="checkProduct" v-for="product in productList" :key="product.id" :currentExcludes="[]" :product="product"/>
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
    }
  },
  data () {
    return {
      checkedProducts: []
    }
  },
  methods: {
    checkProduct (product) {
      const { checkedProducts } = this
      if (product.checked) {
        this.checkedProducts = checkedProducts.filter(o => o.id !== product.id)
      } else {
        this.checkedProducts = [...checkedProducts, ...[product]]
      }
      product.checked = !product.checked
      this.$emit('checked', product)
    }
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
