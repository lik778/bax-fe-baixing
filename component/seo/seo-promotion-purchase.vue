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
          :skipAudit="checkResult.skipManualAudit"
          :industry="checkResult.industry"
          @cancel="isSubmit=false"
          @submit="submit"
           />
        </el-card>
        <el-card class="box-card query-card senior-card" v-if="seniorShow">
          <p class="senior-title">高级版-标王推广关键词<span class="text">（注：关键词只投放电脑端、5 * 8 小时、普通行业两个月/特殊行业一个月）</span></p>
          <div class="package-box">
            <el-row>
              <el-col :span="15">
            <el-form ref="form"  label-width="100px" :model="form" :rules="rules">
              <el-form-item label="推广关键词" prop="words">
                <el-input type="textarea" @change="checkKeyword" v-model="form.words" rows="6" placeholder="请输入关键词，多个关键词换行
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
                <el-button type="primary" class="found-btn" @click="submitForm('form')" :loading="loading">查询</el-button>
              </el-form-item>
            </el-form>
            </el-col>
            <el-col :span="8" class="tip">
              <InvalidIndustry/>
            </el-col>
            </el-row>
             <AreaSelector
              type="bw" :all-areas="allAreas"
              :areas="form.cities"
              :visible="areaDialogVisible"
              @ok="onAreasChange"
              @cancel="areaDialogVisible = false"
              />
              <div v-if="resultVisible" class="table-box">
                  <p class="check-tip">提示：关键词总热度不超过100。当前选择关键词总热度为：{{hotCount}}，{{hotCount>100?'不可推广。请根据下面的查询情况进行关键词调整吧~':'可推广。下面查询结果都为可推广后，即可提交哦~'}}</p>
                  <el-table :data="resultList" border style="width: 100%" :header-cell-style="{background: '#FFF6F2',color: '#C67C49'}"  v-loading="loading">
                    <el-table-column label="关键词">
                     <template scope="{row}">
                          <div v-html="row.word">{{row.word}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="电脑端热度">
                     <template scope="{row}">
                          <div v-html="row.pcPv">{{row.pcPv}}</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="查询结果">
                      <template scope="{row}">
                          <div class="text-color" v-html="row.result">{{row.result}}</div>
                      </template>
                    </el-table-column>
                  </el-table>
                <div class="submenu-btn"><el-button type="primary" @click="commit">提交</el-button></div>
              </div>
          </div>
        </el-card>
    </section>
</template>

<script>
import InvalidIndustry from './components/seo-promotion-purchase/invalid-industry.vue'
import CommitDialog from './components/seo-promotion-purchase/commit-dialog.vue'
import ProductItem from './components/product-item'
import AreaSelector from 'com/common/biaowang-area-selector'
import { checkKeyword, getTrialSystem, seoCommit } from 'api/biaowang-plus'
import { getCnName } from 'util'
import { SEO_BASIS, SEO_SENIOR, SEO_BASIS_PACKAGE, seoSeniorPackage } from 'constant/bw-plus'
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
      priceId: null,
      rules: {
        words: [{ validator: this.checkWord, trigger: 'blur' }],
        cities: [{ required: true, message: '请选择推广地域', trigger: 'change' }]
      },
      checkResult: {
        passed: true,
        rejectedWordWithReason: {},
        industry: ''
      },
      form: {
        words: '',
        cities: [],
        industry: ''
      },
      areaDialogVisible: false,
      resultVisible: false,
      isSubmit: false,
      isPending: false,
      queryResult: {},
      queryBtnDisable: true,
      submitBtn: true,
      resultList: [],
      SEO_BASIS,
      SEO_SENIOR,
      skuId: null,
      loading: false,
      SEO_BASIS_PACKAGE,
      seoSeniorPackage,
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
      skipAudit: true,
      pvList: []
    }
  },
  methods: {
    async checkKeyword () {
      // this.$emit('resetResult')
      this.resultList = []
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
          const { data: { passed, rejectedWordWithReason, industry, skipManualAudit } } = await checkKeyword({ keywords: words.split(/[\s\n]/).filter(Boolean) })
          this.checkResult = {
            passed,
            rejectedWordWithReason,
            industry,
            skipManualAudit
          }
          if (!passed) {
            this.form.industry = ''
            this.$message({
              message: rejectedWordWithReason,
              type: 'error'
            })
            this.resultVisible = false
            return false
          }
          this.form.industry = industry || ''
          this.$message({
            message: '风控审查通过啦！快去查价吧！',
            type: 'success'
          })
          this.queryBtnDisable = false
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
      if (array.length > 20) {
        errorMsg = {
          validate: false,
          error: '关键词个数最多20个'
        }
        return errorMsg
      }
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
      if (!result.validate) {
        callback(new Error(result.error))
      }
      if (!this.checkResult.passed) {
        callback(new Error('关键词风控审查不通过'))
      }
      callback()
    },
    commit () {
      if (this.checkTip === 0 || !this.submitBtn) {
        this.isSubmit = true
        this.preInfoList()
      } else if (this.submitBtn && this.hotCount > 100) {
        this.$message({
          message: '热度过高，不可提交',
          type: 'error'
        })
      } else if (this.submitBtn === true) {
        this.$message({
          message: '请先查询',
          type: 'error'
        })
      } else {
        this.$message({
          message: '查询结果不通过，不可提交',
          type: 'error'
        })
      }
    },
    preInfoList () {
      if (this.checkTip === 0) {
        this.preInfo.additionProductMap = SEO_BASIS_PACKAGE
      } else if (this.checkTip === 1) {
        this.preInfo.additionProductMap = seoSeniorPackage
        this.preInfo.keywords = this.form.words.split(/[\s\n]/).filter(Boolean)
        this.preInfo.cities = this.form.cities
      }
    },
    async getTrialSystem () {
      const words = this.form.words.split(/[\s\n]/).filter(Boolean)
      const { data, data: { disable, keywordPvList, priceId } } = await getTrialSystem({
        words,
        cities: this.form.cities,
        industry: this.form.industry
      })
      this.priceId = priceId
      this.pvList = []
      this.submitBtn = true
      keywordPvList.forEach(item => {
        item.result = '可推广'
        this.pvList.push(item.pcPv)
      })
      this.resultList = keywordPvList
      if (data.overHeatWords) {
        this.findIndexWord(data.overHeatWords, '<span style="color: #FF6350">热度太高，不可推广</span>')
      }
      if (data.errorWords) {
        this.findIndexWord(data.errorWords, '<span style="color: #FF6350">查不到价，不可推广</span>')
      }
      if (data.soldWords) {
        this.findIndexWord(data.soldWords, '<span style="color: #FF6350">已被购买，不可推广</span>')
      }
      this.submitBtn = disable
    },
    submitForm: debounce(async function (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid && !this.queryBtnDisable) {
          this.loading = true
          await this.getTrialSystem()
          this.resultVisible = true
          this.loading = false
        } else if (this.queryBtnDisable) {
          this.$message({
            message: '关键词风控审查不通过',
            type: 'error'
          })
        } else {
          console.log(valid)
        }
      })
    }, 1000),
    onAreasChange (areas) {
      this.form.cities = [...areas]
      this.areaDialogVisible = false
    },
    findIndexWord (arr, text) {
      arr.forEach(o => {
        const index = this.resultList.indexOf(this.resultList.filter(d => d.word === o)[0])
        if (index !== -1) {
          this.resultList[index].result = text
          this.resultList[index].word = `<span style="color: #999999">${this.resultList[index].word}</span>`
          this.resultList[index].pcPv = `<span style="color: #999999">${this.resultList[index].pcPv}</span>`
        }
      })
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
          const applyId = data.applyId
          this.skipAudit = data.skipAudit
          this.$router.push({
            name: 'seo-word-records',
            query: { applyId, skipAudit: this.skipAudit }
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
        this.seniorShow = false
      } else {
        this.skuId = SEO_SENIOR
        this.seniorShow = true
      }
    },
    citiesShow () {
      this.areaDialogVisible = true
      this.resultList = []
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
    }
  },
  computed: {
    hotCount () {
      const sum = this.pvList.reduce((prev, p) => {
        prev = prev + p
        return prev
      }, 0)
      return sum
    },
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
    ProductItem, AreaSelector, CommitDialog, InvalidIndustry
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
