<template>
    <div>
        <el-table
            cell-class-name="bax-cell"
            :data="list"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            row-key="id"
            v-loading="loading"
        >
            <el-table-column prop="id" label="计划" align="center" />
            <!-- <el-table-column prop="opt" label="优化项" align="center" :formatter="(row) => filterOptimization(row)"/> -->
            <el-table-column prop="frontCampaignStatus" label="状态" align="center">
                <template slot-scope="{ row }">
                  <el-popover
                    trigger="hover"
                    placement="top"
                  >
                    <p>{{ row.frontCampaignStatusDetails}}</p>
                    <span
                      slot="reference"
                      :class="(CAMPAIGN_STATUSES[row.frontCampaignStatus] && CAMPAIGN_STATUSES[row.frontCampaignStatus].type) || 'warning'"
                    >
                      {{ row.frontCampaignStatusDesc }}
                    </span>
                  </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="渠道" align="center" :formatter="(row, column, cellValue) => semPlatformCn[cellValue]" />
              <el-table-column
                label="平台"
                align="center"
              >
              <template slot-scope="scope">
                <span v-if="semPlatformCn[scope.row.source] === '百度'">
                    {{DEVICE[scope.row.device]}}
                </span>
                <span v-else>
                    /
                </span>
              </template>
            </el-table-column>
              <el-table-column
                    prop="groups"
                    label="单元"
                    align="center"
                    width="300"
                >
                <template slot-scope="scope">
                  <div class="unit-wrapper">
                    <p class="unit-cell">
                      {{scope.row.groups.map(c => c.name).join('、')}}
                    </p>
                    <router-link
                      class="view"
                      :to="{
                        name: 'qwt-promotion-list',
                        query: {...{id: scope.row.id, ...$route.query}},
                      }"
                    >查看</router-link>
                  </div>
                </template>
              </el-table-column>

            <el-table-column
                prop="dailyBudget"
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
                    <el-popconfirm title="确定要修改预算吗?" @confirm="modifyBudget(dailyBudget)">
                      <el-button slot="reference" type="text">确定</el-button>
                    </el-popconfirm>
                  </span>
                  <span v-else>
                    <span>{{ (scope.row.dailyBudget / 100).toFixed(2) }}</span>
                    <el-button
                      type="text"
                      @click="editeBudget(scope.row)"
                    >修改</el-button>
                  </span>
                </template>
            </el-table-column>
            <el-table-column prop="todayCost" label="今日消耗" align="center" :formatter="(row, column, cellValue) => cellValue === 0 ? '-' : $formatter.f2y(cellValue)"  />
            <el-table-column
                prop=""
                label="操作"
                align="center"
                width="150"
              >
                <template slot-scope="{ row }">
                  <el-popconfirm :title="`确定要${!row.pause ? `暂停投放` : '开始投放'}吗？`" @confirm="confirm(row)">
                    <el-button :disabled="row.frontCampaignStatus === CAMPAIGN_STATUS_OFFLINE" slot="reference" type="text">{{!row.pause ? `暂停` : '投放'}}</el-button>
                  </el-popconfirm>
                  <el-button type="text" @click="optimizePromote(row)">优化</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import { semPlatformCn, CAMPAIGN_STATUSES, CAMPAIGN_STATUS_OFFLINE } from 'constant/fengming'
import { filterOptimization, DEVICE } from '../constant'
import pick from 'lodash.pick'
export default {
  name: 'promotionTable',
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  created () {
    console.log(this.list)
  },
  data () {
    return {
      semPlatformCn,
      filterOptimization,
      CAMPAIGN_STATUSES,
      CAMPAIGN_STATUS_OFFLINE,
      dailyBudget: {
        id: '',
        value: 0
      },
      DEVICE
    }
  },
  methods: {
    optimizePromote (promote) {
      const query = pick(this.$route.query, ['userId', 'salesId'])
      this.$router.push({
        name: 'qwt-update-promotion',
        params: { id: promote.id },
        query
      })
    },
    async editeBudget (row) {
      this.dailyBudget = {
        id: row.id,
        value: (row.dailyBudget / 100).toFixed(2)
      }
    },
    updateBudgetEditeStatus () {
      this.dailyBudget.id = undefined
    },
    modifyBudget () {
      this.$emit('modifyBudget', this.dailyBudget)
    },
    confirm ({ pause, id }) {
      if (pause) {
        this.$emit('active', id)
      } else {
        this.$emit('pause', id)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .bax-cell {
    .warning {
    color: $c-warning;
    font-size: 13px;
  }
  .success {
    color: $c-success;
    font-size: 13px;
  }
  .danger {
    color: $c-strong;
    font-size: 13px;
  }
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
    margin-right: 10px;
    text-align: right;
  }
  .edite-wrapper {
    display: flex;
    align-items: center;
  }
}
</style>
