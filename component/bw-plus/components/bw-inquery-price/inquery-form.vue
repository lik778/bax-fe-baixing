<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="推广关键词" prop="words">
                <el-col :span="8">
                    <el-input @change="checkKeyword" type="textarea" v-model="form.words" rows="6"></el-input>
                </el-col>
                <el-col v-if="!checkResult.passed" :span="8" :push="1">
                  <ul class="reject-result">
                    <li v-for="(item, index) in Object.keys(checkResult.rejectedWordWithReason)" :key="index">{{index+1}}、{{item}}{{checkResult.rejectedWordWithReason[item]}}</li>
                  </ul>
                </el-col>
            </el-form-item>
            <el-form-item label="推广行业" prop="industry">
              <el-col :span="8">
                <el-select v-model="form.industry" filterable placeholder="请选择">
                  <el-option
                    v-for="item in industryList"
                    :key="item.name"
                    :label="item.description"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="推广区域" prop="cities">
                <el-tag type="success" closable class="kw-tag"
                        v-for="area in form.cities" :key="area"
                        @close="removeArea(area)"
                >
                {{ formatArea(area) }}
                </el-tag>
                <i class="el-icon-plus" @click="areaDialogVisible = true"></i>
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
                <el-button type="primary" :loading="isInquery" @click="submitForm('form')">查价</el-button>
            </el-form-item>
        </el-form>
        <AreaSelector
        type="bw" :all-areas="allAreas"
        :areas="form.cities"
        :visible="areaDialogVisible"
        :enable-china="false"
        @ok="onAreasChange"
        @cancel="areaDialogVisible = false"
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
import { getCnName } from 'util'
export default {
  name: 'InqueryForm',
  components: {
    AreaSelector,
    CoreCitiesDialog
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
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
        rejectedWordWithReason: {}
      },
      restaurants: []
    }
  },
  async mounted () {
    await this.fetchAllIndustry()
  },
  methods: {
    checkWord (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入关键词'))
      }
      if (!this.checkResult.passed) {
        callback(new Error('关键词风控审查不通过'))
      }
      callback()
    },
    async fetchAllIndustry () {
      const { code, data: { industryList } } = await getAllIndustry()
      if (code === 0) {
        this.industryList = industryList
      }
    },
    async submitForm (formName) {
      this.isInquery = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const checkedIndustry = this.industryList.filter(item => item.name === this.form.industry)
          const industryCn = checkedIndustry[0].description
          console.log('industryCn', industryCn)
          this.$emit('inquery', { ...this.form, industryCn })
        } else {
          console.log('')
        }
        this.isInquery = false
      })
    },
    async checkKeyword () {
      const loading = this.$loading({
        lock: true,
        text: '正在风控审查中， 请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { words = '' } = this.form
      try {
        const { data: { passed, rejectedWordWithReason } } = await checkKeyword({ keywords: words.split(/[\s\n]/).filter(Boolean) })
        this.checkResult = {
          passed,
          rejectedWordWithReason
        }
        loading.close()
        if (!passed) {
          this.$message({
            message: rejectedWordWithReason,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: '风控审查通过啦！快去查价吧！',
          type: 'success'
        })
      } catch (error) {
        loading.close()
        return false
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
</style>
