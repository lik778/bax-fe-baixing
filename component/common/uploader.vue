
<template>
  <div>
    <input type="file" ref="file" @change="uploadFile" hidden />
    <el-button @click="selectFile">+</el-button>
  </div>

</template>

<script>

import { getQiniuToken } from 'api/material'
import { qiniuHost } from 'config'

import { extname } from 'path'
import Fetch from 'fetch.io'
import uuid from 'uuid/v4'

const request = new Fetch({
  prefix: '//upload.qiniu.com',
  credentials: 'cors'
})

export default {
  name: 'uploader',
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

      const token = await getQiniuToken()

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

<style>

</style>
