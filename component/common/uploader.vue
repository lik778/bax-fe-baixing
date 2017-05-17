
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

import { getQiniuToken } from 'api/material'
import { qiniuHost } from 'config'

import {
  getImageSizeWarnTip,
  getImageInfo
} from 'util/kit'

import { extname } from 'path'
import Fetch from 'fetch.io'
import uuid from 'uuid/v4'

const request = new Fetch({
  prefix: '//upload.qiniu.com',
  credentials: 'cors'
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
      const name = uuid() + ext

      if (!['.jpeg', '.jpg', '.png', '.gif', '.webp'].includes(ext)) {
        this.tip = '仅允许上传图片文件 (png, gif, jpeg, jpg, webp 等)'
        return
      }

      if (this.sizeLimit) {
        const { height, width } = await getImageInfo(file)
        const { width: w, height: h } = this.sizeLimit
        this.tip = getImageSizeWarnTip(width, height, w, h)
      }

      const token = await getQiniuToken()

      this.$emit('start')
      // TODO - emit error

      const body = await request
        .post('/')
        .append('key', name)
        .append('file', file)
        .append('token', token)
        .json()

      this.$emit('success', qiniuHost + body.key)
    }
  }
}

</script>

<style scoped>

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
