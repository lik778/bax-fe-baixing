<template>
    <div class="bw-creativity">
      <Title title="创意升级，效果加倍（请选择需要升级的形式）"/>
      <div class="bw-creativity_wrapper">
        <ProductItem v-for="product in productList" :key="product" :currentExcludes="[]" :product="product"/>
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
