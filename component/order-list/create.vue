
<template>
  <div class="create-order">
    <topbar :userInfo="userInfo">
      <label slot="title">新建订单</label>
    </topbar>
    <main>
      <el-form ref="form" :model="newOrder" label-width="120px">
        <el-form-item label="广告位">
          <el-input v-model="newOrder.adId"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <bax-select :options="allAreas" multiple
            @change="v => newOrder.cities = v">
          </bax-select>
        </el-form-item>
        <el-form-item label="类目">
          <bax-select :options="allCategories" multiple
            @change="v => newOrder.categories = v">
          </bax-select>
        </el-form-item>
        <el-form-item label="时段">
          <el-date-picker type="datetime" placeholder="上线时间"
            v-model="newOrder.onlineAt" />
          <el-date-picker type="datetime" placeholder="下线时间"
            v-model="newOrder.offlineAt" />
        </el-form-item>
        <el-form-item label="销售人员">
          <el-input v-model="newOrder.salesId"></el-input>
        </el-form-item>
        <el-form-item label="广告客户">
          <el-input v-model="newOrder.userId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button>
            <router-link tag="p" to="/orders">
              取消
            </router-link>
          </el-button>
          <el-button type="primary" @click="onSubmit">
            确认
          </el-button>
        </el-form-item>
      </el-form>
    </main>
  </div>
</template>

<script>

import BaxSelect from 'com/common/select'
import Topbar from 'com/topbar'

import { toTimestamp } from 'utils'

import {
  createOrder
} from './action'

export default {
  name: 'create-order',
  props: {
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    BaxSelect,
    Topbar
  },
  data() {
    return {
      newOrder: {
      }
    }
  },
  methods: {
    async onSubmit() {
      const { newOrder } = this

      const data = {
        ...newOrder,
        offlineAt: toTimestamp(newOrder.offlineAt),
        onlineAt: toTimestamp(newOrder.onlineAt)
      }

      await createOrder(data)
    }
  }
}

</script>

<style scoped>

.create-order {
  & > main {
    max-width: 680px;
  }
}

</style>
