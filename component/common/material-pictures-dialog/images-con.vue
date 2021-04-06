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
        <span class="upload-actions">
          <i
            class="el-icon el-icon-scissors"
            title="裁剪"
            @click="clipFile(image.url, idx)"
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
      popoverVisible: false
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
    handleUploadSuccess (url) {
      this.$emit('change', this.value.concat([{
        desc: String(+new Date()) + String(Math.random()).slice(-6),
        url: url[0]
      }]))
    },
    uploadFile (...args) {
      this.$refs.uploader.uploadFile(...args)
    },
    deleteFile (index) {
      this.$emit('change', [...this.value].splice(index, 1))
    },
    clipFile (url, idx) {
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
        const newFile = new File([u8arr], '图片', { type: mime })
        this.uploadFile(newFile, ({ isSuccess }) => {
          if (isSuccess) {
            this.deleteFile(idx)
          }
        })
      }
      $img.setAttribute('crossOrigin', 'Anonymous')
      $img.src = url
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
  }
  .image {
    border-radius: 2px;
  }
}
.upload-actions {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0 .3em;
  height: 1.5em;
  background: rgba(0, 0, 0, 0.5);
  color: white;

  .el-icon {
    padding: 3px;
    cursor: pointer;
  }
}
</style>
