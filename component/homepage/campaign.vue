<template>
  <div class="layout-container">
    <div class="layout-left">
      <h5 class="layout-header">站外推广诊断</h5>
      <div class="layout-content" v-if="chartOptions">
        <div class="chart">
          <chart :options="chartOptions" />
        </div>
        <div class="description">
          <p>您当前的推广健康度为:<strong>61.5</strong>分，</p>
          <p>已经超过<strong>11%</strong>的用户，</p>
          <p>您当前有计划未通过审核，请 <a href="javascript:;">前往修改</a></p>
          <div class="optimization">
            <p class="title">建议进行如下优化，提升广告效果</p>
            <div class="keywords">
              <span class="keyword">投放渠道</span>
              <span class="keyword">投放渠道</span>
            </div>
          </div>
          <div class="actions">
            <el-button type="primary">新建站外推广</el-button>
            <el-button type="primary">管理站外推广</el-button>
          </div>
        </div>
      </div>
      <div class="placeholder" v-else><i class="el-icon-loading" />正在站外推广数据</div>
    </div>
    <div class="layout-right">
      <h5 class="layout-header">
        站外推广数据概览
        <span class="action">查看详情</span>
      </h5>
      <div class="layout-content">
        <div class="radio-group">
          <el-radio>今日</el-radio>
          <el-radio>昨日</el-radio>
          <el-radio>过去7天</el-radio>
        </div>
        <ul class="reports">
          <li class="report">
            <h6 class="title">预算(元)</h6>
            <p class="num">100.00</p>
          </li>
          <li class="report">
            <h6 class="title">消耗(元)</h6>
            <p class="num">100.00</p>
          </li>
          <li class="report">
            <h6 class="title">展现量</h6>
            <p class="num">10</p>
          </li>
          <li class="report">
            <h6 class="title">点击量</h6>
            <p class="num">100</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import clone from 'clone'
import 'echarts/lib/chart/radar'

const chartOptionsTmpl = {
  title: {
    text: '站外推广健康度'
  },
  tooltip: {
    trigger: 'item',
    backgroundColor : 'rgba(53, 165, 228, 0.8)'
  },
  radar: [
    {
      indicator: [
        {text: '关键词', max: 100},
        {text: '投放设置', max: 100},
        {text: '账户余额', max: 100},
        {text: '日预算', max: 100},
        {text: '关键词出价', max: 100},
        {text: '创意', max: 100},
        {text: '渠道', max: 100}
      ],
      center: ['45%','55%'],
      radius: '70%',
      axisLine: {
        lineStyle: {
          color: ['#666'],
          opacity: 0.15
        }
      },
      splitLine: {
        lineStyle: {
          color: ['#ddd', '#ddd', '#ddd', '#ddd', '#ddd', '#35A5E4']
        }
      }
    }
  ],
  series: [
    {
      name: '站外推广健康度',
      type: 'radar',
      itemStyle: {
        color: ['#FF8955']
      },
      lineStyle: {
        color: ['#FF6350']
      },
      areaStyle: {
        color: ['#FF6350'],
        opacity: 0.6
      },
      data: [
        {
          value: []
        }
      ]
    }
  ]
}

const genChartOptions = value => {
    const opt = clone(chartOptionsTmpl)
    opt.series[0].data[0].value = value
    return Object.freeze(opt)
}

export default {
  name: 'homepage-campaign',
  created() {
    setTimeout(() => {
      this.chartOptions = genChartOptions([10,20,30,40,50,60,70])
    }, 100)
  },
  data() {
    return {
      chartOptions: null
    }
  }
}
</script>

<style lang="postcss" scoped>
  .layout-left {
    & .layout-content {
      display: flex;
      min-height: 288px;
    }
    & .chart {
      width: 55%;
      flex: 1;
      & >>> .echarts {
        width: 100%;
        height: 100%;
      }
    }
    & .description {
      width: 45%;
      flex: 1;
      padding-top: 25px;
      line-height: 36px;
      letter-spacing: 1px;
      & strong {
        font-size: 24px;
        font-weight: 600;
        color: #FF6350;
        margin: 0 4px;
      }
      & a {
        letter-spacing: 0;
        color: #35A5E4;
      }
    }
    & .optimization {
      line-height: 1.6;
      margin-top: 22px;
      & .title {
        font-weight: 600;
      }
      & .keyword {
        display: inline-block;
        font-size: 13px;
        margin-top: 8px;
        margin-right: 8px;
        padding: 3px 6px;
        color: #B66969;
        background-color: #FFF5F5;
        border-radius: 2px;
        cursor: pointer;
        transition: color, background-color .1s;
        &:hover {
          background-color: #ffe0e0;
          color: #B64949;
        }
      }
    }
    & .actions {
      margin-top: 25px;
      & >>> .el-button {
        padding: 8px 12px;
      }
    }
    & .placeholder {
      color: #888;
      line-height: 288px;
      text-align: center;
      font-size: 18px;
      letter-spacing: 1px;
      & .el-icon-loading {
        font-size: 20px;
        margin-right: 5px;
      }
    }
  }
  .layout-right {
    & .radio-group {
      display: flex;
      justify-content: space-around;
      width: 66%;
      max-width: 350px;
      margin: 32px auto;
      & >>> .el-radio__label {
        font-weight: 600;
      }
    }
    & .reports {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
        background-color: #fff;
        height: 16%;
        width: 18%;
        z-index: 1;
      }
      & > .report {
        flex: 1 0 50%;
        height: 110px;
        text-align: center;
        padding-top: 14px;
        line-height: 2;
        & .num {
          color: #FF4F49;
          font-size: 24px;
          font-weight: 600;
        }
        &:nth-of-type(2n + 1) {
          border-right: 1px solid #e6e6e6;
        }
        &:nth-of-type(1) {
          border-bottom: 1px solid #e6e6e6;
        }
        &:nth-of-type(2) {
          border-bottom: 1px solid #e6e6e6;
        }
      }
    }
  }
</style>
