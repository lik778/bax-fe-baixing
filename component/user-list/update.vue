
<template>
  <el-dialog title="更新用户" v-model="visible" size="large"
    :close-on-click-modal="false"
    @close="cancel">
    <el-form ref="form" :model="user" label-width="120px">
      <el-form-item label="名称" required>
        <el-input v-model="user.name" />
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

import { updateUser } from './action'

const emptyUser = {
  roles: []
}

export default {
  name: 'update-user-dialog',
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
      user: {
        roles: []
      }
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
      this.user = {
        ...emptyUser,
        roles: []
      }
    },
    async submit() {
      const { user } = this

      await updateUser({
        roles: [...user.roles]
      })

      Message.success('更新成功')

      this.empty()

      this.$emit('updated')
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
