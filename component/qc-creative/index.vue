<template>
  <section class="page qc-creative-page">
    <header>投放内容</header>

    <div class="form-wrapper">
      <el-form
        :model="form"
        :rules="rules"
        ref="query-form"
        label-width="120px"
        label-position="left"
        class="form"
        @submit.native.prevent>

        <el-form-item><span class="header">基本信息</span></el-form-item>

        <el-form-item label="核心产品" prop="coreWords">
          <span class="keyword">{{form.coreWords.join(',')}}</span>
        </el-form-item>
        <el-form-item label="投放类型" prop="landingType">
          <el-radio-group
            v-model="form.landingType"
            @change="clearLandingInput"
          >
            <el-radio-button
              v-for="option of landingTypeOpts"
              class="landing-page-type-selector"
              :key="option.value"
              :label="option.value"
            >{{option.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="form.landingType"
          label="投放地址"
          prop="landingPageId"
          key="landingPageId">
          <mvip-selector
            v-if="form.landingType === LANDING_TYPE_STORE"
            :initValue="form.landingType === LANDING_TYPE_STORE && form.landingPageId || ''"
            @change="setLanding"
            @valid-change="isValid => setLandingPageValidity(LANDING_TYPE_STORE, isValid)"
          />
        </el-form-item>

        <el-form-item><span class="header">推广物料设置</span></el-form-item>

        <el-form-item label="投放标题" prop="creativeTitle">
          <el-input
            v-model="form.creativeTitle"
            placeholder="请填写投放标题"
            clearable
          />
        </el-form-item>
        <el-form-item label="推广内容" prop="creativeContent">
          <el-input
            type="textarea"
            v-model="form.creativeContent"
            placeholder="请填写推广内容"
            clearable
            :autosize="{minRows: 5, maxRows: 8}"
          />
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" :disabled="!userInfo.shAgent" :loading="loading.form" @click="update">更新推广计划</el-button>
          <el-button @click="() => $router.go(-1)">返回上一页</el-button>
        </el-form-item>
      </el-form>
    </div>

  </section>
</template>

<script>
import { getRouteParam } from 'util'
import { LANDING_TYPE_GUAN_WANG, LANDING_TYPE_STORE, landingTypeOpts } from 'constant/qianci'
import { getCreative, saveCreative } from 'api/qianci'
import MvipSelector from 'com/common/mvip-selector'

export default {
  name: 'creative-manage',
  components: {
    MvipSelector
  },
  props: {
    userInfo: {
      type: Object,
      require: true,
      default: () => {}
    },
    salesInfo: {
      type: Object,
      require: true,
      default: () => {}
    }
  },
  data () {
    return {
      LANDING_TYPE_STORE,
      landingTypeOpts,

      id: null,
      isFormEdited: false,
      originData: null,
      form: {
        coreWords: [],
        landingType: LANDING_TYPE_STORE,
        landingPage: '',
        landingPageId: '',
        creativeTitle: '',
        creativeContent: ''
      },
      rules: {
        coreWords: [{ type: 'array', required: true, message: '哇核心产品都没有' }],
        landingType: [{ required: true, message: '请选择投放页面类型' }],
        landingPage: [{ required: true, message: '请选择投放页面' }],
        landingPageId: [{ required: true, message: '请选择投放页面' }],
        creativeTitle: [
          { required: true, message: '请填写推广标题' },
          {
            validator: (rule, value, callback) => {
              if (value.length < 9 || value.length > 25) callback(new Error('推广标题长度需要在 9-25 之间'))
              callback()
            },
            trigger: 'blur'
          }
        ],
        creativeContent: [
          { required: true, message: '请填写推广内容' },
          {
            validator: (rule, value, callback) => {
              if (value.length < 9 || value.length > 80) callback(new Error('推广内容长度需要在 9-80 之间'))
              if (value === this.form.creativeTitle) callback(new Error('推广内容不能和推广标题相同'))
              callback()
            },
            trigger: 'blur'
          }
        ]
      },
      options: {
        sites: []
      },
      visible: {
        siteExpireWarning: false,
        siteExistWebsite: false
      },
      loading: {
        form: false
      }
    }
  },
  watch: {
    form: {
      deep: true,
      immediate: false,
      handler (v) {
        // console.log(v)
        this.isFormEdited = true
      }
    }
  },
  async created () {
    this.id = getRouteParam.bind(this)('promoteId')
    if (!this.id) {
      throw new Error('No ID on qc-creative page.')
    } else {
      this.initCreative()
    }
  },
  methods: {
    async initCreative () {
      const response = await getCreative({ id: this.id, salesInfo: this.salesInfo })
      const {
        coreWords,
        landingType,
        landingPage,
        landingPageId,
        creativeTitle,
        creativeContent
      } = response || {}

      this.originData = response

      // * for test
      // const coreWords = ['cestest']
      // const creativeTitle = 'testtesttesttest'
      // const creativeContent = 'testtesttesttesttesttesttesttest'
      // const landingPageId = 176
      // const landingPage = 'http://shop-test.baixing.cn/aaaa/'
      // const landingType = LANDING_TYPE_STORE

      this.form.coreWords = coreWords
      this.form.creativeTitle = creativeTitle || ''
      this.form.creativeContent = creativeContent || ''
      this.form.landingPageId = landingPageId || ''
      this.form.landingPage = landingPage || ''
      this.form.landingType = landingType

      // TIP 2021-06-16 下线官网落地页类型
      if (landingType === LANDING_TYPE_GUAN_WANG) {
        this.form.landingType = LANDING_TYPE_STORE
        this.clearLandingInput()
      }

      // console.log('this.form: ', this.form)

      this.$nextTick(() => {
        if (landingType !== LANDING_TYPE_GUAN_WANG) this.isFormEdited = false
      })
    },
    clearLandingInput () {
      this.setLanding('', '')
    },
    setLanding (url, id) {
      this.form.landingPage = url
      this.form.landingPageId = id
    },
    setLandingPageValidity (type, isValid) {
      if (!isValid) {
        this.form.landingPage = ''
        this.form.landingType = type
      }
    },
    async update () {
      // 调用编辑物料会走审核。如果表单没有任何变化，则不调用接口。
      if (!this.isFormEdited) {
        this.loading.form = true
        setTimeout(() => {
          this.loading.form = false
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
        }, 1000)
        return null
      }
      this.$refs['query-form'].validate(async isValid => {
        if (isValid) {
          this.loading.form = true
          const query = {
            ...this.form,
            id: this.id
          }
          try {
            await saveCreative(query)
          } finally {
            setTimeout(() => (this.loading.form = false), 300)
          }
          this.isFormEdited = false
          this.$notify({
            type: 'success',
            message: '保存成功'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  margin-top: 36px;
  padding-left: 20px;
  width: 700px;
}
.header {
  margin-left: -120px;
  font-weight: bold;
  color: #444;
}
.payment-url-input {
  margin-top: 16px;
  .el-input__inner {
    color: #888;
  }
}
.el-form {
  .keyword {
    font-weight: bold;
  }
  .landing-page-type-selector {
    cursor: pointer;
  }
  .el-form-item:last-child {
    margin-top: 35px;
  }
}
</style>

<style lang="scss">
/* TODO 查找 Element 级联被样式污染原因 */
.el-cascader__dropdown {
  & .el-scrollbar__wrap {
    margin-bottom: 0 !important;
    overflow: hidden scroll;
  }
}
</style>
