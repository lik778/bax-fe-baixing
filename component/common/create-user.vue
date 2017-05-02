
<template>
  <el-dialog title="新增用户" v-model="visible" size="large"
    :close-on-click-modal="false"
    @close="cancel">
    <el-form ref="form" :model="user" label-width="120px">
      <el-form-item label="名称" required>
        <el-input v-model="user.name" />
      </el-form-item>
      <el-form-item label="邮箱" required>
        <el-input v-model="user.email" />
      </el-form-item>
      <el-form-item label="号码" required>
        <el-input v-model="user.mobile" />
      </el-form-item>
      <el-form-item label="角色" required>
        <bax-select :options="roleOpts" multiple
          v-model="user.roles" />
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
import clone from 'clone'

import { createUser } from 'api/account'

const emptyUser = {
  name: '',
  email: '',
  mobile: '',
  roles: []
}

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
      user: clone(emptyUser)
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
    empty() {
      this.user = clone(emptyUser)
    },
    async submit() {
      const { user } = this

      await createUser(user)

      Message.success('创建成功')

      this.empty()

      this.$emit('created')
      this.$emit('hide')
    },
    async cancel() {
      this.empty()
      this.$emit('hide')
    }
  }
}

</script>

<style scoped>

</style>
