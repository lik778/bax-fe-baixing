<template>
    <el-card class="box-card">
       <Title title="叠加媒体，低价加“量”"/>
       <ProductItem :product="product"/>
    </el-card>
</template>
<script>
import Title from './title.vue'
import ProductItem from '../common/product-item.vue'
export default {
  name: 'bw-products',
  components: {
    Title,
    ProductItem
  },
  data () {
    return {
      product: {
        name: 'hahah'
      }
    }
  }
}
</script>
