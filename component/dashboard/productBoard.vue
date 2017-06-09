<template>
  <div>
    <div class="bar bg-light">{{title}}</div>
    <el-row :gutter="50" type="flex" justify="center">
      <el-col :span="10">
        <el-progress type="circle" :percentage="progress" :width="80" :class="classes"></el-progress>
        <input ref="input" type="number" name="target" :value="target" @key.enter="saveTarget" @blur="saveTarget" class="target" v-show="showInput">
        <div class="target" @click="clickTarget" v-show="!showInput">{{target}}</div>
      </el-col>
      <el-col :span="10">
        <h3>{{doneYesterday}}</h3>
        <h4 class="label">昨日完成</h4>
        <hr>
        <h3>{{leftEachDay}}</h3>
        <h4 class="label">剩余日均</h4>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import moment from 'moment'
import { Message } from 'element-ui'
import { setTarget } from './action'
import store from './store'

export default {
  name: 'product-board',
  props: ['title', 'target', 'done', 'doneYesterday'],
  data() {
    return {
      showInput: false
    }
  },
  computed: {
    progress() {
      if(this.target === 0) return 0
      return Math.floor(this.done / this.target * 100)
    },
    leftEachDay() {
      const days = moment().endOf('month').date()
      const passed = moment().date()
      if(passed === days || this.target <= this.done) return 0
      return Math.ceil( (this.target - this.done) / (days - passed) )
    },
    classes() {
      if(this.progress >= 100) {
        return 'gold'
      }
      if(this.progress >= 80) {
        return 'green'
      }
      return 'red'
    }
  },
  methods: {
    saveTarget(evt) {
      const value = parseInt(evt.target.value, 10)
      if(isNaN(value)) {
        Message.warning('请输入正整数')
      }
      console.log('hide')
      setTarget(store.state.range, value).then(() => {
        this.showInput = false
      })
    },
    clickTarget() {
      this.showInput = true
      setTimeout(() => {
        this.$refs.input.focus()
      })
    }
  }
}
</script>

<style scoped>
.bar {
  height: 30px;
  border-radius: 4px;
  margin: 15px 0;
  padding: 0 15px;
  line-height: 30px;
  color: #666;
}
.bg-light {
  background-color: #eef1f6;
}
.label {
  font-weight: normal;
  color: #888;
  font-size: .8em;
}
hr {
  margin: 10px 0;
  border: 1px dotted #ddd;
}
.target {
  width: 80px;
  text-align: center;
}
</style>

<style>
.gold path.el-progress-circle__path{
  stroke: gold;
}
.green path.el-progress-circle__path{
  stroke: #13ce66;
}
.red path.el-progress-circle__path{
  stroke: #ff4949;
}
</style>