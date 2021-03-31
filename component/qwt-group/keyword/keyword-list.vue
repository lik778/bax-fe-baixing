<template>
  <div class="keyword-list">
    <el-table :data="data">
      <el-table-column label="关键词" min-width="140" key="word">
        <template slot-scope="{row}">
          {{ row.word }}
          <span class="new-word" v-if="row.isNew">(新)</span>
          <span class="new-word">
            {{ RECOMMAND_SOURCES.includes(row.recommandSource) ? '(好词)': '' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showPropRanking"
        key="cpcRanking"
        min-width="120" label="电脑端排名"
        :formatter="r => fmtCpcRanking(r.cpcRanking || -1)">
      </el-table-column>
      <el-table-column
        key="mobileCpcRanking"
        min-width="120" label="手机端排名"
        :formatter="r => fmtCpcRanking(r.mobileCpcRanking || -1)">
      </el-table-column>
      <el-table-column
        key="status"
        min-width="120"
        label="关键词状态"
        :render-header="renderWithTip(keywordStatusTip)">
        <template slot-scope="s">
          <span class="status">
            <label>
              {{ fmtStatus(s.row) }}
            </label>
            <strong v-if="fmtStatus(s.row) === '审核失败'">
              {{ getRefuseReason(s.row) }}
            </strong>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fmtCpcRanking } from 'util/campaign'
import { RECOMMAND_SOURCES, SEM_PLATFORM_SHENMA } from 'constant/fengming'

export default {
  name: 'keyword-list',
  props: {
    source: {
      type: Number,
      required: true
    }
  },
  computed: {
    showPropRanking () {
      return this.source !== SEM_PLATFORM_SHENMA
    }
  },
  data () {
    return {
      RECOMMAND_SOURCES,
      data: [
        {
          word: 'nihao',
          isNew: false
        }
      ]
    }
  },
  methods: {
    fmtCpcRanking
  }
}
</script>

<style lang="scss" scoped>
.keyword-list {
  margin-top: 20px;
  max-width: 1150px;
}
</style>
