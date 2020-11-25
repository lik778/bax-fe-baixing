<template>
  <div class="bg">
    <div class="white-bg">
      <main>
        <product-intro></product-intro>
        <el-form :model="form" :rules="rules" label-width="120px" ref="form" label-position="left" class="form" @submit.native.prevent>
          <el-form-item label="核心产品" prop="keyword">
            <el-input :disabled="isEdit" v-model="form.keyword" style="width: 200px" maxlength="10"/>
          </el-form-item>
          <el-form-item label="推广区域" prop="areas">
            <el-tag type="success" :closable="!isEdit" class="kw-tag"
                    v-for="area in form.areas" :key="area.name"
                    @close="removeArea(area)">
              {{ area.name }}
            </el-tag>
            <i class="el-icon-plus" v-if="!isEdit" @click="areaDialogVisible = true"></i>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="isEdit" :loading="loading" type="primary" @click="checkWord">检查</el-button>
          </el-form-item>
        </el-form>
        <select-keywords v-if="keywordsPanelVisible" ref="selectKeywords" :promote="promote"
        :form="form" :isEdit="isEdit"/>
      </main>
    </div>
    <qc-area-selector
      :areas="form.areas"
      :visible="areaDialogVisible"
      @ok="onAreasChange"
      @cancel="areaDialogVisible = false"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getPromote, createPreferredWords } from "api/qianci"
import ProductIntro from "com/qc-create-promote/product-intro"
import QcAreaSelector from "com/qc-create-promote/qc-area-selector"
import { API_SUCCESS } from 'constant/api'
import SelectKeywords from './select-keywords'
import gStore from '../store'

export default {
  name: "qc-create-promote",
  components: { ProductIntro, QcAreaSelector, SelectKeywords },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  fromMobx: {
    allQianciAreas: () => gStore.allQianciAreas
  },
  data() {
    return {
      promote: null,
      form: {
        keyword: '',
        areas: []
      },
      rules: {
        keyword: [{required: true, message: '请填写核心产品'},
          { validator: (rule, value, callback) => {
              if (!/^[\u4E00-\u9FA5A-Za-z0-9]{2,10}$/.test(value)) { return callback(new Error('非特殊字符且单个词长度2-10个字'))}
              callback() }, trigger: 'blur' }],
        areas: [{type: 'array', required: true, trigger: 'change', message: '请选择推广区域'},
          { validator: (rule, value, callback) => {
              if (value.length !== 2) { return callback(new Error('需要选择2个区域'))}
              callback() }, trigger: 'blur' } ]
      },
      loading: false,
      areaDialogVisible: false,
      keywordsPanelVisible: false,
      isEdit: false
    }
  },
  watch: {
    promote: {
      deep: true,
      immediate: true,
      handler(values) {
        if (values) {
          this.form.keyword = values.coreWord
          const{ enToCnMap, provinces } = this.allQianciAreas
          this.form.areas = values.provinces.map(en => {
            const cnName = enToCnMap[en]
            return { name: cnName, en, checked: true, cities: provinces[cnName]  }
          })
          this.keywordsPanelVisible = true
        }
      }
    },
    form: {
      deep: true,
      immediate: true,
      handler() {
        if (!this.isEdit) {
          this.keywordsPanelVisible = false
        }
      }
    }
  },
  async mounted() {
    const { id } = this.$route.query

    // 获取千词地区信息
    if (Object.keys(gStore.allQianciAreas).length === 0) {
      gStore.getQianciAreas()
    }

    if (id) {
      this.isEdit = true
      const promote = await getPromote(id)
      this.promote = promote
    }
  },
  methods: {
    async checkWord() {
      this.$refs.form.validate(async isValid => {
        if (isValid) {
          this.keywordsPanelVisible = true
        }
      })
    },
    removeArea(area) {
      this.form.areas = [
        ...this.form.areas.filter(i => i.name !== area.name)
      ]
      this.$bus.$emit('updateQcAreaSelectorView', area)
    },
    onAreasChange(areas) {
      this.form.areas = [...areas]
      this.areaDialogVisible = false
    }
  }
}
</script>

<style lang="postcss" scoped>
div.bg {
    & > .white-bg {
        background-color: #fff;
        & .warning-text {
            color: #FF6350;
        }
        & .kw-tag {
          margin-right: 10px;
        }
    & > main {
        box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
        min-height: 700px;
        padding: 45px 60px;
    }
    & > main .el-icon-plus {
      cursor: pointer;
    }
  }
}
</style>
