<template>
  <div>
    <el-card class="box-card result-card">
      <Title
        title="更多媒体，低价加量"
        extra="请选择需要的媒体及其平台*时段*时长"
      />
      <div class="product-list">
        <ProductItem
          :currentPrice="currentPrice"
          :disableDeviceListBySku="disableDeviceListBySku"
          v-for="product in productList"
          :key="product.id"
          @changeCombo="changeCombo"
          @check="checkProduct"
          :currentExcludes="currentExcludes"
          :product="product"
          :skipAudit="skipAudit"
        />
      </div>
    </el-card>
    <el-dialog
      :title="currentProduct.title"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <InqueryResult
        :limit="currentProduct.limit"
        :currentPrice="currentProduct.currentPrice"
        :dealPriceRatio="getRatio"
        :disableDeviceListBySku="disableDeviceListBySku"
        @getValue="getCheckedPrice"
        :tableData="tansformPriceList"
        :skipAudit="skipAudit"
      />
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
import { bwPlusTrack } from '../../utils/track'
export default {
  name: 'bw-addition-products',
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
    skipAudit: {
      type: Boolean,
      default: false,
      require: false
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
    disableDeviceListBySku: {
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
        if (v.filter((o) => o.checked).length <= 0) {
          this.currentExcludes = []
          this.checkedProducts = []
        }
      }
    }
  },
  computed: {
    getRatio () {
      const { currentProduct, currentPrice } = this
      if (currentPrice && currentPrice.price > 0) {
        return currentProduct.dealPriceRatio
      }
      // 当代码运行到了这儿就代表用户未勾选百度标王产品
      return currentProduct.withoutPackagePriceRatio
    },
    tansformPriceList () {
      const { priceList, currentProduct } = this
      // 得到时长在可选范围内的价格列表
      return priceList && currentProduct.limit
        ? priceList.filter((p) => currentProduct.limit.type.includes(p.type))
        : priceList
    }
  },
  data () {
    return {
      currentExcludes: [], // 互斥商品id集合
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
        this.checkedProducts = checkedProducts.filter(
          (o) => o.id !== product.id
        )
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
    },
    changeCombo (product) {
      this.dialogVisible = true
      this.currentProduct = clone(product)
    },
    getCheckedPrice (value) {
      const { currentProduct } = this
      this.checkedPrice = value
      bwPlusTrack('bwplus: click product parameters', {
        productName: currentProduct.title,
        ...value
      })
    },
    confirmCheckedPrice () {
      const { id: skuId } = this.currentProduct
      this.$emit('getExtraProductValue', { ...this.checkedPrice, skuId })
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
}
.box-card {
  margin: 10px;
}
.result-card{
    padding-bottom: 60px;
}
</style>
