<template>
  <uploader
    ref="uploader"
    @upload-success="handleUploadSuccess"
  >
    <div
      v-if="imageUrl"
      class="upload-image-wrapper"
      @mouseenter="popoverVisible = true"
    >
      <div
        class="popover"
        v-show="popoverVisible"
        @mouseleave="popoverVisible = false"
      >
        <i class="el-icon-zoom-in" @click="openViewer"></i>
        <i class="el-icon-upload" @click="uploadFile"></i>
      </div>
      <img
        :width="width"
        height="100px"
        :src="imageUrl"
      />
      <image-viewer
        :z-index="2000"
        v-show="showViewer"
        :on-close="closeViewer"
        :url-list="[imageUrl]"
      />
    </div>
    <i v-else class="el-icon-plus upload-btn" @click="uploadFile"/>
  </uploader>
</template>

<script>
import Uploader from '../common/image-uploader'
import ImageViewer from '../common/image-viewer'

export default {
  name: 'image-uploader',
  components: {
    Uploader,
    ImageViewer
  },
  data () {
    return {
      url: '',
      showViewer: false,
      popoverVisible: false
    }
  },
  props: {
    width: {
      type: String,
      default: '100px'
    },
    value: String
  },
  computed: {
    imageUrl () {
      return this.url || this.value
    }
  },
  methods: {
    uploadFile () {
      this.$refs.uploader.uploadFile()
    },
    openViewer () {
      this.showViewer = true
    },
    closeViewer () {
      this.showViewer = false
    },
    handleUploadSuccess (urls) {
      this.url = urls[0]
      this.$emit('input', this.url)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-image-wrapper {
  position: relative;
  & > .popover {
    z-index: 1;
    position: absolute;
    display: flex;
    background-color: rgba(0, 0, 0, 0.6);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    & > i {
      font-size: 28px;
      color: #fff;
      margin-right: 10px;
    }
  }
}
.upload-btn {
  width: 100px;
  height: 100px;
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
</style>
