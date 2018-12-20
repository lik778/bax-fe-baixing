<template>
  <div class="bg">
    <div class="white-bg">
      <header>我的标王推广计划</header>
      <main>
        <router-link :to="{name: 'bw-query-price'}">
          <el-button class="create-plan" type="primary"><i class="el-icon-plus" ></i>新建标王计划</el-button>
        </router-link>
        <el-form :model="query" label-width="100px" label-position="left" @submit.native.prevent >
          <el-form-item label="关键词">
            <el-input v-model="query.keyword" placeholder="输入关键词查询" style="width: 300px;" />
          </el-form-item>
          <el-form-item label="投放状态">
            <el-checkbox-group v-model="query.statusFilters">
              <el-checkbox :label="opt.value" v-for="(opt, index) in promoteStatusOpts" :key="index">{{opt.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>

        <el-table :data="promotes">
          <el-table-column prop="word" label="关键词" />
          <el-table-column prop="cities" label="城市" :formatter="cityFormatter" />
          <el-table-column prop="device" label="平台" :formatter="deviceFormatter" />
          <el-table-column prop="status" label="投放状态" :formatter="statusFormatter" />
          <el-table-column prop="" label="平均排名" />
          <el-table-column prop="createdAt" label="购买日期" :formatter="dateFormatter" />
          <el-table-column label="投放剩余天数">

          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <router-link v-if="!isBxSales && !isAgentAccounting" :to="{name: 'bw-edit-plan', query: {promoteId: scope.row.id}}"><el-button type="text" size="small">编辑</el-button></router-link>
              <el-button size="small" type="text" @click="onXufei(scope.row)">续费</el-button>
            </template>
          </el-table-column>
        </el-table>
        <bax-pagination :options="query" @current-change="onCurrentChange" />
      </main>

      <el-dialog :visible.sync="xufeiDialogVisible" title="标王续费">
        <el-form :model="xufeiForm" label-width="200px" :rules="rules" ref="xufei">
          <el-form-item label="关键词">{{xufeiForm.word}}</el-form-item>
          <el-form-item label="城市">{{xufeiForm.cities}}</el-form-item>
          <el-form-item label="投放平台">{{xufeiForm.device}}</el-form-item>
          <el-form-item label="购买天数" prop="days">
            <el-radio v-model="xufeiForm.days" :label="+option[0]" v-for="(option, index) in Object.entries(xufeiForm.soldPriceMap)" :key="index">{{option[0]}}天{{f2y(option[1])}}元</el-radio>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="xufeiDialogVisible = false">取消续费</el-button>
            <el-button type="primary" @click="addToCart">加入购物车</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import BaxPagination from 'com/common/pagination'
  import {promoteStatusOpts, DEVICE, PROMOTE_STATUS} from 'constant/biaowang'
  import {getPromotes, queryKeywordPrice} from 'api/biaowang'
  import {
    f2y,
    getCnName
  } from 'util'
  import moment from 'moment'
  import {
    normalizeRoles
  } from 'util/role'

  export default {
    name: 'bw-plan-list',
    components: {
      BaxPagination
    },
    props: {
      allAreas: Array,
      salesInfo: Object,
      userInfo: Object
    },
    data() {
      return {
        promoteStatusOpts,
        query: {
          keyword: '',
          statusFilters: [],
          offset: 0,
          limit: 20,
          total: 0,
        },
        promotes: [],
        xufeiForm: {
          word: '',
          cities: [],
          device: 0,
          soldPriceMap: {},
          days: null
        },
        rules: {
          days: [{required: true, message: '请选择购买天数'}],
        },
        xufeiDialogVisible: false,
      }
    },
    computed: {
      isBxUser() {
        const roles = normalizeRoles(this.userInfo.roles)
        return roles.includes('BAIXING_USER')
      },
      isBxSales() {
        const roles = normalizeRoles(this.userInfo.roles)
        return roles.includes('BAIXING_SALES')
      },
      isAgentAccounting() {
        const roles = normalizeRoles(this.userInfo.roles)
        return roles.includes('AGENT_ACCOUNTING')
      },
    },
    methods: {
      f2y,
      async getPromotes() {
        const {offset, limit, keyword: word, statusFilters: status} = this.query
        const {items, total} = await getPromotes({page: offset / limit, size: limit, word, status})
        this.promotes = items
        this.query.total = total
      },
      async onCurrentChange({offset}) {
        this.query.offset = offset
        await this.getPromotes()
      },
      async onXufei({word, cities, device}) {
        const result = await queryKeywordPrice({
          word,
          cities,
          device
        })
        this.xufeiForm = result[0]
        this.xufeiDialogVisible = true
      },
      addToCart() {
        this.$refs.xufei.validate(isValid => {
          if (isValid) {
            const item = {
              ...this.xufeiForm,
              price: this.xufeiForm.soldPriceMap[this.xufeiForm.days]
            }
            this.$parent.$refs.bwShoppingCart.addToCart([item])
            this.xufeiDialogVisible = false
          } else {
            return false
          }
        })
      },
      cityFormatter({cities}) {
        return cities.map(city => getCnName(city, this.allAreas)).join(',')
      },
      deviceFormatter({device}) {
        return DEVICE[device]
      },
      statusFormatter({status}) {
        return PROMOTE_STATUS[status]
      },
      dateFormatter({createdAt}) {
        return moment(createdAt * 1000).format('YYYY-MM-DD')
      }
    },
    async mounted() {
      this.query.userId = this.salesInfo.userId
      await this.getPromotes()
    },
    watch: {
      'query.keyword': function (v) {
        this.getPromotes()
      },
      'query.statusFilters': function (v) {
        this.getPromotes()
      },
    }
  }
</script>

<style lang="postcss" scoped>
header {
  color: #666;
  border-bottom: 1px solid #E6E6E6;
  padding: 15px;
  font-size: 16px;
}
div.bg {
  padding: 10px 10px 30px 10px;
  background-color: #f4f4f4;

  & > .white-bg {
    background-color: #fff;

    & > main {
      box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
      min-height: 700px;
      padding: 45px 60px;
    }
  }
}
.create-plan {
  margin-bottom: 35px;
}
</style>
