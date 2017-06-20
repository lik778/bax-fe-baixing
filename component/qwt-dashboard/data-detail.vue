
<template>
  <div class="qwt-dashboard-data-detail">
    <header>
      数据详情
    </header>
    <section>
      <span>
        <label>自定义列:</label>
        <bax-select multiple :options="columnOpts"
          v-model="displayColumns" />
      </span>
      <span>
        <el-button icon="view" type="primary">
          下载
        </el-button>
      </span>
    </section>
    <main>
      <el-table :data="data">
        <el-table-column v-if="checkVisiable('channel')"
          prop="channel" label="渠道" />
        <el-table-column v-if="checkVisiable('platform')"
          prop="platform" label="设备"  />
        <el-table-column v-if="checkVisiable('keyword')"
          prop="keyword" label="关键词" />
        <el-table-column v-if="checkVisiable('impr')"
          prop="impr" label="展现" />
        <el-table-column v-if="checkVisiable('click')"
          prop="click" label="点击"  />
        <el-table-column v-if="checkVisiable('cost')"
          prop="cost" label="消费" />
        <el-table-column v-if="checkVisiable('percent')"
          prop="percent" label="点击率" />
      </el-table>
    </main>
  </div>
</template>

<script>

import BaxSelect from 'com/common/select'

// {
//   label: '全选',
//   value: '_all_'
// }

const columnOpts = [{
  label: '渠道',
  value: 'channel'
}, {
  label: '设备',
  value: 'platform'
}, {
  label: '关键词',
  value: 'keyword'
}, {
  label: '展现',
  value: 'impr'
}, {
  label: '点击',
  value: 'click'
}, {
  label: '消费',
  value: 'cost'
}, {
  label: '点击率',
  value: 'percent'
}]

export default {
  name: 'qwt-dashboard-data-detail',
  components: {
    BaxSelect
  },
  props: {
    statistics: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      displayColumns: columnOpts.map(c => c.value),
      data: [{}, {}, {}, {}, {}],
      columnOpts
    }
  },
  methods: {
    checkVisiable(column) {
      const { displayColumns } = this

      if (displayColumns.includes('_all_')) {
        return true
      }

      return displayColumns.includes(column)
    }
  }
}

</script>

<style scoped>

.qwt-dashboard-data-detail {
  margin: 50px 0 30px;

  & > header {
    display: flex;
    align-items: center;
    height: 35px;
    padding-left: 30px;
    border-radius: 3px;
    background: #e5e9f2;
    font-size: 14px;
    color: #6a778c;
  }

  & > section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 68px;
    padding: 10px 15px 10px 5px;

    & > span:first-child {
      display: flex;
      align-items: center;
      min-width: 480px;

      & > label {
        margin-right: 25px;
        font-size: 14px;
        color: #6a778c;
      }

      & > div {
        flex-grow: 1;
      }
    }
  }
}

</style>
