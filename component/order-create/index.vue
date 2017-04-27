
<template>
  <div class="create-order">
    <topbar :userInfo="userInfo">
      <label slot="title">新建订单</label>
    </topbar>
    <main>
      <el-form ref="form" :model="newOrder" label-width="120px">
        <el-form-item label="广告位">
          <bax-select :options="adOpts"
            v-model="newOrder.adId" />
        </el-form-item>
        <el-form-item label="城市">
          <bax-select :options="allAreas" multiple
            v-model="newOrder.cities" />
        </el-form-item>
        <el-form-item label="类目">
          <bax-select :options="allCategories" multiple
            v-model="newOrder.categories">
          </bax-select>
        </el-form-item>
        <el-form-item label="时段">
          <el-date-picker type="date" placeholder="上线时间"
            v-model="newOrder.onlineAt" />
          <el-date-picker type="date" placeholder="下线时间"
            v-model="newOrder.offlineAt" />
        </el-form-item>
        <el-form-item label="销售人员">
          <bax-select :options="userOpts"
            v-model="newOrder.salesId"
        </el-form-item>
        <el-form-item label="广告客户">
          <bax-select :options="userOpts"
            v-model="newOrder.userId"
        </el-form-item>
        <section class="ad-price" v-if="adPrice.originalPrice">
          <span>
            <label>原价:</label>
            <label>{{ adPrice.originalPrice | price }}</label>
          </span>
          <span>
            <label>折扣价:</label>
            <label>{{ adPrice.price | price }}</label>
          </span>
        </section>
        <el-form-item>
          <el-button>
            <router-link tag="p" :to="{ name: 'order-list' }">
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
import { Message } from 'element-ui'
import Topbar from 'com/topbar'

import clone from 'clone'

import {
  toTimestamp,
  centToYuan,
  now
} from 'utils'

import store from './store'

import {
  clearAdPrice,
  createOrder,
  getAdPrice,
  getUsers,
  getAds
} from './action'

const emptyOrder = {
  adId: '',
  categories: [],
  cities: [],
  onlineAt: now(),
  offlineAt: now(),
  salesId: '',
  userId: ''
}

export default {
  name: 'create-order',
  store,
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
      newOrder: clone(emptyOrder),
    }
  },
  computed: {
    userOpts() {
      return this.users.map(u => ({
        label: u.name,
        value: u.id
      }))
    },
    adOpts() {
      return this.ads.map(ad => ({
        label: ad.id + ' ' + ad.slotCode,
        value: ad.id
      }))
    }
  },
  async mounted() {
    await Promise.all([
      getUsers(),
      getAds()
    ])
  },
  watch: {
    newOrder: {
      handler(newOrder) {
        this.queryAdPrice(newOrder)
      },
      deep: true
    }
  },
  filters: {
    price(v) {
      return '￥' + centToYuan(v)
    }
  },
  methods: {
    empty() {
      this.newOrder = clone(emptyOrder)
      clearAdPrice()
    },
    async onQueryUsers(v) {
      await getUsers({name: v})
    },
    async queryAdPrice(newOrder) {
      const {
        categories,
        cities,

        offlineAt,
        onlineAt,
        adId
      } = newOrder

      const opts = {
        startAt: toTimestamp(onlineAt),
        endAt: toTimestamp(offlineAt),
        categories: [...categories],
        cities: [...cities],
        adId
      }

      if (opts.adId && opts.categories.length && opts.cities.length
        && opts.startAt && opts.endAt) {
          const price = await getAdPrice(opts.adId, opts)
        }
    },
    async onSubmit() {
      const { newOrder } = this

      const data = {
        ...newOrder,
        offlineAt: toTimestamp(newOrder.offlineAt),
        onlineAt: toTimestamp(newOrder.onlineAt)
      }

      const relatedOrderId = this.$route.query.relatedOrderId
      if (relatedOrderId) {
        data.relatedOrderId = relatedOrderId
      }

      const oid = await createOrder(data)

      this.empty()

      Message.success('创建成功')

      this.$router.push({
        name: 'order-info',
        params: {
          id: oid
        }
      })
    }
  }
}

</script>

<style scoped>

.create-order {
  padding: 0 35px;

  & > main {
    max-width: 680px;
  }

  & .ad-price {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    & > span {
      margin-right: 20px;
    }

    & > span {
      & > label:first-child {
        color: #5e6d82;
      }

      & > label:last-child {
        font-size: 22px;
        color: red;
      }
    }
  }
}

</style>
