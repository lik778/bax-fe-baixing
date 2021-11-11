<template>
    <el-card class="box-card">
       <Title title="叠加媒体，低价加“量”"/>
       <div class="product-list">
        <ProductItem @check="checkProduct" :currentExcludes="currentExcludes" v-for="product in productList.filter(o => o.type !== 0)" :key="product.id" :product="product"/>
       </div>
    </el-card>
</template>
<script>
import Title from './title.vue'
import ProductItem from '../common/product-item/index.vue'
export default {
  name: 'bw-products',
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
      currentExcludes: [],
      checkedProducts: []
    }
  },
  methods: {
    checkProduct ({ isActive, product }) {
      const { checkedProducts } = this
      if (isActive) {
        this.checkedProducts = checkedProducts.filter(o => o.id !== product.id)
      } else {
        this.checkedProducts = [...checkedProducts, ...[product]]
      }
      console.log('checkedProducts', this.checkedProducts)
      let currentExcludes = []
      this.checkedProducts.forEach(o => {
        currentExcludes = [...currentExcludes, ...o.excludes]
      })
      this.currentExcludes = currentExcludes
      console.log('currentExcludes', this.currentExcludes)
    }
  }
}
</script>
<style lang="scss" scoped>
  .product-list{
    display: flex;
    flex-wrap: wrap;
  }
</style>
