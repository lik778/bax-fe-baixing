<template>
    <section class="seo-promotion-purchase">
        <el-card class="box-card query-card">
        <header>seo云推广</header>
        <main>
          <p class="seo-title">SEO云推广优选套餐</p>
          <ProductItem @chooseClick="chooseClick"></ProductItem>
          <div class="submenu-btn" v-if="checkTip==0"><el-button type="primary" @click="open">提交</el-button></div>
        </main>
         <CommitDialog
                :welfare="getWelfareInfo"
                :destroy-on-close="true"
                :allAreas="allAreas"
                :visible="isSubmit"
                :isPending="isPending"
                @cancel="isSubmit=false"
                @submit="submit"
                 />
        </el-card>
        <el-card class="box-card query-card senior-card" v-if="seniorShow">
          <p class="senior-title">高级版-标王推广关键词<span class="text">（注：20个5热度关键词只投放电脑端、5 * 8 小时、普通行业两个月/特殊行业一个月）</span></p>
          <div class="package-box">
            <el-form ref="form"  label-width="80px" :model="form" :rules="rules">
              <el-form-item label="活动名称" prop="words">
                <el-input type="textarea" v-model="form.words" rows="6" placeholder="请输入关键词，多个关键词换行
示例：
粮食烘干机
粮食烘干塔
…
查价前请先对比右侧是否属于禁售行业"></el-input>
              </el-form-item>
              <el-form-item label="推广区域" prop="cities">
                {{transformArea}}
                  <i class="el-icon-plus" @click="citiesShow"></i>
              </el-form-item>
              <el-form-item label-width="0">
                <el-button type="primary" class="found-btn" @click="submitForm('form')" >查询</el-button>
              </el-form-item>
            </el-form>
             <AreaSelector
              type="bw" :all-areas="allAreas"
              :areas="form.cities"
              :visible="areaDialogVisible"
              @ok="onAreasChange"
              @cancel="areaDialogVisible = false"
              />
              <div v-if="resultVisible">
                  <el-table :data="tableData" border style="width: 100%" :header-cell-style="{background: '#FFF6F2',color: '#C67C49'}">
                    <el-table-column prop="word" label="关键词" />
                    <el-table-column prop="hot" label="电脑端热度" />
                    <el-table-column prop="result" label="查询结果" />
                  </el-table>
                <div class="submenu-btn"><el-button type="primary" @click="open">提交</el-button></div>
                <!-- :preInfo="preInfo" -->
              </div>
          </div>
        </el-card>
    </section>
</template>

<script>
import CommitDialog from './components/seo-promotion-purchase/commit-dialog.vue'
import ProductItem from './components/product-item'
import AreaSelector from 'com/common/biaowang-area-selector'
import { checkKeyword } from 'api/biaowang-plus'
// , querySystemResult, commit
import { getCnName } from 'util'
import { OTHER_CITY_ENUM } from 'com/common/bw/core-cities-dialog'
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
      seniorShow: false,
      checkTip: null,
      tableData: [
        {
          word: '',
          hot: 5,
          staus: '检测中',
          result: '通过'
        }
      ],
      rules: {
        words: [{ validator: this.checkWord, trigger: 'blur' }],
        cities: [{ required: true, message: '请选择推广地域', trigger: 'change' }]
      },
      checkResult: {
        passed: true,
        rejectedWordWithReason: {}
      },
      form: {
        words: '',
        cities: []
      },
      areaDialogVisible: false,
      resultVisible: false,
      isSubmit: false,
      isPending: false,
      queryResult: {}
    }
  },
  methods: {
    async checkKeyword () {
      const { form } = this
      const { words } = form
      if (!this.keywordLengthCheck().validate) {
        return
      }
      {
        const loading = this.$loading({
          lock: true,
          text: '正在风控审查中， 请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        try {
          const { data: { passed, rejectedWordWithReason, skipManualAudit } } = await checkKeyword({ keywords: words.split(/[\s\n]/).filter(Boolean) })
          this.checkResult = {
            passed,
            rejectedWordWithReason,
            skipManualAudit
          }
          if (!passed) {
            this.$message({
              message: rejectedWordWithReason,
              type: 'error'
            })
            return false
          }
          this.resultVisible = true
          // this.$message({
          //   message: '风控审查通过啦！快去查价吧！',
          //   type: 'success'
          // })
        } catch (error) {
          this.checkResult.passed = false
          return false
        } finally {
          loading.close()
        }
      }
    },
    keywordLengthCheck () {
      const { words = '' } = this.form
      let errorMsg = {
        validate: true,
        error: ''
      }
      const array = words.split(/[\s\n]/).filter(Boolean)
      const patrn = /[`~!@#$%^&*()_+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——+={}|《》？：“”【】、；‘'，。、]/im
      if (array.length <= 0) {
        errorMsg = {
          validate: false,
          error: '请输入关键词'
        }
        return errorMsg
      }
      if (patrn.test(array.join(''))) { // 如果包含特殊字符返回false
        errorMsg = {
          validate: false,
          error: '关键词只支持数字，字母和中文'
        }
        return errorMsg
      }
      // if (array.length < 20 || array.length > 20) {
      //   errorMsg = {
      //     validate: false,
      //     error: `关键词个数只能输入20个，当前关键词${array.length}个`
      //   }
      //   return errorMsg
      // }
      if (array.some(item => item.length < 2 || item.length > 15)) {
        errorMsg = {
          validate: false,
          error: '单个关键词字数在2-15之间'
        }
        return errorMsg
      }
      return errorMsg
    },
    checkWord (rule, value, callback) {
      const result = this.keywordLengthCheck()
      if (!value) {
        callback(new Error('请输入关键词'))
      }
      if (!this.checkResult.passed) {
        callback(new Error('关键词风控审查不通过'))
      }
      if (!result.validate) {
        callback(new Error(result.error))
      }
      callback()
    },
    submitForm: debounce(async function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkKeyword()
        } else {
          console.log(valid)
        }
      })
    }, 1000),
    onAreasChange (areas) {
      this.form.cities = [...areas]
      this.areaDialogVisible = false
    },
    open () {
      console.log(1111)
      this.isSubmit = true
      console.log(this.isSubmit)
    },
    chooseClick (val) {
      this.checkTip = val
      if (this.checkTip === 0) {
        this.seniorShow = false
      } else {
        this.seniorShow = true
      }
    },
    citiesShow () {
      this.areaDialogVisible = true
    },
    formatArea (name) {
      return name === OTHER_CITY_ENUM
        ? '其它'
        : getCnName(name, this.allAreas)
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
    },
    submit: debounce(async function () {
      // this.isPending = true
      // const {
      //   error,
      //   overHeat,
      //   priceId,
      //   tempPvId,
      //   industryError,
      //   industryAuditResult
      // } = this.queryResult
      // const { userId: targetUserId } = this.salesInfo
      // const {
      //   queryInfo,
      //   applyTypeFilter,
      //   currentPrice,
      //   checkedAdditionProduct: additionProduct
      // } = this
      // const baseParams = {
      //   targetUserId,
      //   applyType:
      //     currentPrice.price === 0
      //       ? 2
      //       : applyTypeFilter(error, overHeat, industryError)
      // }
      // let params = {}
      // if (!error && !overHeat && !industryError) {
      //   // error、overHeat、industryError都为false时为系统报价，参数如下
      //   params = {
      //     ...baseParams,
      //     applyBasicAttr: { priceId, ...currentPrice },
      //     additionProduct
      //   }
      // } else {
      //   // error、overHeat、industryError不都为false时为人工报价，参数如下
      //   params = {
      //     ...baseParams,
      //     applyKeywordsAttr: {
      //       ...queryInfo,
      //       tempPvId
      //     }
      //   }
      // }
      // try {
      //   const { code, data } = await commit(params)
      //   if (code === 0) {
      //     this.resetResult()
      //     const applyId = data.applyId
      //     const skipAudit = industryAuditResult.skipManualAudit
      //     this.$router.push({
      //       name: 'bw-plus-price-records',
      //       query: { applyId, skipAudit }
      //     })
      //   }
      //   if (code === 4080) {
      //     this.BwPlusDialogMsg = {
      //       dialogVisible: true,
      //       type: 'error',
      //       content: data,
      //       title: '提交失败'
      //     }
      //   }
      // } catch (error) {
      //   console.log(error)
      // } finally {
      //   this.isPending = false
      //   this.isSubmit = false
      // }
    }, 300)
  },
  computed: {
    transformArea () {
      const { cities } = this.form
      const maxLength = 3
      if (cities.length >= 362) {
        return '全国'
      } else if (cities.length > 0) {
        if (cities.length <= maxLength) {
          return `${cities.map(o => this.formatArea(o))}`
        } else {
          return `${cities.map(o => this.formatArea(o)).slice(0, maxLength)}等${cities.length}个城市`
        }
      } else {
        return ''
      }
    }
  },
  components: {
    ProductItem, AreaSelector, CommitDialog
  }
}
</script>

<style lang='scss' scoped>
.seo-promotion-purchase{
    min-height: 100%;
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
  margin-top: 35px;
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
