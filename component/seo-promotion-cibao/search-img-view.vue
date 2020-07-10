<template>
  <div class="search-img-view"
       :class="{'view-border': !!fileList.length}">
    <ul class="img-wrapper"
         v-if="fileList.length">
      <li class="img-panel"
           v-for="(file, index) in fileList"
           :key="index">
        <img class="img"
             :src="file" />
        <span class="upload-actions">
          <i class="el-icon-zoom-in"
             @click="openViewer(index)"></i>
          <i class="el-icon-delete"
             @click="deleteFile(index)"></i>
        </span>
      </li>
    </ul>
    <uploader ref="search-uploader"
              v-if="fileList.length <= SEARCH_IMAGES_MAX"
              :uploadOptions="{
                maxFileSize: 1024,
                types: ['image/jpeg', 'image/jpg']
              }"
              :multiple="true"
              class="uploader-container"
              @upload-success="handleUploadSuccess">
      <i class="el-icon-plus upload-btn"
         @click="uploadFile" />
    </uploader>
    <image-viewer :z-index="2000"
                  v-if="showViewer"
                  :on-close="closeViewer"
                  :initial-index="previewInitialIndex"
                  :url-list="fileList" />
  </div>
</template>

<script>
import Uploader from '../common/image-uploader'
import ImageViewer from 'element-ui/packages/image/src/image-viewer'

import { SEARCH_IMAGES_MAX } from 'constant/seo'

export default {
  name: 'SearchImgView',
  components: {
    Uploader,
    ImageViewer
  },
  props: {
    originalFileList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      showViewer: false,
      popoverVisible: false,
      fileList: this.originalFileList,
      previewInitialIndex: 0,

      SEARCH_IMAGES_MAX
    }
  },

  methods: {
    handleUploadSuccess(urls) {
      this.fileList = this.fileList.concat(urls)
      this.$emit('file', this.fileList)
    },
    uploadFile() {
      this.$refs['search-uploader'].uploadFile()
    },
    openViewer(index) {
      this.previewInitialIndex = index
      this.showViewer = true
    },
    closeViewer() {
      this.showViewer = false
    },
    deleteFile(index) {
      this.fileList.splice(index, 1)
      this.$emit('file', this.fileList)
    }
  },
  watch: {
    originalFileList(newVal) {
      this.fileList = this.fileList.concat(newVal)
    }
  }
}
</script>

<style lang="postcss" scoped>
.search-img-view {
  &.view-border {
    border: 1px solid #ebebeb;
    padding: 10px 0 0 10px;
    border-radius: 6px;
  }
  & > .img-wrapper {
    display: inline;
    vertical-align: top;
    & > .img-panel {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      width: 106px;
      height: 106px;
      border: 1px solid #c0ccda;
      transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
      cursor: pointer;
      margin-bottom: 10px;
      vertical-align: top;
      border-radius: 6px;
      overflow: hidden;
      &:hover {
        & .upload-actions {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 6px;
        }
      }
    }
    & .img {
      width: 100%;
      max-height: 100%;
    }
    & .upload-actions {
      display: none;
      text-align: center;
      & > i {
        font-size: 24px;
        color: #fff;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
  & > .uploader-container {
    display: inline-block;
    vertical-align: top;
    & .upload-btn {
      width: 106px;
      height: 106px;
      border-radius: 4px;
      border: 1px dashed #aaa;
      font-size: 38px;
      text-align: center;
      line-height: 100px;
      cursor: pointer;
      &:hover {
        background: #f6f6f6;
      }
    }
  }
}
</style>
