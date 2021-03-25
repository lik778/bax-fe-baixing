<template>
  <div class="qwt-promotion-list">
    <div class="top-tips">
      <p
        class="info"
        v-if="summary && summary.budget"
      >
        您的推广资金可用余额为<span class="red">{{ f2y(currentBalance) }}元</span>，预计可消耗<span class="red">{{ days }}天</span>
        <label v-if="userInfo.allowFmRecharge">为了保证您的广告正常投放，请及时<router-link :to="{ name: 'qwt-charge' }">充值</router-link></label>
      </p>
    </div>
    <main class="container">
      <h2 class="header">我的站外推广计划</h2>
      <div class="action-group">
        <div class="top">
          <el-button
            class="button"
            icon="el-icon-plus"
            type="primary"
            @click="() => $router.push({ name: 'qwt-create-promotion' })"
          >新建推广计划</el-button>
          <a
            href="javascript:;"
            class="expand-button"
            @click="isActionGroupExpand = !isActionGroupExpand"
          >
            更多筛选
            <i
              class="icon"
              :class="
                isActionGroupExpand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
              "
            />
          </a>
        </div>
        <el-tabs
          v-model="activeName"
          @tab-click="toggleTab"
          type="card"
        >
          <el-tab-pane
            label="计划"
            name="plan"
          >
            <div v-show="isActionGroupExpand">
              <div class="column">
                <span class="title">计划id</span>
                <el-select
                  v-model="queryParams.value"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="column">
                <h6 class="title">投放状态</h6>
                <div class="checkbox-group">
                  <el-checkbox-group v-model="queryParams.statuses">
                    <el-checkbox
                      class="checkbox"
                      v-for="c in CAMPAIGN_STATUS_OPTS"
                      :key="c.value"
                      :label="c.value"
                    >
                      {{ c.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="column source">
                <h6 class="title">渠道来源</h6>
                <div class="checkbox-group">
                  <el-checkbox-group v-model="queryParams.source">
                    <el-checkbox
                      class="checkbox"
                      v-for="c in SOURCES_OPTS"
                      :key="c.value"
                      :label="c.value"
                    >
                      {{ c.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="column area">
                <span class="title">投放区域</span>
                <el-tag
                  v-for="a in queryParams.areas"
                  @close="removeSelectedArea(a)"
                  :key="a"
                  type="danger"
                  :closable="true"
                  class="tag"
                >
                  {{ a | transformCityName(allAreas) }}
                </el-tag>
                <i
                  class="el-icon-plus icon"
                  @click="areaDialogVisible = true"
                />
              </div>
            </div>
            <div class="column">
              <h6 class="title hightlight">投放优化</h6>
              <div class="checkbox-group">
                <el-checkbox-group v-model="queryParams.statuses">
                  <el-checkbox
                    class="checkbox"
                    v-for="c in CAMPAIGN_OPTIMIZATION_OPTS"
                    :key="c.value"
                    :label="c.value"
                  >
                    {{ c.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>

            <el-table
              cell-class-name="bax-cell"
              v-loading="landingPageLoading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              row-key="id"
              :data="tableData"
              style="width: 100%"
            >
              <el-table-column
                v-for="item in columns"
                :key="item.id"
                :prop="item.prop"
                :label="item.lable"
                :width="item.width"
                :formatter="item.formatter"
                align="center"
              >
                <template slot-scope="scope">
                  <el-popover
                    v-if="item.prop === 'status_text'"
                    trigger="hover"
                    placement="top"
                  >
                    <p>您的推广在{{ scope.row.status_text }}中</p>
                    <span
                      slot="reference"
                      class="name-wrapper"
                    >
                      {{ scope.row.status_text }}
                    </span>
                  </el-popover>
                  <span v-if="item.prop === 'opt'">{{
                    filterOptimization(scope.row)
                  }}</span>
                  <span v-if="item.prop != 'opt' && item.prop != 'status_text'">{{ scope.row[item.prop] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="unit"
                label="单元"
                align="center"
                width="300"
              >
                <template slot-scope="scope">
                  <div class="unit-wrapper">
                    <p class="unit-cell">
                      <span
                        class="unit-item"
                        v-for="unit in scope.row.unit"
                        :key="unit.value"
                      >{{ unit.label }}、</span>
                    </p>
                    <router-link
                      class="view"
                      :to="{
                        name: 'qwt-update-promotion-list',
                        query: { id: scope.row.id },
                      }"
                    >查看</router-link>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="daily_budget"
                label="今日预算"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <span
                    class="edite-wrapper"
                    v-if="scope.row.id === dailyBudget.id"
                  >
                    <el-input v-model="dailyBudget.value"></el-input>
                    <el-button
                      type="text"
                      @click="modifyBudget(scope.row)"
                    >确定</el-button>
                  </span>
                  <span v-else>
                    <span>{{ (scope.row.daily_budget / 100).toFixed(2) }}</span>
                    <el-button
                      type="text"
                      @click="editeBudget(scope.row)"
                    >修改</el-button>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="daily_budget"
                label="今日消耗"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop=""
                label="操作"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="
                      () => {
                        console.log(scope.row);
                      }
                    "
                  >暂停</el-button>
                  <router-link :to="{
                      name: 'qwt-update-promotion',
                      params: { id: scope.row.id },
                    }">优化</router-link>
                  <el-button
                    type="text"
                    @click="
                      () => {
                        console.log(scope.row);
                      }
                    "
                  >复制</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane
            label="单元"
            name="unit"
          >
            <div v-show="isActionGroupExpand">
              <div class="column">
                <span class="title">计划id</span>
                <el-select
                  v-model="queryParams.value"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="column">
                <h6 class="title">投放状态</h6>
                <div class="checkbox-group">
                  <el-checkbox-group v-model="queryParams.statuses">
                    <el-checkbox
                      class="checkbox"
                      v-for="c in CAMPAIGN_STATUS_OPTS"
                      :key="c.value"
                      :label="c.value"
                    >
                      {{ c.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="column source">
                <h6 class="title">渠道来源</h6>
                <div class="checkbox-group">
                  <el-checkbox-group v-model="queryParams.source">
                    <el-checkbox
                      class="checkbox"
                      v-for="c in SOURCES_OPTS"
                      :key="c.value"
                      :label="c.value"
                    >
                      {{ c.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <div class="column">
              <h6 class="title hightlight">投放优化</h6>
              <div class="checkbox-group">
                <el-checkbox-group v-model="queryParams.statuses">
                  <el-checkbox
                    class="checkbox"
                    v-for="c in CAMPAIGN_OPTIMIZATION_OPTS"
                    :key="c.value"
                    :label="c.value"
                  >
                    {{ c.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="column">
              <span class="title">单元名称</span>
              <bax-input
                class="input"
                placeholder="请输入单元名称"
                suffix-icon="el-icon-search"
                v-model="queryParams.unitName"
              />
            </div>

            <el-table
              cell-class-name="bax-cell"
              :data="unitData"
              row-key="id"
              v-loading="landingPageLoading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
            >
              <el-table-column
                align="center"
                v-for="item in unitColums"
                :key="item.id"
                :prop="item.prop"
                :label="item.label"
                :formatter="item.formatter"
              ></el-table-column>

              <el-table-column
                align="center"
                prop=""
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="
                      () => {
                        console.log(scope.row);
                      }
                    "
                  >暂停</el-button>
                  <router-link :to="{
                      name: 'qwt-update-promotion',
                      params: { id: scope.row.id },
                    }">优化</router-link>
                  <el-button
                    type="text"
                    @click="
                      () => {
                        console.log(scope.row);
                      }
                    "
                  >复制</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-pagination
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
        :page-size="ONE_PAGE_NUM"
        :total="totalPage"
      />
    </main>
    <area-selector
      type="qwt"
      :areas="queryParams.areas"
      :all-areas="allAreas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="handleSelectArea"
      @cancel="areaDialogVisible = false"
    />
  </div>
</template>

<script>
import { getCnName, f2y } from 'util'
import pick from 'lodash.pick'
import {
  CAMPAIGN_STATUS_OPTS,
  options,
  unitData,
  unitColums,
  CAMPAIGN_OPTIMIZATION_OPTS,
  columns,
  filterOptimization
} from './constant'
import { toCamelcase } from 'object-keys-mapping'
import AreaSelector from 'com/common/area-selector'
import BaxInput from 'com/common/input'
import { getCampaignLanding, getCurrentCampaigns } from 'api/fengming-campaign'
import {
  getCurrentBalance,
  getHomepageSummary,
  updateCampaignDailyBudget
} from 'api/fengming'
import {
  semPlatformOpts as SOURCES_OPTS
} from 'constant/fengming'
const CNT_REJECTED_CODE = '-53'
const ONE_PAGE_NUM = 10
const formatlandingPageList = (res) => {
  return Object.entries(res).reduce((list, [k, v]) => {
    return list.concat({
      ...v,
      id: k
    })
  }, [])
}

export default {
  name: 'qwt-update-promotion-list',
  created () {
    const {
      query: { id }
    } = this.$route
    const { statuses } = this.$route.query
    if (id) {
      // 从某个计划点击进来
      this.activeName = 'unit'
      this.queryParams.value = id
    }
    if (statuses) {
      this.isActionGroupExpand = true
      // 从首页未审核处点击进来的
      if (statuses === CNT_REJECTED_CODE) {
        this.queryParams.statuses = [CNT_REJECTED_CODE]
      } else {
        this.queryParams.statuses.push(statuses)
      }
    }
    if (this.salesInfo.userId) {
      this.queryParams.userId = this.salesInfo.userId
    }
    this.fetchSummary()
    this.fetchlandingPageList()
  },
  data () {
    return {
      ONE_PAGE_NUM,
      SOURCES_OPTS,
      CAMPAIGN_STATUS_OPTS,
      CAMPAIGN_OPTIMIZATION_OPTS,
      options,
      unitData,
      unitColums,
      dailyBudget: {
        id: '',
        value: 0
      },
      tableData: [
        {
          id: 1,
          ctrMark: false,
          priceMark: false,
          kwMark: true,
          defaultMark: false,
          status_text: '审核中',
          source: 0,
          daily_budget: 1000,
          unit: [
            {
              id: 1,
              label: '推广'
            },
            {
              id: 2,
              label: '推广2'
            },
            {
              id: 2,
              label: '推广2'
            },
            {
              id: 2,
              label: '推广2'
            },
            {
              id: 2,
              label: '推广2'
            }
          ]
        },
        {
          id: 2,
          ctrMark: false,
          priceMark: true,
          kwMark: false,
          defaultMark: false,
          status_text: '审核中',
          source: 5,
          daily_budget: 1000,
          unit: [
            {
              id: 1,
              label: '推广'
            },
            {
              id: 2,
              label: '推广2'
            }
          ]
        },
        {
          id: 3,
          ctrMark: true,
          priceMark: false,
          kwMark: false,
          defaultMark: false,
          status_text: '审核中',
          source: 0,
          daily_budget: 1000,
          unit: [
            {
              id: 1,
              label: '推广'
            },
            {
              id: 2,
              label: '推广2'
            }
          ]
        }
      ],
      columns,
      queryParams: {
        unitName: '',
        areas: [],
        statuses: CAMPAIGN_STATUS_OPTS.map((s) => s.value),
        source: [],
        offset: 0,
        limit: ONE_PAGE_NUM,
        userId: '',
        value: 1
      },
      landingPageLoading: false,
      landingPageList: null,
      currentBalance: null,
      campaignMap: {},
      summary: null,
      totalPage: 0,
      activeName: 'plan',
      areaDialogVisible: false,
      isActionGroupExpand: true
    }
  },
  props: ['allAreas', 'salesInfo', 'userInfo'],
  components: { AreaSelector, BaxInput },
  methods: {
    filterOptimization,
    f2y,
    handleEdit (row) {
      console.log(row)
    },
    handlePageChange (page) {
      this.queryParams.offset = (page - 1) * ONE_PAGE_NUM
      this.fetchlandingPageList()
    },
    handleSelectArea (areas) {
      this.queryParams.areas = areas
      this.areaDialogVisible = false
    },
    removeSelectedArea (area) {
      this.queryParams.areas = this.queryParams.areas.filter((a) => a !== area)
    },
    toggleTab (tab) {
      const query = pick(this.$route.query, ['userId', 'salesId'])
      const {
        query: { id }
      } = this.$route
      if (id && tab.index === '0') {
        this.$router.push({ name: 'qwt-update-promotion-list', query })
      }
    },

    async editeBudget (row) {
      this.dailyBudget = {
        id: row.id,
        value: (row.daily_budget / 100).toFixed(2)
      }
    },
    async modifyBudget (id, landingPageId, campaignIds) {
      const budget = this.budgetMap[id]
      if (!(budget > 0 && budget < 10000000)) {
        return this.$message.error('请设置合理的预算')
      }
      const opts = {
        campaignIds: [id],
        dailyBudget: budget
      }
      await updateCampaignDailyBudget(opts)
      this.$emit('reload-promotion', landingPageId, campaignIds, true)
      this.budgetMap = {
        ...this.budgetMap,
        [id]: undefined
      }
      this.$message.success('今日预算修改成功')
    },
    async fetchlandingPageList () {
      this.landingPageLoading = true
      // 重置campaignMap
      this.campaignMap = {}
      try {
        const result = await getCampaignLanding(this.queryParams)
        const { total, ...pageList } = result
        this.totalPage = total
        // toCamelcase 插件有个坑（当object的key值为url格式时，转换对象的key有问题）
        this.landingPageList = Object.freeze(
          toCamelcase(formatlandingPageList(pageList))
        )
      } catch (err) {
        console.error(err)
      } finally {
        this.landingPageLoading = false
      }
    },
    async fetchPromotionList (id, campaignIds, isForceUpdate) {
      // 判断是否已经存在
      const campaignMap = this.campaignMap
      const campaignMapKeys = Object.keys(campaignMap)
      if (isForceUpdate || !campaignMapKeys.includes(id)) {
        const campaigns = await getCurrentCampaigns({
          ...this.queryParams,
          campaignIds
        })
        this.campaignMap = Object.freeze({
          ...campaignMap,
          [id]: campaigns
        })
      }
    },
    async fetchSummary () {
      const [currentBalance, summary] = await Promise.all([
        getCurrentBalance(),
        getHomepageSummary()
      ])
      this.summary = summary
      this.currentBalance = currentBalance
    }
  },
  filters: {
    transformCityName (name, allAreas) {
      return getCnName(name, allAreas)
    }
  },
  computed: {
    days () {
      return Math.ceil(this.currentBalance / this.summary.budget)
    }
  },
  watch: {
    queryParams: {
      deep: true,
      handler (val) {
        if (!val.campaignId || /^[0-9]+$/.test(val.campaignId)) {
          this.fetchlandingPageList()
        } else {
          this.$message.error('您要查询的计划id格式不正确')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.top-tips {
  background-color: #fff7eb;
  color: #bd975f;
  font-size: 14px;
  padding: 5px 0 5px 30px;
  margin-bottom: 5px;
  border-radius: 2px;
}
.container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);
  color: #666;
  font-size: 14px;
  & /deep/ .el-pagination {
    display: flex;
    justify-content: center;
  }
}
.header {
  font-size: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e6e6e6;
  font-weight: 600;
}
.action-group {
  padding: 40px 30px 0;
  & .top {
    display: flex;
    align-items: center;
    padding-bottom: 34px;
    & .button {
      padding: 8px 21px;
      margin-right: auto;
    }
    & .expand-button {
      color: #35a5e4;
    }
    & .icon {
      margin-left: 10px;
      color: #666;
    }
  }
  & .column {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    text-align: left;
    margin-bottom: 25px;
    &.source {
      margin-bottom: 17px;
    }
    &.area .title {
      margin: 15px 0 5px;
    }
    & .title {
      font-weight: 600;
      text-align: left;
      width: 11%;
      height: 100%;
      max-width: 165px;
      flex: none;
      &.hightlight {
        color: #b66969;
      }
    }
    & .input {
      width: 27%;
      max-width: 380px;
      height: 38px;
    }
    & .checkbox-group {
      flex: 1;
    }
    & .icon {
      height: 100%;
      width: 50px;
      font-size: 20px;
      color: #333;
      cursor: pointer;
      margin-top: 10px;
    }
    & .tag {
      margin-right: 5px;
      margin-top: 8px;
      font-size: 13px;
      &:last-of-type {
        margin-right: 12px;
      }
    }
  }
}

.table-wrapper {
  background-color: rgba(255, 255, 255, 0.9);
}

.info {
  font-size: 14px;
  & > a {
    margin-left: 4px;
    color: #35a5e4;
  }
  & > .red {
    color: red;
    margin: 0 5px;
  }
}

.bax-cell {
  a {
    color: #35a5e4;
  }
  .el-button--text {
    color: #35a5e4;
  }
  .unit-wrapper {
    display: flex;
    align-items: center;
  }
  .unit-cell {
    width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .edite-wrapper {
    display: flex;
    align-items: center;
  }
}
</style>
