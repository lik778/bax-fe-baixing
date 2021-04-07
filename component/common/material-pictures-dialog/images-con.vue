<template>
  <div class="images-con">
    <!-- 上传按钮 -->
    <uploader
      v-bind="$attrs"
      ref="uploader"
      class="uploader-container"
      :uploadOptions="{
        maxFileSize: 2048,
        types: ['image/jpeg', 'image/jpg', 'image/png']
      }"
      :multiple="true"
      @upload-success="handleUploadSuccess">
      <el-button
        class="upload-btn"
        :disabled="value.length >= limit"
        @click="$evt => uploadFile()">
        <i class="el-icon el-icon-plus" />
      </el-button>
    </uploader>
    <!-- 图片容器 -->
    <div class="images">
      <div
        v-for="(image, idx) in value"
        class="image-wrapper"
        :key="image.url+idx">
        <img class="image" :src="image.url"/>
        <span class="status-bar" :class="getStatusClass(image.status)">
          <span class="image-name" v-text="image.desc" />
          <span class="status-text" />
        </span>
        <span class="actions">
          <i
            class="el-icon el-icon-edit"
            title="重命名"
            @click="renameFile(image, idx)"
          />
          <i
            class="el-icon el-icon-scissors"
            title="裁剪"
            @click="clipFile(image, idx)"
          />
          <i
            class="el-icon el-icon-delete"
            title="删除"
            @click="deleteFile(idx)"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  MATERIAL_PIC_TYPE,
  MATERIAL_PIC_STATUS,
  MATERIAL_PIC_AUDIT_TYPE
} from 'constant/fengming'
import Uploader from 'com/common/image-uploader-with-crop'
import { base64ToBin } from 'util'

export default {
  name: 'SearchImgView',
  components: {
    Uploader
  },
  props: {
    value: Array,
    limit: Number
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      popoverVisible: false,
      MATERIAL_PIC_TYPE,
      MATERIAL_PIC_STATUS,
      MATERIAL_PIC_AUDIT_TYPE
    }
  },
  watch: {
    value: {
      deep: true,
      handler (newValue) {
        this.$emit('change', newValue)
      }
    }
  },
  methods: {
    handleUploadSuccess (results) {
      results.forEach(res => {
        const getRandName = () => String(+new Date()) + String(Math.random()).slice(-6)
        this.$emit('change', this.value.concat([{
          url: res.url,
          desc: res.filename || getRandName(),
          status: MATERIAL_PIC_STATUS.STATUS_PENDING_CREATE
        }]))
      })
    },
    uploadFile (...args) {
      this.$refs.uploader.uploadFile(...args)
    },
    deleteFile (idx) {
      this.$emit('change', [...this.value].splice(idx, 1))
    },
    renameFile (image) {
      this.$prompt('请输入图片名称', '重命名', {
        inputValue: image.desc,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        image.desc = value
      })
    },
    clipFile (img, idx) {
      const $img = new Image()
      $img.onerror = err => {
        throw new Error(err)
      }
      $img.onload = _ => {
        const { width, height } = $img
        const $cvs = document.createElement('canvas')
        $cvs.width = width
        $cvs.height = height
        const ctx = $cvs.getContext('2d')
        ctx.drawImage($img, 0, 0, width, height)
        const { u8arr, mime } = base64ToBin($cvs.toDataURL())
        const newFile = new File([u8arr], img.desc, { type: mime })
        this.uploadFile(newFile, ({ isSuccess }) => {
          if (isSuccess) {
            this.deleteFile(idx)
          }
        })
      }
      $img.setAttribute('crossOrigin', 'Anonymous')
      $img.src = img.url
    },

    /* Calculation */

    getStatusClass (s) {
      const statusIDX = [
        this.MATERIAL_PIC_AUDIT_TYPE.AUDITING,
        this.MATERIAL_PIC_AUDIT_TYPE.SUCCESS,
        this.MATERIAL_PIC_AUDIT_TYPE.FAILED
      ].findIndex(x => x.includes(s))

      return [
        'auditing',
        'success',
        'failed'
      ][statusIDX]
    }
  }
}
</script>

<style lang="scss" scoped>
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

    &.is-disabled {
      cursor: not-allowed;
    }
  }
  .images {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 11px;
  }
  .image-wrapper {
    position: relative;
    display: flex;
    border-radius: 2px;
    background: #f2f2f2;
    overflow: hidden;

    &:hover {
      .actions {
        opacity: 1;
      }
    }
    .actions {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      padding: 0 .3em;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      opacity: 0;
      transition: .2s;

      .el-icon {
        padding: 0 3.5px;
        cursor: pointer;
      }
    }
    .status-bar {
      position: absolute;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 1.5em;
      line-height: 1.5em;
      color: white;
      font-size: 12px;
      text-align: left;
      transition: bottom .2s;

      &.auditing {
        background: #35a5e4;
        .status-text::after {
          content: '审核中';
        }
      }
      &.success {
        background: #62b345;
        .status-text::after {
          content: '审核成功';
        }
      }
      &.failed {
        background: #ff6350;
        .status-text::after {
          content: '审核失败';
        }
      }
    }
    .image-name {
      display: inline-block;
      padding: 0 .3em;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      flex-shrink: 1;
    }
    .status-text {
      display: inline-block;
      flex-shrink: 0;
      width: 55px;
      height: 1.5em;
      text-align: center;
    }
  }
  .image {
    border-radius: 2px;
  }
}
</style>
