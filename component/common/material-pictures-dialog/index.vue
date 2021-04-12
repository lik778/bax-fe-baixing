<template>
  <section class="material-pictures-editor">
    <aside class="label">
      创意配图:
    </aside>
    <span>
      <el-radio-group v-model="forms.type" @change="confirmClearPictures">
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
              :key="forms.type"
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
              :key="forms.type"
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
  CREATIVE_STATUS_PENDING,
  MATERIAL_PIC_TYPE,
  MATERIAL_PIC_STATUS,
  MATERIAL_PIC_AUDIT_TYPE
} from 'constant/fengming'
import ImagesCon from './images-con'
import Preview from './preview'
import { deepClone, isArrHasSameValue } from 'util'

export default {
  name: 'material-pictures-editor',
  props: {
    value: Object,
    initValue: {
      default () {
        return {
          image_type: 1,
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
      MATERIAL_PIC_STATUS,
      MATERIAL_PIC_AUDIT_TYPE,
      forms: {
        type: null,
        pc: [],
        wap: []
      },
      formsRaw: {},
      store: {
        type: null
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
              minWidth: 800,
              minHeight: 267,
              ratio: '3:1'
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
      ].includes(this.store.type)
    },
    typeConfig () {
      return this.config[this.store.type]
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
      const type = newVal.image_type || MATERIAL_PIC_TYPE.NO_PIC
      this.store.type = type
      this.forms = {
        type,
        pc: (newVal?.pc?.length >= 1) ? deepClone(newVal.pc) : [],
        wap: (newVal?.wap?.length >= 1) ? deepClone(newVal.wap) : []
      }
      this.formsRaw = {
        type,
        pc: [...this.forms.pc],
        wap: [...this.forms.wap]
      }
    },
    forms: {
      deep: true,
      handler (newValue) {
        this.$emit('change', this.genData(newValue))
      }
    }
  },
  methods: {
    confirmClearPictures (newVal) {
      const isEqual = (arrA, arrB) => {
        const isSameImage = (x, y) => {
          /* eslint-disable */
          return x.url === y.url &&
            x.id == y.id &&
            x.desc == y.desc
          /* eslint-enable */
        }
        return isArrHasSameValue(arrA, arrB, isSameImage)
      }

      const { pc, wap } = this.forms
      const { pc: pcRaw, wap: wapRaw } = this.formsRaw

      const changeFromInitsType = this.store.type === this.formsRaw.type
      const changeToInitsType = newVal === this.formsRaw.type
      // TODO refactor 逻辑优化
      const isChanged = changeToInitsType
        ? (pc.length || wap.length)
        : changeFromInitsType
          ? (!isEqual(pcRaw, pc) || !isEqual(wapRaw, wap))
          : (pc.length || wap.length)
      if (isChanged) {
        this.$confirm('当前修改将被丢弃！', '确认')
          .then(() => {
            this.store.type = newVal
            this.clearPictures()
            changeToInitsType && this.restoreToInits()
          })
          .catch(() => {
            this.forms.type = this.store.type
          })
      } else {
        this.clearPictures()
        this.store.type = newVal
        changeToInitsType && this.restoreToInits()
      }
    },
    restoreToInits () {
      const { type, pc = [], wap = [] } = this.formsRaw
      this.forms = {
        type,
        pc: [...pc],
        wap: [...wap]
      }
    },
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
          _raw: this.forms,
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
      width: 237px;
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
