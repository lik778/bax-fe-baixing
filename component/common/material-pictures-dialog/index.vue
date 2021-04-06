<template>
  <section class="material-pictures-editor">
    <aside class="label">
      推广内容:
    </aside>
    <span>
      <el-radio-group v-model="forms.type" @change="clearPictures">
        <el-radio :label="MATERIAL_PIC_TYPE.NO_PIC">无图</el-radio>
        <el-radio :label="MATERIAL_PIC_TYPE.BIG_PIC">大图</el-radio>
        <el-radio :label="MATERIAL_PIC_TYPE.PIC_SETS">图集</el-radio>
      </el-radio-group>
      <div />
      <div class="picture-container" v-if="showPicContainer">
        <div class="pc-con con" :class="[typename].join(' ')">
          <div class="header">
            <span class="title">电脑端</span>
            <el-popover
              v-if="!validatePCError"
              placement="bottom-start"
              trigger="click"
              popper-class="ad-preview-popover">
              <preview
                classname="pc-preview"
                :srcs="forms.pc"
                :type="typename"
              />
              <span class="preview-tip" slot="reference">展现样式</span>
            </el-popover>
          </div>
          <div class="content">
            <images-con
              v-model="forms.pc"
              :limit="picNumLimit('pc')"
              :cropOptions="{
                width: pixelRatioLimit('pc').minWidth,
                height: pixelRatioLimit('pc').minHeight,
              }"
            />
            <div class="tip-con">
              <p v-text="typeLimitTips('pc')" />
              <p>{{formatTip}}</p>
            </div>
          </div>
        </div>
        <div class="wap-con con" :class="[typename].join(' ')">
          <div class="header">
            <span class="title">手机端</span>
            <el-popover
              v-if="!validateWAPError"
              placement="bottom-end"
              trigger="click"
              popper-class="ad-preview-popover">
              <preview
                classname="wap-preview"
                :srcs="forms.wap"
                :type="typename"
              />
              <span class="preview-tip" slot="reference">展现样式</span>
            </el-popover>
          </div>
          <div class="content">
            <images-con
              v-model="forms.wap"
              :limit="picNumLimit('wap')"
              :cropOptions="{
                width: pixelRatioLimit('wap').minWidth,
                height: pixelRatioLimit('wap').minHeight,
              }"
            />
            <div class="tip-con">
              <p v-text="typeLimitTips('wap')" />
              <p>{{formatTip}}</p>
            </div>
          </div>
        </div>
      </div>
    </span>
  </section>
</template>

<script>
import {
  CREATIVE_STATUS_REJECT,
  CREATIVE_STATUS_PENDING
} from 'constant/fengming'
import ImagesCon from './images-con'
import Preview from './preview'
import { deepClone } from 'util'

// 图集类型枚举
const MATERIAL_PIC_TYPE = {
  NO_PIC: 1,
  BIG_PIC: 2,
  PIC_SETS: 3
}

export default {
  name: 'material-pictures-editor',
  props: {
    value: Object,
    initValue: {
      default () {
        return {
          type: 1,
          pc: [],
          wap: []
        }
      }
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  components: {
    ImagesCon,
    Preview
  },
  data () {
    return {
      MATERIAL_PIC_TYPE,
      CREATIVE_STATUS_REJECT,
      CREATIVE_STATUS_PENDING,
      forms: {
        type: 1,
        pc: [],
        wap: []
      },
      formatTip: '支持 JPG、PNG 格式；2MB 以内',
      config: {
        [MATERIAL_PIC_TYPE.NO_PIC]: {
          extraClass: 'no-pic',
          countLimit: { wap: 0, pc: 0 }
        },
        [MATERIAL_PIC_TYPE.BIG_PIC]: {
          extraClass: 'big-pic',
          countLimit: { wap: 1, pc: 1 },
          pixelLimit: {
            pc: {
              minWidth: 518,
              minHeight: 292,
              ratio: '1.77:1'
            },
            wap: {
              minWidth: 800,
              minHeight: 267,
              ratio: '3:1'
            }
          }
        },
        [MATERIAL_PIC_TYPE.PIC_SETS]: {
          extraClass: 'pic-sets',
          countLimit: { wap: 3, pc: 4 },
          pixelLimit: {
            pc: {
              minWidth: 323,
              minHeight: 200,
              ratio: '1.61:1'
            },
            wap: {
              minWidth: 200,
              minHeight: 200,
              ratio: '1:1'
            }
          }
        }
      }
    }
  },
  computed: {
    showPicContainer () {
      return [
        MATERIAL_PIC_TYPE.BIG_PIC,
        MATERIAL_PIC_TYPE.PIC_SETS
      ].includes(this.forms.type)
    },
    typeConfig () {
      return this.config[this.forms.type]
    },
    typename () {
      return this.typeConfig.extraClass
    },
    validatePCError () {
      const restCount = this.typeConfig.countLimit.pc - this.forms.pc.length
      if (restCount) {
        return `请再上传${restCount}张电脑端图片`
      }
      return null
    },
    validateWAPError () {
      const restCount = this.typeConfig.countLimit.wap - this.forms.wap.length
      if (restCount) {
        return `请再上传${restCount}张手机端图片`
      }
      return null
    },
    isValidateError () {
      return this.validatePCError || this.validateWAPError
    }
  },
  watch: {
    initValue (newVal = {}) {
      this.forms = {
        type: newVal.type || MATERIAL_PIC_TYPE.NO_PIC,
        pc: newVal?.pc?.length > 1 ? deepClone(newVal.pc) : [],
        wap: newVal?.wap?.length > 1 ? deepClone(newVal.wap) : []
      }
      // * for test suppose
      // this.forms = {
      //   type: 2,
      //   pc: [{
      //     url: '//file.baixing.net/sst-img172b2392-1167-49f2-a1f3-1b361e5ad2cc'
      //   }],
      //   wap: []
      // }
    },
    forms: {
      deep: true,
      handler (newValue) {
        this.$emit('change', this.genData(newValue))
      }
    }
  },
  methods: {
    clearPictures () {
      // todo 删除 OSS 上的图片
      this.forms.pc = []
      this.forms.wap = []
    },
    genData (forms = this.forms) {
      const inits = this.initValue
      const hasError = this.isValidateError
      if (hasError) {
        return {
          isValid: false
        }
      } else {
        const add = {
          pc: forms.pc.filter(x => !(inits.pc || []).find(y => x.url === y.url)),
          wap: forms.wap.filter(x => !(inits.wap || []).find(y => x.url === y.url))
        }
        const del = {
          pc: (inits.pc || [])
            .filter(x => !forms.pc.find(y => y.url === x.url))
            .map(x => x.id),
          wap: (inits.wap || [])
            .filter(x => !forms.wap.find(y => y.url === x.url))
            .map(x => x.id)
        }
        return {
          isValid: true,
          type: forms.type,
          add,
          del
        }
      }
    },

    /* Calculation */

    picNumLimit (type) {
      return this.typeConfig.countLimit[type]
    },
    pixelRatioLimit (type) {
      return this.typeConfig.pixelLimit[type]
    },
    disableByLimit (type) {
      const formsLength = this.forms[type].length
      return formsLength >= this.picNumLimit(type)
    },
    typeLimitTips (type) {
      const { minWidth, minHeight, ratio } = this.pixelRatioLimit(type)
      return `比例 ${ratio}，最小 ${minWidth}*${minHeight}，每组需上传 ${this.picNumLimit(type)} 张图片`
    }
  }
}
</script>

<style lang="scss" scoped>
.material-pictures-editor {
  display: flex;
  margin: 20px 0;

  & > header {
    color: #6a778c;
  }

  & > div {
    display: flex;
    margin: 20px 0;

    & > aside:first-child {
      display: flex;
      align-items: center;
      min-width: 70px;
      margin-right: 20px;
      color: #6a778c;
      font-size: 14px;
    }
  }
}
.creative-title-container {
  display: inline-block;
  & span {
    display: flex;
    align-items: center;
  }
  & .auditing-prompt {
    font-size: 12px;
    color: #ff4401;
    margin-left: 10px;
  }
}
.label {
  align-self: flex-start;
  min-width: 70px;
  margin-right: 20px;
  color: #6a778c;
  font-size: 14px;
}
.picture-container {
  display: flex;
  justify-content: space-between;
  gap: 35px;
  margin-top: 20px;
  padding: 16px 30px;
  border: dashed 1px #DBDBDB;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px 0 3px;

    .title {
      color: #6a6a6a;
    }
    .preview-tip {
      font-size: 20px;
      color: #35A5E4;
      letter-spacing: .5px;
      text-align: right;
      line-height: 10px;
      transform: scale(.5);
      transform-origin: right;
      cursor: pointer;
    }
  }
  .con {
    width: 435px;
  }
  .content {
    margin-top: 15px;
    padding: 22px 25px;
    border: 1px solid #DBDBDB;
    border-radius: 2px;
  }
  .tip-con {
    margin-top: 30px;
    font-size: 12px;
    color: #999;
    text-align: center;
  }
}
.pc-con {
  &.big-pic {
    /deep/ .image {
      width: 140px;
      height: 79px;
    }
  }
  &.pic-sets {
    /deep/ .image {
      width: 128px;
      height: 79px;
    }
  }
}
.wap-con {
  &.big-pic {
    /deep/ .image {
      width: 237px;
      height: 79px;
    }
  }
  &.pic-sets {
    /deep/ .image {
      width: 79px;
      height: 79px;
    }
  }
}
</style>

<style lang="scss">
.ad-preview-popover {
  padding: 0;
  border: 0;
  border-radius: 0px;

  &.el-popper {
    .popper__arrow,
    .popper__arrow::after {
      border-bottom-color: #a2a2a2;
    }
  }
}
</style>
