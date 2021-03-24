<template>
  <section class="editor">
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
              placement="bottom-start"
              trigger="click"
              popper-class="ad-preview-popover">
              <material-preview
                classname="pc-preview"
                src="https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png"
                :type="typename"
              />
              <span class="preview-tip" slot="reference">展现样式</span>
            </el-popover>
          </div>
          <div class="content">
            <div class="images-con ">
              <uploader>
                <el-button class="upload-btn" :disabled="disableByLimit('pc')">
                  <i class="el-icon el-icon-plus" />
                </el-button>
              </uploader>
              <div class="images">
                <img
                  v-for="(imageURL, idx) in forms.pc"
                  class="image"
                  :src="imageURL"
                  :key="'' + idx + imageURL"
                />
              </div>
            </div>
            <div class="tip-con">
              <p v-text="typeLimitTips.pc" />
              <p>支持JPG、PNG格式</p>
            </div>
          </div>
        </div>
        <div class="wap-con con" :class="[typename].join(' ')">
          <div class="header">
            <span class="title">手机端</span>
            <el-popover
              placement="bottom-end"
              trigger="click"
              popper-class="ad-preview-popover">
              <material-preview
                classname="wap-preview"
                src="https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png"
                :type="typename"
              />
              <span class="preview-tip" slot="reference">展现样式</span>
            </el-popover>
          </div>
          <div class="content">
            <div class="images-con">
              <uploader>
                <el-button class="upload-btn" :disabled="disableByLimit('wap')">
                  <i class="el-icon el-icon-plus" />
                </el-button>
              </uploader>
              <div class="images">
                <img
                  v-for="(imageURL, idx) in forms.wap"
                  class="image"
                  :src="imageURL"
                  :key="'' + idx + imageURL"
                />
              </div>
            </div>
            <div class="tip-con">
              <p v-text="typeLimitTips.wap" />
              <p>支持JPG、PNG格式</p>
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
import Uploader from 'com/common/uploader'
import MaterialPreview from './material-preview'

// 图集类型枚举
const MATERIAL_PIC_TYPE = {
  NO_PIC: 1,
  BIG_PIC: 2,
  PIC_SETS: 3
}

export default {
  name: 'qwt-material-pictures-editor',
  components: {
    Uploader,
    MaterialPreview
  },
  data () {
    return {
      MATERIAL_PIC_TYPE,
      CREATIVE_STATUS_REJECT,
      CREATIVE_STATUS_PENDING,
      forms: {
        type: 3,
        pc: [
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png',
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png',
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png',
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png'
        ],
        wap: [
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png',
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png',
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png'
        ]
      },
      config: {
        [MATERIAL_PIC_TYPE.NO_PIC]: {
          extraClass: 'no-pic',
          limit: { wap: 0, pc: 0 }
        },
        [MATERIAL_PIC_TYPE.BIG_PIC]: {
          extraClass: 'big-pic',
          limit: { wap: 1, pc: 1 }
        },
        [MATERIAL_PIC_TYPE.PIC_SETS]: {
          extraClass: 'pic-sets',
          limit: { wap: 3, pc: 4 }
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
    typeLimitTips () {
      return {
        pc: '比例1.61:1，最小323*200，每组需上传4张图片',
        wap: '比例1:1，最小200*200，每组需上传3张图片，'
      }
    }
  },
  methods: {
    clearPictures () {
      // todo 删除 OSS 上的图片
      this.forms.pc = []
      this.forms.wap = []
    },

    /* Calculation */

    curLimit (type) {
      return this.typeConfig.limit[type]
    },
    disableByLimit (type) {
      const formsLength = this.forms[type].length
      return formsLength >= this.curLimit(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor {
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
  .images-con {
    display: flex;
    gap: 11px;

    .upload-btn {
      align-self: flex-start;
      padding: 0;
      width: 79px;
      height: 79px;
      border: none;
      outline: none;
      border-radius: 2px;
      background: #F2F2F2;
      font-size: 27px;
      font-weight: lighter;
      line-height: 0;
      cursor: pointer;
    }
    .images {
      display: flex;
      flex-wrap: wrap;
      gap: 5px 11px;
    }
    .image {
      border-radius: 2px;
      background: #f2f2f2;
    }
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
    .image {
      width: 140px;
      height: 79px;
    }
  }
  &.pic-sets {
    .image {
      width: 128px;
      height: 79px;
    }
  }
}
.wap-con {
  &.big-pic {
    .image {
      width: 237px;
      height: 79px;
    }
  }
  &.pic-sets {
    .image {
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
}
</style>
