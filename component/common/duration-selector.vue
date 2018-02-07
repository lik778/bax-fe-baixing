
<template>
  <el-dialog title="推广时间选择" :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
    width="760px">
    <main class="main">
      <header>
        <span>
          <el-button size="mini" @click="reset">
            重置
          </el-button>
          <el-button size="mini" type="primary" @click="checkAll">
            全选
          </el-button>
        </span>
        <span>
          <p class="on"></p>
          <label>推广时间段</label>
          <p class="off"></p>
          <label>暂停时间段</label>
        </span>
      </header>
      <content>
        <section class="table">
          <aside>
            <div v-for="(d, i) in days" :key="d">
              <el-checkbox :value="rowChecked(i)"
                @change="() => clickRow(i)">
              </el-checkbox>
              <label>星期{{ d }}</label>
            </div>
          </aside>
          <aside>
            <div v-for="h in durations" :key="h">
              <div>
                <el-checkbox :value="columnChecked(h)"
                  @change="() => clickColumn(h)">
                </el-checkbox>
              </div>
              <p v-for="(day, i) in days" :key="day"
                @click="() => clickFlag(i, h)"
                :class="flagChecked(i, h) ? 'on' : 'off'">
                {{ h }}
              </p>
            </div>
          </aside>
        </section>
        <section class="tips">
          <li>说明</li>
          <li v-for="(t, i) in tips" :key="i">
            {{ t }}
          </li>
        </section>
      </content>
    </main>
    <footer slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="ok">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import padstart from 'lodash.padstart'
import { Message } from 'element-ui'

import {
  SEM_PLATFORM_SOGOU,
  SEM_PLATFORM_BAIDU,
  SEM_PLATFORM_QIHU
} from 'constant/fengming'

export default {
  name: 'bax-duration-selector',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    platform: {
      type: Number,
      required: true
    },
    schedule: {
      // '123,456,444' 或者 'all'
      type: String
    }
  },
  data() {
    return {
      days: ['一', '二', '三', '四', '五', '六', '日'],
      // key: value -> 'day-hour': true/false
      // 例如: '0-0': true 表示: 周一, 0 时 选中
      clickedFlags: {}
    }
  },
  computed: {
    tips() {
      const { platform } = this

      switch (platform) {
        case SEM_PLATFORM_SOGOU:
          return [
            '1、示例一:  当您选择了星期一的【12】点，则推广时间段为星期一的12：00-12：59',
            '2、示例二:  当您选择了星期六的【8、9、10、11】，则推广时间段为星期六的8：00-11：59',
            '3、默认全时段推广，点击“重置”可恢复默认推广时段',
            '4、行、列的勾选框“√”实现行、列全选，点击数字可选择某天的某一时段',
            '5、每日【0】点到【4】点为搜狗系统维护时间，暂不支持开启推广'
          ]
        case SEM_PLATFORM_BAIDU:
          return [
            '1、示例一:  当您选择了星期一的【12】点，则推广时间段为星期一的12：00-12：59',
            '2、示例二:  当您选择了星期六的【8、9、10、11】，则推广时间段为星期六的8：00-11：59',
            '3、默认全时段推广，点击“重置”可恢复默认推广时段',
            '4、行、列的勾选框“√”实现行、列全选，点击数字可选择某天的某一时段'
          ]
        case SEM_PLATFORM_QIHU:
          return [
            '1、示例一:  当您选择了星期一的【12】点，则推广时间段为星期一的12：00-12：59',
            '2、示例二:  当您选择了星期六的【8、9、10、11】，则推广时间段为星期六的8：00-11：59',
            '3、默认全时段推广，点击“重置”可恢复默认推广时段',
            '4、行、列的勾选框“√”实现行、列全选，点击数字可选择某天的某一时段'
          ]
        default:
          return ['大虫姐还没想好 ~']
      }
    },
    durations() {
      switch (this.platform) {
        case SEM_PLATFORM_SOGOU:
          return [
            5, 6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16, 17,
            18, 19, 20, 21, 22, 23
          ]
        case SEM_PLATFORM_BAIDU:
        case SEM_PLATFORM_QIHU:
        default:
          return [
            0, 1, 2, 3, 4,
            5, 6, 7, 8, 9, 10, 11,
            12, 13, 14, 15, 16, 17,
            18, 19, 20, 21, 22, 23
          ]
      }
    }
  },
  methods: {
    initClickedFlags(schedule) {
      if (!schedule) {
        // clear
        this.clickedFlags = {}
        return
      }

      if (schedule === 'all') {
        this.clickedFlags = {}
        this.durations.forEach(d => this.clickColumn(d))
        return
      }

      const durations = schedule.split(',')

      if (durations.length !== 7) {
        console.error('invalid schedule')
        return
      }

      this.clickedFlags = {}

      for (let i = 0; i < 7; i++) {
        const d = durations[i]
        let s = parseInt(d).toString(2)
        s = padstart(s, 24, '0')

        for (let x = 0; x < 24; x++) {
          if (s[x] === '1') {
            this.clickedFlags[i + '-' + x] = true
          }
        }
      }
    },
    getCheckedDurations() {
      const g = (new Array(7)).fill()
        .map(() => [...(new Array(24)).fill(false)])

      const flags = this.clickedFlags

      Object.keys(flags).forEach(k => {
        if (flags[k]) {
          const [day, hour] = k.split('-')
          g[day | 0][hour | 0] = true
        }
      })

      return g.map(a => {
        const s = a.map(i => i ? '1' : '0').join('')
        return parseInt(s, 2)
      })
    },
    flagChecked(day, hour) {
      const v = this.clickedFlags[day + '-' + hour]
      if (typeof v === 'boolean') {
        return v
      }

      return false
    },
    columnChecked(hour) {
      const flags = this.clickedFlags
      const a = Object.keys(flags)
        .filter(k => {
          return k.split('-').pop() === String(hour) &&
            flags[k]
        })

      return a.length === 7
    },
    rowChecked(day) {
      const flags = this.clickedFlags
      const a = Object.keys(flags)
        .filter(k => {
          return k.split('-').shift() === String(day) &&
            flags[k] === true
        })

      return a.length === this.durations.length
    },
    clickFlag(day, hour) {
      this.clickedFlags[day + '-' + hour] = !this.flagChecked(day, hour)
      this.$forceUpdate()
    },
    clickColumn(hour) {
      const allChecked = this.columnChecked(hour)
      const len = this.days.length

      for (let i = 0; i < len; i++) {
        this.clickedFlags[i + '-' + hour] = !allChecked
      }

      this.$forceUpdate()
    },
    clickRow(day) {
      const { durations } = this
      const allChecked = this.rowChecked(day)
      const len = durations.length

      for (let i = 0; i < len; i++) {
        this.clickedFlags[day + '-' + durations[i]] = !allChecked
      }

      this.$forceUpdate()
    },
    checkAll() {
      this.initClickedFlags('all')
      this.$forceUpdate()

      // const durations = this.getCheckedDurations()
      // this.$emit('change', durations)
    },
    reset() {
      if (this.schedule && this.schedule !== 'all') {
        // 说明: all 是 component 默认设置, reset 是 reset 到目前 server 真正的 设置
        this.initClickedFlags(this.schedule)
      } else {
        this.initClickedFlags()
      }

      this.$forceUpdate()

      // const durations = this.getCheckedDurations()
      // this.$emit('change', durations)
    },
    cancel() {
      this.reset()
      this.$emit('hide')
    },
    ok() {
      const durations = this.getCheckedDurations()
      if (durations.reduce((a, b) => a + b, 0) === 0) {
        return Message.error('投放时段不能为空')
      }

      this.$emit('change', durations)
      this.$emit('hide')
    }
  },
  watch: {
    schedule(now, pre) {
      if (now !== pre) {
        this.initClickedFlags(now)
      }
    }
  },
  mounted() {
    this.initClickedFlags(this.schedule)
  }
}
</script>

<style scoped>

@import 'cssbase/mixin';

.on, .off {
  @mixin center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.on {
  background: #01d1c1;
  color: white;
}

.off {
  background: #eeeeee;
  color: black;
}

.table {
  display: flex;
  margin-top: 15px;

  & > aside:first-child {
    padding-top: 30px;

    & > div {
      margin-top: 10px;
      height: 20px;
    }
  }

  & > aside:last-child {
    display: flex;
    margin-left: 15px;

    & > div {
      margin: 0 5px;

      & > div, & > p {
        margin-top: 10px;
      }
    }
  }
}

.tips {
  margin-top: 20px;

  & > li {
    margin: 5px 0;
  }
}

.main {
  min-width: 620px;

  & > header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > span {
      @mixin center;
      width: 260px;

      & > label {
        margin: 0 5px;
      }
    }
  }

  & > content {
    display: flex;
    flex-flow: column;
    align-items: center;
    font-size: 14px;
  }
}

</style>
