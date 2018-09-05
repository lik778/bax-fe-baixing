
<template>
  <div class="uploader">
    <input type="file" ref="file" @change="uploadFile" hidden />
    <el-button @click="selectFile">+</el-button>
    <p class="tip" v-if="tip">
      {{ tip }}
    </p>
  </div>
</template>

<script>
import { getUpyunToken } from 'api/material'
import { upyun } from 'config'

import {
  getImageSizeWarnTip,
  getImageInfo
} from 'util/kit'

import { extname } from 'path'
import Fetch from 'fetch.io'
import uuid from 'uuid/v4'

const {
  filehost: upyunFileHost,
  host: upyunHost,
  bucket
} = upyun

// https://fetch.spec.whatwg.org/#cors-protocol-and-credentials
const request = new Fetch({
  mode: 'cors',
  credentials: 'omit',
  prefix: upyunHost
})

export default {
  name: 'uploader',
  props: {
    sizeLimit: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tip: ''
    }
  },
  methods: {
    selectFile() {
      this.$refs.file.click()
    },
    async uploadFile(e) {
      const file = this.$refs.file.files[0]

      if (!file) {
        return
      }

      const ext = extname(file.name)
      const name = 'bax-img-' + uuid() + ext

      if (!['.jpeg', '.jpg', '.png', '.gif', '.webp'].includes(ext)) {
        this.tip = '仅允许上传图片文件 (png, gif, jpeg, jpg, webp 等)'
        return
      }

      if (this.sizeLimit) {
        const { height, width } = await getImageInfo(file)
        const { width: w, height: h } = this.sizeLimit
        this.tip = getImageSizeWarnTip(width, height, w, h)
      }

      // 15 min 过期
      const expiration = (Date.now() / 1000 | 0) + 15 * 60 // 秒

      this.$emit('start')
      // TODO - emit error
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

      this.$emit('success', upyunFileHost + filePath)
    }
  }
}
</script>

<style lang="postcss" scoped>

.uploader {
  display: flex;
  align-items: center;
}

.tip {
  margin-left: 10px;
  color: red;
  font-size: 12px;
  line-height: 14px;
}

</style>
