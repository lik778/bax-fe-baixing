<template>
  <div class="bg">
    <div class="white-bg">
      <main>
        <product-intro></product-intro>
        <el-form :model="form" :rules="rules" label-width="120px" ref="form" label-position="left" class="form" @submit.native.prevent>
          <el-form-item label="推广关键词" prop="keyword">
            <el-input v-model="form.keyword" style="width: 200px" maxlength="8"/>
          </el-form-item>
          <el-form-item label="推广区域" prop="areas">
            <el-tag type="success" closable class="kw-tag"
                    v-for="area in form.areas" :key="area.name"
                    @close="removeArea(area)">
              {{ area.name }}
            </el-tag>
            <i class="el-icon-plus" @click="areaDialogVisible = true"></i>
          </el-form-item>
          <el-form-item>
            <p class="warning-text" >{{checkWordText}}</p>
            <el-button :loading="loading" type="primary" @click="checkWord">检查</el-button>
          </el-form-item>
        </el-form>
        <select-keywords v-if="keywordsPanelVisible" ref="selectKeywords" :form="form" />
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
import { keywordLocked,createPreferredWords } from "api/qianci"
import ProductIntro from "com/qc-query-price/product-intro"
import QcAreaSelector from "com/qc-query-price/qc-area-selector"
import SelectKeywords from './select-keywords'

export default {
  name: "qc-query-price",
  components: { ProductIntro, QcAreaSelector, SelectKeywords },
  props: {
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        keyword: '',
        areas: []
      },
      rules: {
        keyword: [{required: true, message: '请填写推广关键词'},
          { validator: (rule, value, callback) => {
              if (!/^[\u4e00-\u9fa5]{2,8}$/.test(value)) { return callback(new Error('单个词长度不少于2个字，不超过8个字且为汉字'))}
              callback() }, trigger: 'blur' }],
        areas: [{type: 'array', required: true, trigger: 'change', message: '请选择推广区域'},
          { validator: (rule, value, callback) => {
              if (value.length !== 2) { return callback(new Error('需要选择2个区域'))}
              callback() }, trigger: 'blur' } ]
      },
      loading: false,
      areaDialogVisible: false,
      keywordsPanelVisible: false,
      checkWordText: ''
    }
  },
  methods: {
    async checkWord() {
      this.$refs.form.validate(async isValid => {
        if (isValid) {
          const ret = await keywordLocked({ coreWord: this.form.keyword, provinces: this.form.areas.map(x => x.name) })
          console.log(ret)
          if (true) {
            this.keywordsPanelVisible = true
          } else {
            this.checkWordText = '检测核心词在所选的地区是否已被售出，如已被售出文案提示用户'
          }
        } else {
          return false
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
