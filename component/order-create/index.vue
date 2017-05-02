
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
        <el-form-item v-if="isOperator || isAgentAccounting" label="销售人员">
          <user-selector v-model="newOrder.salesId" clearable />
        </el-form-item>
        <el-form-item v-if="isOperator || isBxSales" label="广告客户">
          <span>
            <user-selector v-model="newOrder.userId" clearable />
            <i class="el-icon-plus"
              @click="showCreateUserDialog = true" />
          </span>
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
    <category-selector :all-categories="allCategories"
      :visible="categoryDialogVisible"
      @success="categoryDialogVisible = false"
      @cancel="categoryDialogVisible = false" />
    <area-selector :all-areas="allAreas"
      :visible="areaDialogVisible"
      @success="areaDialogVisible = false"
      @cancel="areaDialogVisible = false" />
    <create-user :visible="showCreateUserDialog"
      :all-roles="allRoles"
      @hide="showCreateUserDialog = false" />
  </div>
</template>

<script>

import CategorySelector from 'com/common/category-selector'
import UserSelector from 'com/common/user-selector'
import AreaSelector from 'com/common/area-selector'
import CreateUser from 'com/common/create-user'
import BaxSelect from 'com/common/select'
import Topbar from 'com/topbar'

import 'rxjs/add/operator/debounceTime'
import { Subject } from 'rxjs/Subject'
import { Message } from 'element-ui'
import moment from 'moment'
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
  getAds
} from './action'

const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD')

const emptyOrder = {
  adId: '',
  categories: [],
  cities: [],
  onlineAt: now(),
  offlineAt: tomorrow,
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
    allRoles: {
      type: Array,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    CategorySelector,
    UserSelector,
    AreaSelector,
    CreateUser,
    BaxSelect,
    Topbar
  },
  data() {
    return {
      categoryDialogVisible: false,
      areaDialogVisible: false,

      showCreateUserDialog: false,
      newOrder: clone(emptyOrder)
    }
  },
  computed: {
    adOpts() {
      return this.ads.map(ad => ({
        label: ad.id + ' ' + ad.slotCode,
        value: ad.id
      }))
    },
    currentRoles() {
      const { userInfo } = this

      const { roles = [] } = userInfo

      return roles.map(r => r.nameEn)
    },
    isOperator() {
      return this.currentRoles.includes('NORMAL_OPERATOR')
    },
    isAgentAccounting() {
      return this.currentRoles.includes('AGENT_ACCOUNTING')
    },
    isBxSales() {
      return this.currentRoles.includes('BAIXING_SALES')
    }
  },
  async mounted() {
    await Promise.all([
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
      const { newOrder, userInfo } = this

      const data = {
        ...clone(newOrder),
        offlineAt: toTimestamp(newOrder.offlineAt),
        onlineAt: toTimestamp(newOrder.onlineAt)
      }

      const relatedOrderId = this.$route.query.relatedOrderId
      if (relatedOrderId) {
        data.relatedOrderId = relatedOrderId
      }

      if (this.isBxSales) {
        data.salesId = userInfo.id
      }

      if (this.isAgentAccounting) {
        data.userId = userInfo.id
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
  },
  updated() {
    console.debug('updated - create order')
  }
}

</script>

<style scoped>

@import '../../cssbase/var';

.el-icon-plus {
  border: 1px solid var(--c-gray);
  border-radius: 3px;
  padding: 8px;
  cursor: pointer;
}

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
