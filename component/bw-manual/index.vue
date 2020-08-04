<template>
  <div class="bg bw-manual">
    <div class="white-bg">
      <header>人工报价记录</header>
      <div class="content">
        <el-form :inline="true" :model="query" class="search">
          <el-form-item label="关键词">
            <el-input v-model="query.word" placeholder="请输入关键词" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="query.status" clearable>
              <el-option v-for="(v,k) in PROMOTE_OFFER_STATUS" :label="v" :value="k" :key="k"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table class="record-table" :data="manualHistory">
          <el-table-column label="查询日期" prop="createdAt" :formatter="dateFormatter" />
          <el-table-column label="关键词" prop="word" />
          <el-table-column label="推广平台" porp="device" width="120" :formatter="({device}) => DEVICE[device]" />
          <el-table-column label="城市" prop="manualCities">
            <span slot-scope="{row}">
              {{cityFormatter(row.manualCities)}}
            </span>
          </el-table-column>
          <el-table-column label="类型" />
          <el-table-column label="状态" prop="status">
            <template slot-scope="{row}">
              <el-tag :type="row.status === PROMOTE_OFFERED ? 'success': 'warning'" v-if="!row.isExpired">
                {{PROMOTE_OFFER_STATUS[row.status]}}
              </el-tag>
              <el-tag v-if="row.isExpired" type="warning">已过期</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="人工报价" min-width="180">
            <el-radio-group v-if="row.status === PROMOTE_OFFERED" 
                            slot-scope="{row}" v-model="row.checkDays">
              <el-radio v-for="(v, k) in row.soldPriceMap" 
                        :label="k" :key="k">
                        {{f2y(v)}}元({{k}}天)
              </el-radio>
            </el-radio-group>
            <span v-else>--</span>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" size="small" @click="addToCart(row)" 
                         :disabled="disabledAddCartBtn(row)">加入购物车</el-button><br />
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
import { getUserManualList } from 'api/biaowang'
import { 
  DEVICE, 
  DEVICE_ALL,
  PROMOTE_OFFER_STATUS, 
  PROMOTE_OFFERED, 
  PROMOTE_UNOFFERED,
  THIRTY_DAYS,
  DAYS_MAP
} from 'constant/biaowang'
import { getCnName, f2y } from 'util'

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
  data() {
    return {
      query: {
        word: '',
        status: '',
        size: 20
      },
      currentPage: 0,
      total: 0,
      manualHistory: null,
      DEVICE,
      PROMOTE_OFFER_STATUS,
      PROMOTE_OFFERED,
      PROMOTE_UNOFFERED
    }
  },
  methods: {
    getCnName,
    f2y,
    async getManualHistory(isResetPageNo) {
      if (isResetPageNo) this.currentPage = 0
      let { data, total } = await getUserManualList({ ...this.query, page: this.currentPage })
      this.manualHistory = data.map((item) => {
        const soldPriceMap = DAYS_MAP.reduce((curr, prev) => {
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
    dateFormatter({createdAt}) {
      return dayjs(createdAt * 1000).format('YYYY-MM-DD')
    },
    cityFormatter(cities) {
      return cities.slice(0, citiesMax).map(city => getCnName(city, this.allAreas)).join('，')
    },
    disabledAddCartBtn(row) {
      return row.isExpired || row.status === PROMOTE_UNOFFERED
    },
    addToCart(row) {
      const { cities, checkDays, device, price, word, soldPriceMap } = row
      if (!checkDays) {
        return this.$message.error('请选择关键词报价')
      }
      const isExpired = dayjs().isAfter(dayjs(item.createdAt * 1000).endOf('month'))
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
      this.$parent.$refs.bwShoppingCart.addToCart(data)
    },
    goToQueryPrice(row) {
      const { word, device, cities } = row
      this.$router.push({
        name: 'bw-query-price',
        query: {
          word,
          device,
          cities: cities.join('|')
        }
      })
    },
    handleCurrentPage(val) {
      this.currentPage = val
      this.getManualHistory()
    }
  },
  watch: {
    query: {
      immediate: true,
      deep: true,
      handler() {
        this.getManualHistory(true)
      }
    },
    'userInfo.sstAgent': {
      immediate: true,
      handler(val) {
        if (val) {
          this.$router.push('/main')
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.bw-manual {
  
  &.bg {
    & > .white-bg {
      background-color: #fff;
      & > main {
        box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
        min-height: 700px;
        padding: 45px 60px;
      }
    }
  }

  & header {
    color: #666;
    border-bottom: 1px solid #E6E6E6;
    padding: 15px;
    font-size: 16px;
  }

  & .content {
    padding: 20px 10px;
  }

  & .record-table {
    margin-top: 40px;
  } 
}
</style>