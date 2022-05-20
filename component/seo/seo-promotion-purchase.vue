<template>
    <section class="seo-promotion-purchase">
        <el-card class="box-card query-card">
        <header>seo云推广</header>
        <main>
          <p class="seo-title">SEO云推广优选套餐</p>
          <ProductItem @chooseClick="chooseClick" />
          <p class="check-tip">提示：SEO云推广仅支持B2B行业购买，提单前请确认客户行业属性</p>
          <div class="submenu-btn" v-if="checkTip==0"><el-button type="primary" @click="commit">提交</el-button></div>
        </main>
         <CommitDialog
          :welfare="getWelfareInfo"
          :destroy-on-close="true"
          :allAreas="allAreas"
          :visible="isSubmit"
          :isPending="isPending"
          :preInfo="preInfo"
          @cancel="isSubmit=false"
          @submit="submit"
           />
        </el-card>
    </section>
</template>

<script>
import CommitDialog from './components/seo-promotion-purchase/commit-dialog.vue'
import ProductItem from './components/product-item'
import { seoCommit } from 'api/biaowang-plus'
import { SEO_BASIS, SEO_BASIS_PACKAGE } from 'constant/bw-plus'
import debounce from 'lodash.debounce'
export default {
  name: 'seo-promotion-purchase',
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      checkTip: null,
      priceId: null,
      form: {
        words: '',
        cities: [],
        industry: ''
      },
      isSubmit: false,
      isPending: false,
      submitBtn: true,
      SEO_BASIS,
      skuId: null,
      SEO_BASIS_PACKAGE,
      preInfo: {
        keywords: [],
        cities: [],
        additionProductMap: [{
          skuId: '',
          name: '',
          originPrice: '',
          dealPrice: '',
          duration: ''
        }]
      },
      skipAudit: true
    }
  },
  methods: {
    commit () {
      this.isSubmit = true
      this.preInfo.additionProductMap = SEO_BASIS_PACKAGE
    },
    submit: debounce(async function () {
      try {
        const targetUserId = +this.$route.query.user_id
        const salesId = +this.$route.query.sales_id
        const { data, code } = await seoCommit({
          targetUserId,
          salesId,
          skuId: this.skuId,
          priceId: this.priceId
        })
        if (code === 0) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.isPending = false
          this.isSubmit = false
        }
        if (code === 4080) {
          this.BwPlusDialogMsg = {
            dialogVisible: true,
            type: 'error',
            content: data,
            title: '提交失败'
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isPending = false
        this.isSubmit = false
      }
    }, 300),
    chooseClick (val) {
      this.checkTip = val
      if (this.checkTip === 0) {
        this.skuId = SEO_BASIS
      }
    },
    getWelfareInfo () {
      const { productList, currentPrice, totalPrice } = this
      const checkedProducts = productList.filter((p) => p.checked)
      const durationArray = [
        ...checkedProducts.map((info) => info.currentPrice.duration),
        currentPrice.duration || 0
      ]
      return {
        ...currentPrice,
        duration: Math.max(...durationArray),
        price: currentPrice.price && currentPrice.price > 0 ? currentPrice.price + totalPrice : totalPrice
      }
    }
  },
  components: {
    ProductItem, CommitDialog
  }
}
</script>

<style lang='scss' scoped>
.seo-promotion-purchase{
    min-height: 100%;
}
.text-color{
  color: #67C23A;
}
.check-tip{
  color: #ff6750;
  font-size: 12px;
  padding: 10px 0;
}
.seo-title{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
}
.box-card{
  margin-bottom: 15px;
  /deep/ .el-card__body{
    padding: 0;
  }
  header {
    border-bottom: 1px solid #e6e6e6;
    padding: 14px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
  }
  main{
    margin: 10px;
    padding: 20px 0 9px 45px;
  }
  .senior-title{
    margin: 20px 5px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
  }
}
.tip{
  margin-left: 20px;
}
.el-icon-plus{
  cursor: pointer;
}
.senior-card{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  letter-spacing: 0;
  padding: 20px 40px;
  .text{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999999;
    margin-left: 5px;
  }
}
.table-box{
  .submenu-btn{
    text-align: start;
  }
}
.found-btn{
  width: 107px;
  margin-bottom: 18px;
}
.package-box{
  width: 800px;
  padding: 20px 0;
}
.submenu-btn{
  text-align: right;
  margin: 35px 100px 0 0;
    .el-button{
      width: 107px;
    }
  }
</style>
<style lang="scss">
.el-table--border:after,.el-table--group:after,.el-table:before {
  background-color: #FFDECF;
}

.el-table--border,.el-table--group {
  border-color: #FFDECF;
}
.el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell {
     border-bottom: 1px solid #FFDECF;
     border-right: 1px solid #FFDECF;
}
</style>
