
<template>
  <div class="create-order">
    <topbar :userInfo="userInfo">
      <label slot="title">新建订单</label>
    </topbar>
    <main>
      <el-form ref="form" :model="newOrder" label-width="120px">
        <el-form-item label="广告位">
          <bax-select :options="adOpts"
            @change="v => newOrder.adId = v" />
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
        <section class="ad-price" v-if="adPrice">
          <label>价格:</label>
          <span>{{ '￥' + adPrice }}</span>
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

import { getAdPrice } from 'api/ad'
import {
  toTimestamp,
  centToYuan
} from 'utils'

import store from './store'

import {
  createOrder,
  getAds
} from './action'

const emptyOrder = {
  adId: 0,
  categories: [],
  cities: [],
  onlineAt: Date.now(),
  offlineAt: Date.now(),
  salesId: 0,
  userId: 0
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
      newOrder: {...emptyOrder},
      adPrice: ''
    }
  },
  computed: {
    adOpts() {
      return this.ads.map(ad => ({
        label: ad.id + ' ' + ad.slotCode,
        value: ad.id
      }))
    }
  },
  async mounted() {
    await getAds()
  },
  watch: {
    newOrder: {
      handler(newOrder) {
        this.queryAdPrice(newOrder)
      },
      deep: true
    }
  },
  methods: {
    empty() {
      this.newOrder = {...emptyOrder}
      this.adPrice = ''
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
          this.adPrice = centToYuan(price)
        }
    },
    async onSubmit() {
      const { newOrder } = this

      const data = {
        ...newOrder,
        offlineAt: toTimestamp(newOrder.offlineAt),
        onlineAt: toTimestamp(newOrder.onlineAt)
      }

      await createOrder(data)

      this.empty()

      Message.success('创建成功')

      this.$router.push({
        name: 'order-list'
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

    & > label {
      color: #5e6d82;
    }

    & > span {
      font-size: 22px;
      color: red;
    }
  }
}

</style>
