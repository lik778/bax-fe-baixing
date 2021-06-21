<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="推广关键词" prop="keyWords">
                <el-col :span="8">
                    <el-input @change="checkKeyword" type="textarea" v-model="form.keyWords" rows="6"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="推广行业" prop="industry">
                <el-select v-model="form.industry" placeholder="请选择">
                    <el-option
                        v-for="(item, index) in industryList"
                        :key="index"
                        :label="item.desc"
                        :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="推广区域" prop="areas">
                <el-tag type="success" closable class="kw-tag"
                        v-for="area in form.areas" :key="area"
                        @close="removeArea(area)"
                >
                {{ formatArea(area) }}
                </el-tag>
                <i class="el-icon-plus" @click="areaDialogVisible = true"></i>
            </el-form-item>
            <el-form-item label="用户所在地" prop="coreCities" key="coreCities" v-if="form.areas.length">
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
        :areas="form.areas"
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
        :areas="form.areas"
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
        keyWords: '',
        industry: '',
        areas: [],
        coreCities: []
      },
      isInquery: false,
      coreCitiesDialogVisible: false,
      areaDialogVisible: false,
      coreCityLimit: 1,
      industryList: [],
      rules: {
        keyWords: [{ required: true, message: '请输入推广关键词', trigger: 'blur' }],
        industry: [{ required: true, message: '请选择推广行业', trigger: 'change' }],
        areas: [{ required: true, message: '请选择推广地域', trigger: 'change' }],
        coreCities: [{ required: true, message: '请选择用户所在地', trigger: 'change' }]
      }
    }
  },
  async mounted () {
    await this.fetchAllIndustry()
  },
  methods: {
    async fetchAllIndustry () {
      const { code, data: { industryList } } = await getAllIndustry()
      if (code === 0) {
        this.industryList = industryList
      }
    },
    async submitForm (formName) {
      this.isInquery = true
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form)
        } else {
          console.log('')
        }
        loading.close()
        this.isInquery = false
      })
    },
    async checkKeyword () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { keyWords = '' } = this.form
      const { code, data: { passed, rejectedWordWithReason } } = await checkKeyword({ keyWords: keyWords.split(/[\s\n]/) })
      loading.close()
      if (code === 0) {
        if (passed) {
          this.$message({
            message: '恭喜你，这是一条成功消息',
            type: 'success'
          })
        } else {
          this.$message({
            message: rejectedWordWithReason,
            type: 'success'
          })
        }
      }
    },
    removeArea (area) {
      this.form.areas = this.form.areas.filter(i => i !== area)
      // 用户所在地和推广区域联动
      this.form.coreCities = this.form.coreCities.filter(i => i !== area)
      // 更新视图
      // this.$bus.$emit('updateBiaowangAreaSelectorView', area)
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
      this.form.areas = [...areas]
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
