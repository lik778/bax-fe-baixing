
<template>
  <el-dialog title="新增用户" v-model="visible" size="large">
    <el-form ref="form" :model="user" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="user.name" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="user.email" />
      </el-form-item>
      <el-form-item label="号码">
        <el-input v-model="user.mobile" />
      </el-form-item>
      <el-form-item label="角色">
        <bax-select :options="[]" @change="() => {}" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import BaxSelect from 'com/common/select'

import { createUser } from './action'

export default {
  name: 'create-user-dialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      user: {}
    }
  },
  components: {
    BaxSelect
  },
  methods: {
    async submit() {
      const { user } = this
      await createUser(user)

      this.user = {}

      this.$emit('created')
      this.$emit('hide')
    },
    async cancel() {
      this.user = {}
      this.$emit('hide')
    }
  }
}

</script>

<style scoped>

</style>
