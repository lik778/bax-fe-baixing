<template>
  <div>
    <uploader
      ref="rawUploader"
      v-bind="$attrs"
      v-on="$listeners"
      :beforeUpload="crop">
      <slot />
    </uploader>
    <!-- 图片裁剪 -->
    <el-dialog
      title="裁剪"
      append-to-body
      :visible="visible.clipDialog">
      <vue-croppie
        ref="croppieRef"
        :showZoomer="true"
        :enableResize="false"
        :boundary="{ width: 600, height: 400 }"
        :viewport="viewport"
        @result="result"
      />
      <img v-bind:src="cropped">
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeClipDialog">取 消</el-button>
        <el-button type="primary" @click="confirmCrop">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Uploader from 'com/common/image-uploader'

const base64ToImgBin = url => {
  const arr = url.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return {
    u8arr,
    mime
  }
}

export default {
  components: {
    Uploader
  },
  props: ['cropOptions'],
  data () {
    return {
      viewport: this.cropOptions || {},
      cropped: null,
      resResolve: '',
      visible: {
        clipDialog: false
      }
    }
  },
  watch: {
    cropOptions (newVal) {
      this.viewport = newVal || {}
    }
  },
  methods: {
    result (output) {
      this.cropped = output
    },
    async crop (file) {
      return await new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = e => {
          const res = e.target.result
          this.visible.clipDialog = true
          this.$nextTick(async () => {
            this.$refs.croppieRef.bind({
              url: res
            })
            this.resResolve = resolve
          })
        }
        reader.readAsDataURL(file)
      })
    },
    async confirmCrop () {
      this.$refs.croppieRef.result({
        type: 'base64',
        size: this.cropOptions,
        format: 'jpeg'
      }, output => {
        const { u8arr, mime } = base64ToImgBin(output)
        this.resResolve(
          new File([u8arr], 'test', {
            type: mime
          })
        )
        this.closeClipDialog()
      })
    },
    closeClipDialog () {
      this.visible.clipDialog = false
    },
    uploadFile () {
      this.$refs.rawUploader.uploadFile()
    }
  }
}
</script>
