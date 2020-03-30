<template>
  <el-form
    ref="form"
    :model="formData"
    label-width="120px"
  >
    <el-form-item
      required
      refs="form"
      size="small"
      :key="item.key"
      :prop="item.key"
      :rules="item.rules"
      :label="item.label"
      v-for="item in formsRenderData"
    >
      <component
        :is="item.type"
        v-bind="item.props"
        v-model="formData[item.key]"
        :placeholder="item.placeholder"
        :class="[item.type === 'el-input' ? 'input' : 'uploader']"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import ImageUploader from './uploader'

function getValidateRules(message, type = 'input') {
  return {
    message: type === 'uploader' ? `请上传${message}` :`${message}不能为空`,
    required: true,
    trigger: 'blur'
  }
}

const formsRenderData = [{
  key: 'url',
  label: '推广网址',
  placeholder: '推广网站首页地址，和推广站点首页一致',
  props: {
    disabled: true
  },
  rules: getValidateRules('推广网址'),
  type: 'el-input'
}, {
  key: 'company',
  label: '公司名称',
  placeholder: '完整公司名称，如：上海XX信息科技有限公司',
  rules: getValidateRules('公司名称'),
  type: 'el-input'
}, {
  key: 'name',
  label: '联系人',
  placeholder: '姓+称谓，如：张先生',
  rules: getValidateRules('联系人'),
  type: 'el-input'
}, {
  key: 'phone',
  label: '联系电话',
  placeholder: '填写手机号，如：13000001234',
  rules: {
    trigger: 'blur',
    validator(rule, value, callback) {
      if(!/^1[345789 ][0-9]{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号吗'))
      } else {
        callback()
      }
    }
  },
  type: 'el-input'
}, {
  key: 'address',
  label: '联系地址',
  placeholder: '填写公司详细地址，如上海市闵行区七莘路X号X栋X室',
  rules: getValidateRules('联系地址'),
  props: {
    type: 'text-area'
  },
  type: 'el-input'
}, {
  key: 'intro',
  label: '公司简介',
  placeholder: '100字以上。直接复制截取客户网站部分简介即可',
  rules: [
    getValidateRules('公司简介'),
    {type: 'string', min: 100, trigger: 'blur', message: '公司简介需要填写100字以上'}
  ],
  props: {
    type: 'textarea',
    autosize: {minRows: 3, maxRows: 6}
  },
  type: 'el-input'
}, {
  key: 'logo',
  label: '客户LOGO图',
  rules: getValidateRules('客户LOGO图', 'uploader'),
  placeholder: '上传与客户业务相关图即可，300KB以内',
  type: 'image-uploader'
}, {
  key: 'banner',
  label: '客户Banner图',
  props: {
    width: '150px'
  },
  rules: getValidateRules('客户Banner图', 'uploader'),
  placeholder: '上传与客户业务相关图即可，300KB以内',
  type: 'image-uploader'
}]

const defaultForm = formsRenderData.reduce((res, item) => {
  return {
    ...res,
    [item.key]: ''
  }
}, {})

export default {
  name: 'cibao-promotion-form',
  components: {ImageUploader},
  props: {
    value: Object
  },
  methods: {
    getValues() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((isSuccess, value) => {
          if (isSuccess) {
            resolve(this.formData)
          } else {
            reject(value)
          }
        })
      })
    }
  },
  watch: {
    value(val) {
      this.formData = Object.assign(this.formData, val)
    }
  },
  data() {
    return {
      formsRenderData,

      formData: defaultForm
    }
  }
}
</script>

<style lang="postcss" scoped>
  .input {
    width: 400px;
  }
  .uploader {
    width: 150px;
  }
  /deep/ .upload-image-wrapper {
    cursor: pointer;
    & > img {
      border: 1px dashed transparent;
      border-radius: 4px;
      padding: 5px;
      &:hover {
        border-color: #999;
      }
    }
  }
</style>
