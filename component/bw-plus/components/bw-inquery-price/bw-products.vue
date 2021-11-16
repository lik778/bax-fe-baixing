<template>
  <div>
    <el-card class="box-card">
      <Title title="叠加媒体，低价加“量”"/>
      <div class="product-list">
        <el-popover
          v-for="product in productList"
          :key="product.id"
          placement="top-start"
          :title="product.title"
          trigger="hover"
          width="318"
        >
          <div class="product-detail">
            <div class="image-wrapper">
              <img :src="product.image"/>
            </div>
            <p>{{product.description}}</p>
          </div>
          <ProductItem slot="reference" @changeCombo="changeCombo" @check="checkProduct" :currentExcludes="currentExcludes" :key="product.id" :product="product"/>
        </el-popover>
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
      this.currentProduct = product
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
  .image-wrapper{
    width: 288px;
    padding-top: 78%;
    position: relative;
    img{
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
</style>
