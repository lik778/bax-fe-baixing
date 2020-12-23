
<template>
  <div class="create-order">
    <topbar :userInfo="userInfo">
      <label slot="title">
        {{ topTitle }}
      </label>
    </topbar>
    <main>
      <el-form ref="form" :model="newOrder" label-width="120px">
        <el-form-item label="广告位">
          <content class="select-ad">
            <div>
              <bax-select
                :options="adOpts"
                v-model="newOrder.adId"
              />
            </div>
            <img v-if="adExampleImg"
              v-bind:src="adExampleImg"
            />
          </content>
        </el-form-item>
        <el-form-item label="订单类型" v-if="isOperator">
          <bax-select :options="sspOrderTypeOpts"
            v-model="newOrder.sspOrderType">
          </bax-select>
        </el-form-item>
        <el-form-item label="城市">
          <span>
            <el-tag type="danger" closable
              v-for="c in newOrder.cities" :key="c"
              @close="removeArea(c)">
              {{ formatterArea(c) }}
            </el-tag>
          </span>
          <i class="el-icon-plus"
            @click="areaDialogVisible = true">
          </i>
        </el-form-item>
        <el-form-item label="类目">
          <span>
            <el-tag type="danger" closable
              v-for="c in newOrder.categories" :key="c"
              @close="removeCategory(c)">
              {{ formatterCategory(c) }}
            </el-tag>
          </span>
          <i class="el-icon-plus"
            @click="categoryDialogVisible = true"></i>
        </el-form-item>
        <el-form-item label="时段">
          <el-date-picker type="date" placeholder="上线时间"
            v-model="newOrder.onlineAt">
          </el-date-picker>
          <el-date-picker type="date" placeholder="下线时间"
            v-model="newOrder.offlineAt">
          </el-date-picker>
          <span v-if="adCalendarConflicting" class="conflict-tip">
            <i class="el-icon-warning"></i>
            <label>排期有冲突,</label>
            <a href="#ad-conflict">
              查看
            </a>
          </span>
        </el-form-item>
        <el-form-item v-if="isOperator || isAgentAccounting" label="销售人员">
          <span v-if="salesIdLocked">
            {{ salesDisplayName }}
          </span>
          <user-selector v-else v-model="newOrder.salesId">
          </user-selector>
        </el-form-item>
        <el-form-item v-if="isOperator || isBxSales" label="广告客户">
          <span v-if="clientIdLocked">
            {{ clientDisplayName }}
          </span>
          <span v-else>
            <user-selector v-model="newOrder.userId" clearable>
            </user-selector>
            <i v-if="allowAddUser" class="el-icon-plus"
              @click="showCreateUserDialog = true">
            </i>
          </span>
        </el-form-item>
        <section class="terms">
          <el-checkbox :value="true"></el-checkbox>
          <a v-bind:href="contractDocx"
            download="百姓网线上推广协议.docx">
            同意《百姓网线上推广协议》
          </a>
        </section>
        <section class="ad-price" v-if="adPrice.originalPrice">
          <span>
            <label>原价:</label>
            <label>{{ adPrice.originalPrice | price }}</label>
          </span>
          <span>
            <label>折扣价:</label>
            <label>{{ adPrice.price | price }}</label>
          </span>
          <span v-if="isAgentAccounting">
            <label>提单价:</label>
            <label>{{ adPrice.discountPrice | price }}</label>
          </span>
          <span v-if="adPriceDiscount">
            <label>折扣:</label>
            <p>{{ adPriceDiscount }}</p>
          </span>
        </section>
        <footer v-if="allowAddOrder">
          <el-button>
            <router-link tag="p" :to="{ name: 'order-list' }">
              取消
            </router-link>
          </el-button>
          <el-button type="primary" @click="onSubmit">
            确认
          </el-button>
        </footer>
        <a name="ad-conflict"
          v-bind:style="{display: adCalendarConflicting ? 'block' : 'none'}">
          <h3>排期冲突</h3>
          <ad-calendar @conflict="onAdConflict"
            :all-categories="allCategories"
            :all-areas="allAreas"
            :options="calendarOptions"
            :orders="orders">
          </ad-calendar>
        </a>
      </el-form>
    </main>
    <category-selector :all-categories="allCategories"
      :categories="newOrder.categories"
      :visible="categoryDialogVisible"
      @ok="onChangeOrderCategories"
      @cancel="categoryDialogVisible = false">
    </category-selector>
    <area-selector :all-areas="allAreas"
      :areas="newOrder.cities"
      :visible="areaDialogVisible"
      @ok="onChangeOrderAreas"
      @cancel="areaDialogVisible = false">
    </area-selector>
    <create-user :visible="showCreateUserDialog"
      :all-roles="allRoles"
      :user-info="userInfo"
      @created="onUserCreated"
      @hide="showCreateUserDialog = false">
    </create-user>
  </div>
</template>

<script>
import CategorySelector from 'com/common/category-selector'
import UserSelector from 'com/common/user-selector'
import AreaSelector from 'com/common/area-selector'
import CreateUser from 'com/common/create-user'
import AdCalendar from 'com/common/ad-calendar'
import BaxSelect from 'com/common/select'
import Topbar from 'com/topbar'

import { Message } from 'element-ui'
import dayjs from 'dayjs'
import clone from 'clone'

import {
  fmtCategoriesAndAreasInOpts,
  getCnName
} from 'util/meta'

import store from './store'

import { assetHost } from 'config'
import es from 'base/es'

import {
  sspOrderTypeOpts
} from 'constant/order'

import {
  getUserInfo
} from 'api/account'

import {
  createOrder
} from 'api/order'

import {
  onlyAgentSales,
  allowAddOrder,
  allowAddUser
} from 'util/role'

import {
  toTimestamp,
  centToYuan,
  now
} from 'utils'

const tomorrow = dayjs().add(1, 'days').format('YYYY-MM-DD')

const oneday = 24 * 60 * 60 - 1 // 故意: 减一秒

const emptyOrder = {
  adId: '',
  sspOrderType: '',
  categories: [],
  cities: [],
  onlineAt: now(),
  offlineAt: tomorrow,
  salesId: '',
  userId: ''
}

export default {
  name: 'create-order',
  components: {
    CategorySelector,
    UserSelector,
    AreaSelector,
    CreateUser,
    AdCalendar,
    BaxSelect,
    Topbar
  },
  fromMobx: {
    calendarOptions: () => store.calendarOptions,

    adPrice: () => store.adPrice,
    ads: () => store.ads,

    orders: () => store.orders
  },
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
  data() {
    return {
      sspOrderTypeOpts: [...sspOrderTypeOpts],

      categoryDialogVisible: false,
      areaDialogVisible: false,

      showCreateUserDialog: false,
      newOrder: clone(emptyOrder),

      adCalendarConflicting: false,

      salesIdLocked: false,
      salesDisplayName: '', // 说明: locked salesId -> name

      clientIdLocked: false,
      clientDisplayName: ''
    }
  },
  computed: {
    adOpts() {
      return this.ads.map(ad => ({
        label: ad.name || ad.slotCode,
        value: ad.id
      }))
    },
    adPriceDiscount() {
      const { adPrice } = this
      if (adPrice && adPrice.discountCodes &&
        adPrice.discountCodes.length) {
        return adPrice.discountCodes
          .map(d => d.description)
          .join(',')
      }

      return ''
    },
    adExampleImg() {
      const adId = this.newOrder.adId

      if (!adId) {
        return ''
      }

      const ad = this.ads.find(a => a.id === adId)

      return ad.exampleImg
    },
    currentRoles() {
      const { userInfo } = this

      const { roles = [] } = userInfo

      return roles.map(r => r.nameEn)
    },
    allowAddOrder() {
      return allowAddOrder(this.currentRoles)
    },
    allowAddUser() {
      return allowAddUser(this.currentRoles)
    },
    isOnlyAgentSales() {
      return onlyAgentSales(this.currentRoles)
    },
    isAgentSales() {
      return this.currentRoles.includes('AGENT_SALES')
    },
    isOperator() {
      return this.currentRoles.includes('NORMAL_OPERATOR')
    },
    isAgentAccounting() {
      return this.currentRoles.includes('AGENT_ACCOUNTING')
    },
    isBxSales() {
      return this.currentRoles.includes('BAIXING_SALES')
    },
    contractDocx() {
      return assetHost + 'baixing-online-promotion-contract.docx'
    },
    topTitle() {
      if (this.isOnlyAgentSales) {
        return '广告查价'
      }

      return '新建订单'
    }
  },
  filters: {
    price(v) {
      return '￥' + centToYuan(v)
    }
  },
  methods: {
    formatterCategory(name) {
      const { allCategories } = this
      return getCnName(name, allCategories)
    },
    formatterArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },
    removeCategory(c) {
      this.newOrder.categories = [
        ...this.newOrder.categories.filter(i => i !== c)
      ]
    },
    removeArea(a) {
      this.newOrder.cities = [
        ...this.newOrder.cities.filter(c => c !== a)
      ]
    },
    onChangeOrderCategories(v) {
      this.categoryDialogVisible = false
      this.newOrder.categories = v
    },
    onChangeOrderAreas(v) {
      this.areaDialogVisible = false
      this.newOrder.cities = v
    },
    onUserCreated({userId}) {
      es.emit('new user created', {
        userId
      })
    },
    onAdConflict() {
      this.adCalendarConflicting = true
    },
    async queryAdCalendar(newOrder) {
      const { allAreas } = this

      const {
        sspOrderType,
        offlineAt,
        onlineAt,
        adId,

        categories,
        cities
      } = newOrder

      if (!(adId && categories.length && cities.length &&
        onlineAt && offlineAt)) {
        return
      }

      this.adCalendarConflicting = false

      await store.setCalendarOptions({
        start: toTimestamp(onlineAt),
        end: toTimestamp(offlineAt),
        areas: [...cities],
        categories
      })

      await store.getCalendar(fmtCategoriesAndAreasInOpts({
        sspOrderType: this.isOperator ? sspOrderType : 0,
        startAt: toTimestamp(onlineAt),
        endAt: toTimestamp(offlineAt),
        areas: [...cities],
        categories,
        adId
      }, allAreas))
    },
    async queryAdPrice(newOrder) {
      const { allAreas } = this

      const {
        categories,
        cities,

        offlineAt,
        onlineAt,
        adId
      } = newOrder

      const opts = {
        startAt: toTimestamp(onlineAt),
        endAt: toTimestamp(offlineAt) + oneday,
        categories: [...categories],
        cities: [...cities],
        adId
      }

      if (opts.adId && opts.categories.length &&
        opts.cities.length &&
        opts.startAt && opts.endAt) {
        await store.getAdPrice(opts.adId, fmtCategoriesAndAreasInOpts(opts, allAreas))
      }
    },
    empty() {
      this.newOrder = clone(emptyOrder)
      this.salesDisplayName = ''
      this.salesIdLocked = false
      this.clientLocked = false
      this.clientDisplayName = ''
      store.clearStore()
    },
    async onSubmit() {
      const { newOrder, userInfo, adPrice, allAreas } = this

      const data = {
        ...clone(newOrder),
        offlineAt: toTimestamp(newOrder.offlineAt) + oneday,
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

      if (!this.isOperator) {
        delete data.sspOrderType
      }

      if (adPrice && adPrice.discountCodes &&
        adPrice.discountCodes.length) {
        data.discountCodes = adPrice.discountCodes.map(d => d.code)
      }

      if (!data.salesId) {
        return Message.error('请选择销售')
      }

      const oid = await createOrder(fmtCategoriesAndAreasInOpts(data, allAreas))

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
  watch: {
    newOrder: {
      async handler(newOrder) {
        await Promise.all([
          this.queryAdPrice(newOrder),
          this.queryAdCalendar(newOrder)
        ])
      },
      deep: true
    }
  },
  async mounted() {
    await store.getAds()

    // 从指南车、米奇跳过来时会带上参数。两者自动登录的用户角色不同
    const { sales_id: salesId, user_id: clientId } = this.$route.query

    if (salesId) {
      const info = await getUserInfo(salesId)
      if (String(info.id) === salesId) {
        // 说明: get user info 是有权限设置的 salesId
        // 如果 info == {}, 不锁定 salesId
        this.salesIdLocked = true
        this.salesDisplayName = info.name || '无名氏'
        this.newOrder.salesId = salesId
      }
    }

    if (clientId) {
      const client = await getUserInfo(clientId)
      if (String(client.id) === clientId) {
        this.clientIdLocked = true
        this.clientDisplayName = client.name || '无名氏'
        this.newOrder.userId = clientId
      }
    }
  },
  beforeDestroy() {
    // 场景: 未提交
    this.empty()
  },
  updated() {
    console.debug('updated - create order')
  }
}
</script>

<style lang="scss" scoped>
.el-icon-plus {
  @include icon-btn;
}

.el-tag {
  margin-right: 3px;
}

.create-order {
  padding: 0 35px;
  width: 100%;

  & > main {
    max-width: 680px;

    & footer {
      display: flex;
      justify-content: flex-end;
      padding-right: 20px;
      margin-top: 30px;
    }
  }

  & a[name="ad-conflict"] {
    margin-top: 50px;
  }

  & .conflict-tip {
    margin-left: 5px;
    font-size: 14px;

    & i,
    & label {
      color: red;
    }

    & a {
      color: #20a0ff;
    }
  }

  & .select-ad {
    display: flex;
    flex-flow: column;

    & > img {
      margin-top: 15px;
      max-width: 480px;
    }
  }

  & .terms {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    padding-right: 10px;
    margin-bottom: 10px;

    & a {
      color: #48576a;
      cursor: pointer;
    }

    & .el-checkbox {
      margin-right: 10px;
    }
  }

  & .ad-price {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 0;

    & > span {
      display: flex;
      align-items: center;
      margin-right: 20px;
    }

    & > span {
      & > label:first-child {
        margin-right: 5px;
        color: #5e6d82;
      }

      & > label:last-child {
        font-size: 22px;
        color: red;
      }

      & > p {
        font-size: 14px;
      }
    }
  }
}
</style>
