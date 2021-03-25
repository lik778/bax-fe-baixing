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
      @upload-success="handleUploadSuccess"
    >
      <el-button
        class="upload-btn"
        :disabled="fileList.length >= limit"
        @click="uploadFile">
        <i class="el-icon el-icon-plus" />
      </el-button>
    </uploader>
    <!-- 图片容器 -->
    <div class="images">
      <div
        class="image-wrapper"
        v-for="(src, idx) in fileList"
        :key="src+idx">
        <img class="image" :src="src"/>
        <span class="upload-actions">
          <i class="el-icon el-icon-scissors" @click="clipFile(src, idx)" />
          <i class="el-icon el-icon-delete" @click="deleteFile(idx)" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Uploader from 'com/common/image-uploader-with-crop'

const simpEqual = (arr1, arr2) => {
  const lengthEqual = arr1.length === arr2.length
  const itemsEqual = !arr1.find((x, xi) => arr2[xi] !== x)
  return lengthEqual && itemsEqual
}

export default {
  name: 'SearchImgView',
  components: {
    Uploader
  },
  props: {
    limit: Number,
    value: Array
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      popoverVisible: false,
      fileList: this.value
    }
  },
  watch: {
    value (newVal) {
      this.fileList = newVal
    },
    fileList (newValue) {
      if (!simpEqual(newValue, this.value)) {
        this.$emit('change', newValue)
      }
    }
  },
  methods: {
    handleUploadSuccess (urls) {
      this.fileList = this.fileList.concat(urls)
    },
    uploadFile () {
      this.$refs.uploader.uploadFile()
    },
    clipFile (src, idx) {
      console.log(src, idx)
    },
    deleteFile (index) {
      this.fileList.splice(index, 1)
    },
    result (res) {
      console.log('res: ', res)
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
