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
            <el-table-column prop="name" label="单元名称" align="center" />
            <el-table-column prop="campaign_id" label="所属计划" align="center" />
            <el-table-column prop="source" label="渠道" align="center" :formatter="(row, column, cellValue) => semPlatformCn[cellValue]" />
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
            <el-table-column prop="opt" label="优化项" align="center" :formatter="(row) => filterOptimization(row)"/>
            <el-table-column prop="avg_cpc_ranking" label="关键词平均排名" />
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
  name: 'group-table',
  props: {
    list: {
      type: Array,
      require: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  data () {
    return {
      filterOptimization,
      semPlatformCn
    }
  },
  methods: {
    pausePromote (id) {
      this.$emit('pause', id)
    }
  }
}
</script>
