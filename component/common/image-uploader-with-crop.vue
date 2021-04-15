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
      :show-close="false"
      :width="(boundary.width + 75) + 'px'"
      :visible="visible.clipDialog">
      <vue-croppie
        ref="croppieRef"
        :showZoomer="true"
        :enableResize="false"
        :boundary="boundary"
        :viewport="viewport"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeClipDialog">取 消</el-button>
        <el-button type="primary" @click="confirmCrop">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Uploader from 'com/common/image-uploader'
import { base64ToBin } from 'util'

export default {
  components: {
    Uploader
  },
  props: ['cropOptions'],
  data () {
    return {
      viewport: this.cropOptions || {},
      resResolve: '',
      store: {
        imageName: ''
      },
      visible: {
        clipDialog: false
      }
    }
  },
  computed: {
    boundary () {
      const max = 1080
      const min = 100
      const safe = n => Math.max(Math.min(n, max), min)
      return {
        width: safe(this.viewport.width * 2),
        height: safe(this.viewport.height * 2)
      }
    }
  },
  watch: {
    cropOptions (newVal) {
      this.viewport = newVal || {}
    }
  },
  methods: {
    async crop (file) {
      this.store.imageName = file.name
      return await new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = e => {
          const res = e.target.result
          this.visible.clipDialog = true
          this.resResolve = resolve
          this.$nextTick(() => {
            this.$refs.croppieRef.bind({
              url: res
            })
          })
        }
        reader.onerror = err => {
          throw new Error(err)
        }
        reader.readAsDataURL(file)
      }).catch(error => {
        console.error(error)
        this.visible.clipDialog = false
        this.$message.error('文件读取失败，请换一张图片重试')
        throw new Error(error)
      })
    },
    async confirmCrop () {
      this.$refs.croppieRef.result({
        type: 'base64',
        size: this.cropOptions,
        format: 'jpeg'
      }, output => {
        const { u8arr, mime } = base64ToBin(output)
        this.resResolve(
          new File([u8arr], this.store.imageName, {
            type: mime
          })
        )
        this.closeClipDialog()
      })
    },
    closeClipDialog () {
      this.visible.clipDialog = false
    },
    uploadFile (...args) {
      this.$refs.rawUploader.uploadFile(...args)
    }
  }
}
</script>
