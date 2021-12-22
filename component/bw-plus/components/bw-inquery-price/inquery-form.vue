<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="推广关键词" prop="words">
                <el-col :span="8">
                    <el-input @change="checkKeyword" type="textarea" v-model="form.words" rows="6" placeholder="请输入关键词，多个关键词换行
示例：
粮食烘干机
粮食烘干塔
…
查价前请先对比右侧是否属于禁售行业"></el-input>
                </el-col>
                <el-col class="more-tips" :span="8">
                    <InvalidIndustry/>
                    <ul v-if="!checkResult.passed" class="reject-result">
                        <li v-for="(item, index) in Object.keys(checkResult.rejectedWordWithReason)" :key="index">{{index+1}}、{{item}}{{checkResult.rejectedWordWithReason[item]}}</li>
                    </ul>
                </el-col>
                <el-col :span="2" :push="5">
                    <UseTips/>
                </el-col>
            </el-form-item>
            <el-form-item label="推广行业" prop="industry">
              <el-col :span="8">
                <el-select :disabled="true" v-model="form.industry" filterable placeholder="请选择">
                  <el-option
                    v-for="(item, index) in industryList"
                    :key="`${item.name}-${index}`"
                    :label="item.description"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="推广区域" prop="cities">
              {{transformArea}}
                <i class="el-icon-plus" @click="checkSold"></i>
            </el-form-item>
            <el-form-item label="用户所在地" prop="coreCities" key="coreCities" v-if="form.cities.length">
                <el-tag type="success" closable class="kw-tag"
                        v-for="area in form.coreCities" :key="area"
                        @close="removeCoreCities(area)"
                >
                {{ formatArea(area) }}
                </el-tag>
                <i v-if="form.coreCities.length < coreCityLimit" class="el-icon-plus" @click="coreCitiesDialogVisible = true" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">查价</el-button>
            </el-form-item>
        </el-form>
        <AreaSelector
        type="bw" :all-areas="allAreas"
        :areas="form.cities"
        :visible="areaDialogVisible"
        :enable-china="false"
        :allSoldCities="allSoldCities"
        @ok="onAreasChange"
        @cancel="areaDialogVisible = false"
        comType="bw-plus"
        />
        <CoreCitiesDialog
        :visible="coreCitiesDialogVisible"
        :limit="coreCityLimit"
        :all-areas="allAreas"
        :origin-core-cities="form.coreCities"
        :areas="form.cities"
        @cancel="coreCitiesDialogVisible = false"
        @confirm="handleCoreCitiesConfirm"
        />
    </div>
</template>

<script>
import { getAllIndustry, checkKeyword } from 'api/biaowang-plus'
import CoreCitiesDialog, { OTHER_CITY_ENUM } from 'com/common/bw/core-cities-dialog'
import AreaSelector from 'com/common/biaowang-area-selector'
import UseTips from './use-tips.vue'
import InvalidIndustry from './invalid-industry.vue'
import { getCnName } from 'util'
import debounce from 'lodash.debounce'
import gStore from '../../../store'
export default {
  name: 'InqueryForm',
  components: {
    AreaSelector,
    CoreCitiesDialog,
    InvalidIndustry,
    UseTips
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    },
    isPending: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  fromMobx: {
    renewQueryInfo: () => gStore.queryInfo
  },
  data () {
    return {
      form: {
        words: '',
        industry: '',
        cities: [],
        coreCities: []
      },
      isInquery: false,
      coreCitiesDialogVisible: false,
      areaDialogVisible: false,
      coreCityLimit: 1,
      industryList: [],
      rules: {
        words: [{ validator: this.checkWord, trigger: 'blur' }],
        industry: [{ required: true, message: '请选择推广行业', trigger: 'change' }],
        cities: [{ required: true, message: '请选择推广地域', trigger: 'change' }],
        coreCities: [{ required: true, message: '请选择用户所在地', trigger: 'change' }]
      },
      checkResult: {
        passed: true,
        rejectedWordWithReason: {},
        industry: ''
      },
      restaurants: [],
      allSoldCities: {}
    }
  },
  async mounted () {
    const { query: { renew } } = this.$route
    await this.fetchAllIndustry()
    if (renew) {
      const { words, industry, coreCity, cities } = this.renewQueryInfo
      this.form.words = words.join('\n')
      this.form.cities = cities
      this.form.industry = industry
      this.form.coreCities = [coreCity]
      await this.checkKeyword()
    }
  },
  computed: {
    industryTips () {
      const { checkResult: { skipManualAudit, passed } } = this
      if (passed) {
        return skipManualAudit ? '可直接提单（系统判断行业无需审核）' : '需人工审核（该关键词容易误判，最终提单价格依据人工审核结果）'
      }
      return ''
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
  methods: {
    keywordLengthCheck () {
      const { words = '' } = this.form
      let errorMsg = {
        validate: true,
        error: ''
      }
      const array = words.split(/[\s\n]/).filter(Boolean)
      const patrn = /[`~!@#$%^&*()_+=<>?:"{}|,.\\/;'\\[\]·~！@#￥%……&*（）——+={}|《》？：“”【】、；‘'，。、]/im
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
          error: '关键词个数不能超过20个'
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
      if (!this.checkResult.passed) {
        callback(new Error('关键词风控审查不通过'))
      }
      if (!result.validate) {
        callback(new Error(result.error))
      }
      callback()
    },
    async fetchAllIndustry () {
      const { code, data: { industryList } } = await getAllIndustry()
      if (code === 0) {
        this.industryList = industryList
      }
    },
    submitForm: debounce(async function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const checkedIndustry = this.industryList.filter(item => item.name === this.form.industry)
          const industryCn = checkedIndustry[0].description
          this.$emit('inquery', { ...this.form, industryCn })
        } else {
          console.log(valid)
        }
      })
    }, 1000),
    async checkKeyword () {
      this.$emit('resetResult')
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
            return false
          }
          this.form.industry = industry || ''
          this.$message({
            message: '风控审查通过啦！快去查价吧！',
            type: 'success'
          })
        } catch (error) {
          this.checkResult.passed = false
          return false
        } finally {
          loading.close()
        }
      }
    },
    removeArea (area) {
      this.form.cities = this.form.cities.filter(i => i !== area)
      // 用户所在地和推广区域联动
      this.form.coreCities = this.form.coreCities.filter(i => i !== area)
      // 更新视图
      this.$bus.$emit('updateBiaowangAreaSelectorView', area)
    },
    formatArea (name) {
      return name === OTHER_CITY_ENUM
        ? '其它'
        : getCnName(name, this.allAreas)
    },
    removeCoreCities (area) {
      this.form.coreCities = this.form.coreCities.filter(i => i !== area)
    },
    onAreasChange (areas) {
      this.form.cities = [...areas]
      // 用户所在地和推广区域联动
      this.form.coreCities = this.form.coreCities.filter(i => areas.includes(i))
      this.areaDialogVisible = false
    },
    handleCoreCitiesConfirm (coreCities) {
      this.form.coreCities = coreCities
      this.coreCitiesDialogVisible = false
    },
    async checkSold () {
      // 暂时去掉已售城市判断
      // const { words = '' } = this.form
      // const keywords = words.split(/[\s\n]/).filter(Boolean)
      // if (!words) {
      //   this.$message({
      //     message: '请先输入您要查询的关键词！',
      //     type: 'error'
      //   })
      //   return
      // }
      // const { data: { allSoldCities } } = await checkSoldCities({ keywords })
      // if (allSoldCities.length) {
      //   this.allSoldCities = Object.fromEntries(allSoldCities.map(item => [item, true]))
      // } else {
      //   this.allSoldCities = {}
      // }
      this.areaDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-select{
    width: 100%;
  }
  .reject-result{
    li{
      margin: 6px 0;
      color: #E6A23C;
      line-height: 28px;
    }
  }
  // .industry-tips{
  //   font-size: 14px;
  //   margin: 6px 0;
  //   color: #F56C6C;
  //   line-height: 18px;
  // }
  .more-tips{
      margin-left: 10px;
  }
</style>
