<template>
  <div>
    <el-card class="box-card">
      <Title title="叠加媒体，低价加“量”"/>
      <div class="product-list">
        <ProductItem :currentPrice="currentPrice" :deviceAvailableStatus="deviceAvailableStatus" v-for="product in productList" :key="product.id" @changeCombo="changeCombo" @check="checkProduct" :currentExcludes="currentExcludes" :product="product"/>
      </div>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <InqueryResult :limit="currentProduct.limit" :currentPrice="currentProduct.currentPrice" :dealPriceRatio="currentProduct.dealPriceRatio" :deviceAvailableStatus="deviceAvailableStatus" @getValue="getCheckedPrice" :tableData="priceList" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCheckedPrice">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Title from './title.vue'
import ProductItem from '../common/product-item/index.vue'
import InqueryResult from './inquery-result.vue'
import clone from 'clone'
export default {
  name: 'bw-products',
  components: {
    Title,
    ProductItem,
    InqueryResult
  },
  props: {
    currentPrice: {
      type: Object,
      default: () => {},
      require: true
    },
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
    }
  },
  watch: {
    productList: {
      deep: true,
      immediate: true,
      handler (v) {
        if (v.filter(o => o.checked).length <= 0) {
          this.currentExcludes = []
          this.checkedProducts = []
        }
      }
    }
  },
  data () {
    return {
      currentExcludes: [],
      checkedProducts: [],
      dialogVisible: false,
      currentProduct: {},
      checkedPrice: this.currentPrice
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
      this.currentExcludes = this.checkedProducts.reduce((a, b) => [...a, ...b.excludes], [])
    },
    changeCombo (product) {
      this.dialogVisible = true
      this.currentProduct = clone(product)
    },
    getCheckedPrice (value) {
      this.checkedPrice = value
    },
    confirmCheckedPrice () {
      const { id: productId } = this.currentProduct
      this.$emit('getExtraProductValue', { ...this.checkedPrice, productId })
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .product-list{
    display: flex;
    flex-wrap: wrap;
  }
  .box-card{
    margin: 10px;
  }
</style>
