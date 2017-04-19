
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
        <bax-select :options="roleOpts" multiple
          @change="v => user.roles = v" />
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
import { Message } from 'element-ui'

import { createUser } from './action'

export default {
  name: 'create-user-dialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    allRoles: {
      type: Array,
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
  computed: {
    roleOpts() {
      return this.allRoles.map(r => ({
        label: r.name,
        value: r.id
      }))
    }
  },
  methods: {
    async submit() {
      const { user } = this

      const { password } = await createUser(user)

      Message.success('创建成功')

      console.info('password:', password)

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
