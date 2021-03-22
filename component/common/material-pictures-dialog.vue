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
        <div class="pc-con con">
          <div class="header">
            <span class="title">电脑端</span>
            <el-popover
              placement="bottom-start"
              trigger="click"
              :popper-class="[typename, 'ad-preview-popover']">
              <div class="ad-preview pc-preview">
                <div class="title">多图组件，图文结合，更丰富的信息呈现</div>
                <div class="creative-con">
                  <img class="creative-image" src="https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png" />
                  <div class="creative-text">
                    快速帮助您提升图片数量、质量、降低客户管理成本，提升相关性深度，展示品牌、业务、优势等信息。
                  </div>
                </div>
                <div class="footer">
                  <span class="url">baixing.com</span>
                  <span class="btn-like">评价</span>
                  <span class="btn-like">广告</span>
                </div>
              </div>
              <span class="preview-tip" slot="reference">展现样式</span>
            </el-popover>
          </div>
          <div class="content">
            <div class="images-con">
              <uploader>
                <el-button class="upload-btn">
                  <i class="el-icon el-icon-plus" />
                </el-button>
              </uploader>
              <div class="images">
                <img
                  v-for="(imageURL, idx) in forms.pc"
                  class="image"
                  :src="imageURL"
                  :style="typeLimitImageStyle.pc"
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
        <div class="wap-con con">
          <div class="header">
            <span class="title">手机端</span>
            <el-popover
              placement="bottom-end"
              trigger="click"
              :popper-class="[typename, 'ad-preview-popover']">
              <div class="ad-preview wap-preview">
                <div class="title">多图组件，图文结合，更丰富的信息呈现</div>
                <div class="creative-con">
                  <img class="creative-image" src="https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png" />
                  <div class="creative-text">
                    快速帮助您提升图片数量、质量、降低客户管理成本，提升相关性深度，展示品牌、业务、优势等信息。
                  </div>
                </div>
                <div class="footer">
                  <span class="url">baixing.com</span>
                  <span class="btn-like">评价</span>
                  <span class="btn-like">广告</span>
                </div>
              </div>
              <span class="preview-tip" slot="reference">展现样式</span>
            </el-popover>
          </div>
          <div class="content">
            <div class="images-con">
              <uploader>
                <el-button class="upload-btn">
                  <i class="el-icon el-icon-plus" />
                </el-button>
              </uploader>
              <div class="images">
                <img
                  v-for="(imageURL, idx) in forms.wap"
                  class="image"
                  :src="imageURL"
                  :style="typeLimitImageStyle.wap"
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

// 图集类型枚举
const MATERIAL_PIC_TYPE = {
  NO_PIC: 1,
  BIG_PIC: 2,
  PIC_SETS: 3
}

export default {
  name: 'qwt-material-pictures-editor',
  components: {
    Uploader
  },
  data () {
    return {
      MATERIAL_PIC_TYPE,
      CREATIVE_STATUS_REJECT,
      CREATIVE_STATUS_PENDING,
      forms: {
        type: 2,
        pc: [
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png',
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png',
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png'
        ],
        wap: [
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png',
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png',
          'https://baxing-lionad.oss-cn-shanghai.aliyuncs.com/spark.png'
        ]
      }
    }
  },
  computed: {
    showPicContainer () {
      return [
        this.MATERIAL_PIC_TYPE.BIG_PIC,
        this.MATERIAL_PIC_TYPE.PIC_SETS
      ].includes(this.forms.type)
    },
    typeLimitImageStyle () {
      let pcWidth, pcHeight
      let wapWidth, wapHeight
      switch (this.forms.type) {
        case this.MATERIAL_PIC_TYPE.NO_PIC:
          pcWidth = pcHeight = wapWidth = wapHeight = '0px'
          break
        case this.MATERIAL_PIC_TYPE.BIG_PIC:
          pcWidth = '140px'
          pcHeight = '79px'
          wapWidth = '237px'
          wapHeight = '79px'
          break
        case this.MATERIAL_PIC_TYPE.PIC_SETS:
          pcWidth = '128px'
          pcHeight = '79px'
          wapWidth = '79px'
          wapHeight = '79px'
          break
      }
      return {
        pc: {
          width: pcWidth,
          height: pcHeight
        },
        wap: {
          width: wapWidth,
          height: wapHeight
        }
      }
    },
    typeLimitTips () {
      return {
        pc: '比例1.61:1，最小323*200，每组需上传4张图片',
        wap: '比例1:1，最小200*200，每组需上传3张图片，'
      }
    },
    typename () {
      return {
        [this.MATERIAL_PIC_TYPE.NO_PIC]: 'no-pic',
        [this.MATERIAL_PIC_TYPE.BIG_PIC]: 'big-pic',
        [this.MATERIAL_PIC_TYPE.PIC_SETS]: 'pic-sets'
      }[this.forms.type]
    }
  },
  methods: {
    clearPictures () {
      // todo 删除 OSS 上的图片
      this.forms.pc = []
      this.forms.wap = []
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
</style>

<style lang="scss">
.ad-preview-popover {
  padding: 0;
  border: 0;
  border-radius: 0px;

  &.big-pic {
    .pc-preview {
      .creative-con {
        width: 475px;
        height: 110px;

        .creative-image {
          width: 168px;
          height: 95px;
        }
      }
    }
    .wap-preview {
      .creative-con {
        flex-direction: column;
        padding: 0;
        width: 388px;
        background: unset;

        .creative-image {
          width: 388px;
          height: 136px;
        }
        .creative-text {
          padding: 0 7px;
        }
      }
    }
  }

  .ad-preview {
    display: flex;
    flex-direction: column;
    padding: 6px;
    width: 100%;
    background: #a2a2a2;

    .title {
      padding-left: 7px;
      line-height: 37px;
      color: #333;
    }
    .creative-con {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 8px;
      background: white;

      .creative-image {
        flex-shrink: 0;
      }
      .creative-text {
        font-size: 14px;
        color: #5b5b5b;
      }
    }
    .footer {
      height: 35px;
      line-height: 45px;
      font-size: 12px;
      color: #666;

      .url {
        margin-left: 7px;;
        margin-right: 13px;
      }
      .btn-like {
        margin-right: 7px;
      }
    }
  }
}
</style>
