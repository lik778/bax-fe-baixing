<template>
    <div class="date-range">
          <el-button class="date-range-panel"
                    :class="{'date-range-panel__active': item.label === activeDaterangeLabel}"
                    v-for="item in daterangeList"
                    :key="item.id"
                    size="small"
                    @click="handleDateChange(item)">
            {{item.label}}
          </el-button>
          <el-date-picker v-model="daterange"
                          :picker-options="triPickerOptions"
                          @focus="activeDaterangeLabel = CUSTOM_DATE_RANGE_LABEL"
                          :class="{
                            'date-range-custom__active': activeDaterangeLabel === CUSTOM_DATE_RANGE_LABEL
                          }"
                          :clearable="false"
                          type="daterange"
                          size="small"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          @change="dataPickerChange">
          </el-date-picker>
        </div>
</template>
<script>
import dayjs from 'dayjs'
const daterangeList = [
  {
    id: 1,
    label: '昨日',
    daterange: [
      dayjs().subtract(1, 'day'),
      dayjs().subtract(1, 'day')
    ]
  },
  {
    id: 2,
    label: '近7天',
    daterange: [
      dayjs().subtract(8, 'day').startOf('date'),
      dayjs().subtract(1, 'day')
    ]
  },
  {
    id: 3,
    label: '本月',
    daterange: [
      dayjs().startOf('month'),
      dayjs().subtract(1, 'day')
    ]
  },
  {
    id: 4,
    label: '上月',
    daterange: [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month')
    ]
  }
]
const CUSTOM_DATE_RANGE_LABEL = 'custom'
export default {
  name: 'data-range',
  data () {
    return {
      daterangeList,
      activeDaterangeLabel: daterangeList[1].label,
      daterange: daterangeList[1].daterange,
      CUSTOM_DATE_RANGE_LABEL,
      triPickerOptions: {
        disabledDate (time) {
          const timestamp = new Date(time).getTime()
          const yesterday = dayjs().subtract(1, 'day').valueOf()
          const lastYear = dayjs().subtract(1, 'year').valueOf()
          return timestamp > yesterday || timestamp < lastYear
        }
      }
    }
  },
  mounted () {
    console.log('----', this.daterange)
    this.$emit('getDate', this.daterange)
  },
  methods: {
    handleDateChange (item) {
      this.activeDaterangeLabel = item.label
      this.$emit('searchData', item.daterange)
    },
    dataPickerChange (item) {
      this.$emit('searchData', [dayjs(item[0]), dayjs(item[1])])
    }
  }
}
</script>

<style lang="scss" scoped>
  .date-range-panel {
        margin-right: 7px;
        margin-top: 15px;
        &.date-range-panel__active {
          background: #fff;
          border-color: #ff8273;
          color: #ff8273;
        }
  }
  .date-range-custom__active {
    border-color: #ff8273;
  }
</style>
