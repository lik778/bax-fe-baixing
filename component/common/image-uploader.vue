<template>
  <div class="upload-container" v-loading.fullscreen="loading">
    <input
      hidden
      ref="file"
      type="file"
      style="display: none"
      :multiple="multiple"
      @change="handleFileChange"
    />
    <slot name="default"></slot>
  </div>
</template>

<script>
import uuid from 'uuid/v4'
import Fetch from 'fetch.io'
import { upyun } from 'config'
import { extname } from 'path'
import { getUpyunToken } from 'api/material'

const { filehost: upyunFileHost, host: upyunHost, bucket } = upyun

const request = new Fetch({
  mode: 'cors',
  credentials: 'omit',
  prefix: upyunHost
})

async function uploadFile (file) {
  if (!file) {
    return
  }

  const ext = extname(file.name)
  const name = 'sst-img' + uuid() + ext

  const expiration = ((Date.now() / 1000) | 0) + 15 * 60
  const { policy, sign } = await getUpyunToken({
    saveKey: name,
    expiration,
    bucket
  })

  const { url: filePath } = await request
    .post('/' + bucket)
    .append('file', file)
    .append('bucket', bucket)
    .append('policy', policy)
    .append('signature', sign)
    .append('save-key', name)
    .append('expiration', expiration)
    .json()

  return upyunFileHost + filePath
}

const checkUploadFiles = function (files, options) {
  return new Promise(resolve => {
    files.forEach(file => {
      if (file > options.maxFileSize * 1024) {
        resolve([`超过最大上传的文件大小${options.maxFileSize}`])
      }
      if (!options.types.includes(file.type)) {
        resolve(['不支持上传的文件格式'])
      }
    })
    resolve([null, 'success'])
  })
}

export default {
  name: 'uploader',
  props: {
    uploadOptions: {
      type: Object,
      default () {
        return {
          maxFileSize: {
            // kb
            default: 2048
          },
          autoUpload: false,
          types: [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/gif',
            'image/webp'
          ]
        }
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    beforeUpload: Function
  },
  data () {
    return {
      loading: false,
      callback: null
    }
  },
  methods: {
    async handleFileChange (e) {
      const { uploadOptions, beforeUpload } = this
      const wash = beforeUpload || (async _ => _)
      // TODO refactor await of
      const files = await Promise.all(
        Array.from(e.target.files).map(async x => {
          return await wash(x)
        })
      ).then(list => list)
      if (!files.length) return

      const [error] = await checkUploadFiles(files, uploadOptions)
      if (error) {
        return this.$message.error(error)
      }
      this.$emit('before-upload', e.target.files)
      try {
        this.loading = true
        const uploadResult = await Promise.all(files.map(uploadFile))
        this.$emit('upload-success', uploadResult)
        this.callback && this.callback({
          res: uploadResult,
          isSuccess: true
        })
      } catch (err) {
        this.$emit('upload-failed', err)
        this.callback && this.callback({
          isSuccess: false,
          err
        })
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    uploadFile (files, callback) {
      this.callback = callback
      if (!files) {
        this.$refs.file.click()
      } else {
        this.handleFileChange({
          target: {
            files: files instanceof Array
              ? files
              : [files]
          }
        })
      }
    }
  }
}
</script>
