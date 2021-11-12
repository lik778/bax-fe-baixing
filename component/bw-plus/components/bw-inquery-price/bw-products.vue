<template>
  <div>
    <el-card class="box-card">
       <Title title="叠加媒体，低价加“量”"/>
       <div class="product-list">
        <ProductItem @changeCombo="changeCombo" @check="checkProduct" :currentExcludes="currentExcludes" v-for="product in productList" :key="product.id" :product="product"/>
       </div>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <InqueryResult :currentPrice="currentPrice" :deviceAvailableStatus="deviceAvailableStatus" @getValue="getCurrentPrice" :tableData="priceList" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Title from './title.vue'
import ProductItem from '../common/product-item/index.vue'
import InqueryResult from './inquery-result.vue'
export default {
  name: 'bw-products',
  components: {
    Title,
    ProductItem,
    InqueryResult
  },
  props: {
    productList: {
      type: Array,
      default: () => [],
      require: true
    },
    priceList: {
      type: Array,
      default: () => [],
      require: true
    },
    deviceAvailableStatus: {
      type: Object,
      default: () => {},
      require: true
    },
    currentPrice: {
      type: Object,
      default: () => {},
      require: true
    }
  },
  data () {
    return {
      currentExcludes: [],
      checkedProducts: [],
      dialogVisible: false
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
    },
    changeCombo (product) {
      this.dialogVisible = true
      console.log(product)
    },
    getCurrentPrice (value) {
      console.log(value)
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
