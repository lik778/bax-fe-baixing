<template>
  <div class="promotion">
    <section>
      <div class="desc align-self">投放城市</div>
      <div class="cont">
        <el-tag type="primary"
                class="area-tag"
                :closable="!isSales"
                v-for="area in promotion.areas"
                :key="area"
                @close="onRemoveArea(area)">
          {{ formatterArea(area) }}
        </el-tag>
        <i class="el-icon-plus"
           v-if="!isSales"
           @click="areaDialogVisible = true" />
      </div>
    </section>
    <section>
      <div class="desc">投放渠道</div>
      <div class="cont">{{ SEM_PLATFORM_CN[promotion.source] }}</div>
    </section>
    <section>
      <div class="desc">渠道单日预算</div>
      <div class="cont">
        <el-input type="number"
                  class="budget-input"
                  :disabled="isSales || !modifyBudgetQuota"
                  :value="promotion.dailyBudget"
                  @input="onChangeDaliyBudget" />
        <span class="budget-tip"
              v-if="currentBalance <= 0">
          （您的推广资金可用余额为0元，请<router-link :to="{ name: 'qwt-charge', query: { mode: 'charge-only' } }">
            充值</router-link>）
        </span>
        <span class="budget-tip"
              v-else>
          (您的推广资金可用余额为<strong>￥{{ $formatter.f2y(currentBalance) }}</strong>元，
          可消耗<strong>{{ consumeDays }}</strong>天，今日可修改<strong>{{ modifyBudgetQuota }}</strong>次)
        </span>
      </div>
    </section>
    <section>
      <div class="desc">投放时段</div>
      <div class="cont">
        {{ DURATION_TYPE_OPTS[getDurationType()]}}
        <el-button class="duration-type"
                   type="primary"
                   plain
                   @click="durationSelectorVisible = true">设置</el-button>
      </div>
    </section>
    <section>
      <div class="desc">投放时间</div>
      <div class="cont">
        <el-button-group>
          <el-button :disabled="isSales"
                     v-for="(val, key) in TIME_TYPE_OPTS"
                     :key="key"
                     @click="onChangeTimeType(key)"
                     :type="timeType === key ? 'primary' : ''">
            {{ val }}
          </el-button>
        </el-button-group>
        <el-date-picker class="time-range-picker"
                        v-if="timeType === TIME_TYPE_CUSTOM"
                        :value="promotion.validTime"
                        @input="onValidTimeChange"
                        :disabled="isSales"
                        :picker-options="{ disabledDate }"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" />
      </div>
    </section>

    <section>
      <div class="desc align-self">设置否词
        <el-tooltip content="当网民的搜索词与精确否定关键词完全一致时，您的推广结果将不会展现"
                    placement="top-start">
          <i class="el-icon-question" />
        </el-tooltip>
      </div>
      <div class="cont">
        <negative-words-comp :negative-words="promotion.negativeWords"
                             v-on="$listeners" />
      </div>
    </section>

    <!-- 城市选择器 -->
    <area-selector :all-areas="allAreas"
                   :areas="promotion.areas"
                   type="qwt"
                   :visible="areaDialogVisible"
                   :enable-china="false"
                   @ok="onChangeAreas"
                   @cancel="areaDialogVisible = false" />

    <!-- 投放时段设置 -->
    <duration-selector :visible="durationSelectorVisible"
                       :platform="Number(promotion.source)"
                       :schedule="getCurrentSchedule()"
                       @change="(durations) => emitPromtionData('schedule', durations)"
                       @hide="durationSelectorVisible = false" />
  </div>
</template>

<script>
import AreaSelector from 'com/common/area-selector'
import DurationSelector from 'com/common/duration-selector'
import NegativeWordsComp from 'com/common/qwt/negative-words'

import { getCnName, isQwtEnableCity } from 'util/meta'
import { disabledDate } from 'util/element'
import {
  semPlatformCn,
  MIN_DAILY_BUDGET,
  TIME_TYPE_OPTS,
  TIME_TYPE_CUSTOM,
  TIME_TYPE_LONG,
  DURATION_TYPE_ALL,
  DURATION_TYPE_PART,
  SOGOU_MAX_DURATION,
  EXCLUDE_SOGOU_MAX_DURATION,
  DURATION_TYPE_OPTS,
  SEM_PLATFORM_SOGOU
} from 'constant/fengming'

export default {
  props: {
    allAreas: {
      type: Array,
      required: true
    },
    isSales: {
      type: Boolean,
      required: true,
      default: true
    },
    promotion: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    currentBalance: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data () {
    return {
      timeType: TIME_TYPE_LONG,
      areaDialogVisible: false,
      durationSelectorVisible: false,

      SEM_PLATFORM_CN: semPlatformCn,
      MIN_DAILY_BUDGET,
      TIME_TYPE_OPTS,
      TIME_TYPE_CUSTOM,
      DURATION_TYPE_OPTS
    }
  },
  computed: {
    modifyBudgetQuota () {
      const n = Math.floor(this.promotion.budgetModificationCount)
      const q = 5 - n
      return q < 0 ? 0 : q
    },
    consumeDays () {
      if (!this.promotion.dailyBudget) return 0
      return Math.floor(this.currentBalance / (this.promotion.dailyBudget * 100))
    }
  },
  methods: {
    disabledDate,
    formatterArea (name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },
    getCurrentSchedule () {
      const schedule = this.promotion.schedule
      return Array.isArray(schedule) ? schedule.join(',') : schedule
    },
    getDurationType () {
      const { schedule, source } = this.promotion
      if (!schedule) return DURATION_TYPE_ALL
      const sum = schedule.reduce((a, b) => a + b, 0)
      if (source === SEM_PLATFORM_SOGOU) {
        return sum < SOGOU_MAX_DURATION ? DURATION_TYPE_PART : DURATION_TYPE_ALL
      }
      return sum < EXCLUDE_SOGOU_MAX_DURATION ? DURATION_TYPE_PART : DURATION_TYPE_ALL
    },
    emitPromtionData (type, data) {
      this.$emit('update-promotion', type, data)
    },
    onChangeAreas (areas) {
      // tip: 过滤百度无法投放的城市
      const qwtEnableAreas = areas.filter(o => isQwtEnableCity(o, this.allAreas))
      this.emitPromtionData('areas', qwtEnableAreas)
      this.areaDialogVisible = false
    },
    onRemoveArea (area) {
      this.emitPromtionData('areas', this.promotion.areas.filter(i => i !== area))
    },
    onChangeDaliyBudget (val) {
      if (isNaN(val)) return
      if (val * 100 > this.currentBalance) return
      if (val < 0) return
      this.emitPromtionData('dailyBudget', Number(val))
    },
    onValidTimeChange (val) {
      this.emitPromtionData('validTime', val)
    },
    onChangeTimeType (val) {
      this.timeType = val
      let validTime = []
      if (val === TIME_TYPE_LONG) {
        validTime = [null, null]
      }
      this.onValidTimeChange(validTime)
    }
  },
  watch: {
    'promotion.validTime' (v) {
      if (v.length && v[0] === null) {
        this.timeType = TIME_TYPE_LONG
      } else {
        this.timeType = TIME_TYPE_CUSTOM
      }
    }
  },
  components: {
    AreaSelector,
    DurationSelector,
    NegativeWordsComp
  }
}
</script>

<style lang="scss" scoped>
.promotion {
  > section {
    display: flex;
    align-items: center;
    font-size: 14px;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    .el-icon-question {
      cursor: pointer;
    }
    .desc {
      flex-shrink: 0;
      width: 100px;
      margin-right: 10px;
      &.align-self {
        align-self: flex-start;
        margin-top: 6px;
      }
    }
    .cont {
      flex: 1;
      .el-icon-plus {
        cursor: pointer;
        font-weight: bold;
        font-size: 16px;
      }
      .area-tag {
        margin-right: 5px;
        margin-bottom: 5px;
      }
      .budget-input {
        width: 230px;
        margin-right: 10px;
      }
      .budget-tip {
        font-size: 12px;
        color: #6a778c;
        > strong {
          color: $c-strong;
        }
      }
      .duration-type {
        margin-left: 10px;
      }
      .time-range-picker {
        position: relative;
        top: 1px;
        width: 380px;
      }
    }
  }
}
</style>
