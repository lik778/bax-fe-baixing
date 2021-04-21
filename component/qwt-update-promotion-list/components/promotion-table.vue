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
            <el-table-column prop="opt" label="优化项" align="center" :formatter="(row) => filterOptimization(row)"/>
            <el-table-column prop="status_text" label="状态" align="center">
                <template slot-scope="scope">
                  <el-popover
                    trigger="hover"
                    placement="top"
                  >
                    <p>您的推广在{{ scope.row.status_text}}中</p>
                    <span
                      slot="reference"
                      class="name-wrapper"
                    >
                      {{ scope.row.status_text }}
                    </span>
                  </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="source" label="渠道" align="center" :formatter="(row, column, cellValue) => semPlatformCn[cellValue]" />
                <el-table-column
                    prop="groups"
                    label="单元"
                    align="center"
                    width="300"
                >
                <template slot-scope="scope">
                  <div class="unit-wrapper">
                    <p class="unit-cell">
                      <span
                        class="unit-item"
                        v-for="group in scope.row.groups"
                        :key="group.id"
                      >{{ group.name }}、</span>
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
                    <el-popconfirm title="确定要修改预算吗?" @confirm="modifyBudget(dailyBudget)">
                      <el-button slot="reference" type="text">确定</el-button>
                    </el-popconfirm>
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
            <el-table-column prop="today_cost" label="今日消耗" align="center" />
            <el-table-column
                prop=""
                label="操作"
                align="center"
                width="150"
              >
                <template slot-scope="scope">
                  <el-popconfirm title="确定要暂停吗?" @confirm="pausePromote(scope.row.id)">
                    <el-button slot="reference" type="text">暂停</el-button>
                  </el-popconfirm>
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
    </div>
</template>

<script>
import { semPlatformCn } from 'constant/fengming'
import { filterOptimization } from '../constant'
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
  data () {
    return {
      semPlatformCn,
      filterOptimization,
      dailyBudget: {
        id: '',
        value: 0
      }
    }
  },
  methods: {
    async editeBudget (row) {
      this.dailyBudget = {
        id: row.id,
        value: (row.daily_budget / 100).toFixed(2)
      }
    },
    updateBudgetEditeStatus () {
      this.dailyBudget.id = undefined
    },
    modifyBudget () {
      this.$emit('modifyBudget', this.dailyBudget)
    },
    pausePromote (id) {
      this.$emit('pause', id)
    }
  }
}
</script>

<style lang="scss" scoped>
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
    display: flex;
    justify-content: flex-end;
  }
  .edite-wrapper {
    display: flex;
    align-items: center;
  }
}
</style>
