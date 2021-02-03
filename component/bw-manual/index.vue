<template>
  <div class="bg bw-manual">
    <div class="white-bg">
      <header>人工报价记录</header>
      <div class="content">
        <el-form :inline="true" :model="query" class="search">
          <el-form-item label="关键词">
            <el-input v-model="query.keyword" placeholder="请输入关键词" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" clearable>
              <el-option v-for="(v,k) in PROMOTE_OFFER_STATUS" :label="v" :value="k" :key="k"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAddToCartAll" :loading="loading">批量加入购物车</el-button>
          </el-form-item>
        </el-form>
        <el-table class="record-table" :data="manualHistory">
          <el-table-column label="查询日期" prop="createdAt" width="120" :formatter="dateFormatter" />
          <el-table-column label="关键词" prop="word" width="120" />
          <el-table-column label="推广平台" porp="device" width="120" :formatter="({device}) => DEVICE[device]" />
          <el-table-column label="城市" prop="cities" min-width="180">
            <template slot-scope="{row}">
              <el-tooltip popper-class="city-tooltip" class="item" effect="light"
                          :content="cityFormatter(row.cities, row.cities.length)" placement="right">
                <p>{{cityFormatter(row.cities, citiesMax)}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="类型" :formatter="({applyType}) => APPLY_TYPES[applyType]" width="140" align="center" />
          <el-table-column label="状态" prop="status" width="180">
            <template slot-scope="{row}">
              <el-tag :type="row.status === PROMOTE_OFFERED ? 'success': 'warning'" v-if="!row.isExpired">
                {{PROMOTE_OFFER_STATUS[row.status]}}
              </el-tag>
              <el-tag v-if="row.isExpired" type="warning">已过期</el-tag>
              <el-tag type="danger"
                      v-if="row.applyType === APPLY_TYPE_ORDER_LONG &&
                            row.soldType === SOLD_TYPE_MONTH &&
                            row.status === PROMOTE_OFFERED ">不售卖长单</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="人工报价" width="360">
            <el-radio-group v-if="row.status === PROMOTE_OFFERED"
                            slot-scope="{row}" v-model="row.checkDays">
              <el-radio class="manual-radio" v-for="(v, k) in row.soldPriceMap"
                        :label="k" :key="k">
                        {{f2y(v)}}元（{{k}}天）
              </el-radio>
            </el-radio-group>
            <span v-else>--</span>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="180">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="addToCart(row)"
                         :disabled="disabledAddCartBtn(row)">加入购物车</el-button>
              <el-button type="text" size="small" @click="goToQueryPrice(row)">重新查价</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagniation" small layout="prev, pager, next"
          :total="total" :page-size="query.size"
          :current-page="currentPage"
          @current-change="handleCurrentPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserManualList, refreshKeywordPriceNew } from 'api/biaowang'
import {
  DEVICE,
  PROMOTE_OFFER_STATUS,
  PROMOTE_OFFERED,
  PROMOTE_UNOFFERED,
  THIRTY_DAYS,
  GET_DAYS_MAP,
  APPLY_TYPES,
  APPLY_TYPE_ORDER_LONG,
  SOLD_TYPE_MONTH
} from 'constant/biaowang'
import { getCnName, f2y } from 'util'
import pick from 'lodash.pick'

const citiesMax = 20

export default {
  name: 'BwManual',
  props: {
    userInfo: {
      type: Object,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      query: {
        keyword: '',
        status: '',
        size: 20
      },
      currentPage: 0,
      total: 0,
      manualHistory: null,
      DEVICE,
      PROMOTE_OFFER_STATUS,
      PROMOTE_OFFERED,
      PROMOTE_UNOFFERED,
      APPLY_TYPES,
      APPLY_TYPE_ORDER_LONG,
      SOLD_TYPE_MONTH,
      citiesMax,
      loadingBtn: false,
      loadingCart: false
    }
  },
  mounted () {
    this.$bus.$on('shoppingCartLoading', (loading) => {
      this.loadingCart = loading
    })
  },
  computed: {
    loading () {
      return this.loadingBtn || this.loadingCart
    }
  },
  methods: {
    getCnName,
    f2y,
    getFinalUserId () {
      const { user_id: userId } = this.$route.query
      if (userId) {
        return userId
      }
      const { userInfo } = this
      return userInfo.id
    },
    async getManualHistory (isResetPageNo) {
      if (isResetPageNo) this.currentPage = 0
      const query = {}
      for (const key in this.query) {
        if (this.query[key] !== '') {
          Object.assign(query, {
            [key]: this.query[key]
          })
        }
      }
      const { data, total } = await getUserManualList({ ...query, page: this.currentPage })

      this.manualHistory = data.map((item) => {
        const soldPriceMap = GET_DAYS_MAP(item.soldType).reduce((curr, prev) => {
          return Object.assign(curr, {
            [prev]: prev / THIRTY_DAYS * item.price
          })
        }, {})

        return Object.assign(item, {
          checkDays: '',
          soldPriceMap,
          isExpired: dayjs().isAfter(dayjs(item.createdAt * 1000).endOf('month'))
        })
      })
      this.total = total
    },
    dateFormatter ({ createdAt }) {
      return dayjs(createdAt * 1000).format('YYYY-MM-DD')
    },
    cityFormatter (cities, max = citiesMax) {
      return cities.slice(0, max).map(city => getCnName(city, this.allAreas)).join('，') + (cities.length > max ? `等${cities.length}个城市` : '')
    },
    disabledAddCartBtn (row) {
      return row.isExpired || row.status === PROMOTE_UNOFFERED || this.loading
    },
    async handleAddToCartAll () {
      const tempArr = this.manualHistory.filter(o => o.checkDays && !(dayjs().isAfter(dayjs(o.createdAt * 1000).endOf('month'))))
      if (!tempArr.length) {
        return this.$message.error('清选择关键词报价')
      }
      this.loadingBtn = true
      const data = tempArr.map(o => {
        return {
          ...pick(o, ['cities', 'device', 'price', 'word', 'soldPriceMap']),
          days: o.checkDays
        }
      })

      await refreshKeywordPriceNew(data, {
        targetUserId: this.getFinalUserId()
      })
      this.loadingBtn = false

      this.$parent.$refs.bwShoppingCart.addToCart(data)
    },
    async addToCart (row) {
      const { cities, checkDays, device, price, word, soldPriceMap, createdAt } = row
      if (!checkDays) {
        return this.$message.error('请选择关键词报价')
      }
      const isExpired = dayjs().isAfter(dayjs(createdAt * 1000).endOf('month'))
      if (isExpired) {
        return this.$message.error('该报价查询已过期')
      }
      const data = [{
        cities,
        days: checkDays,
        device,
        price,
        word,
        soldPriceMap
      }]

      this.loadingBtn = true
      await refreshKeywordPriceNew(data, {
        targetUserId: this.getFinalUserId()
      })
      this.loadingBtn = false

      this.$parent.$refs.bwShoppingCart.addToCart(data)
    },
    goToQueryPrice (row) {
      const { word, device, cities } = row
      this.$router.push({
        name: 'bw-query-price',
        query: {
          ...this.$route.query,
          word,
          device,
          cities: cities.join('|')
        }
      })
    },
    handleCurrentPage (val) {
      this.currentPage = val
      this.getManualHistory()
    }
  },
  watch: {
    query: {
      immediate: true,
      deep: true,
      handler () {
        this.getManualHistory(true)
      }
    },
    'userInfo.shAgent': {
      immediate: true,
      handler (val) {
        if (val) {
          this.$router.push('/main')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bw-manual {
  &.bg {
    & > .white-bg {
      background-color: #fff;
      & > main {
        box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, 0.1);
        min-height: 700px;
        padding: 45px 60px;
      }
    }
  }

  & header {
    color: #666;
    border-bottom: 1px solid #e6e6e6;
    padding: 15px;
    font-size: 16px;
  }

  & .content {
    padding: 20px 10px;
  }

  & .record-table {
    margin-top: 40px;
  }
  & .manual-radio {
    width: 160px;
    line-height: 30px;
    margin-right: 10px;
  }
}
</style>
