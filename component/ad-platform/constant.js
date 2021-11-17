import dayjs from 'dayjs'
import { f2y } from 'util'
const commonOptions = {
  type: 'line',
  lineStyle: {
    width: 1
  },
  label: {
    show: true,
    position: 'top',
    fontSize: 14
  }
}
export const chartLineOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['消耗', '展现', '点击', '平均点击单价']
  },
  xAxis: {
    type: 'category',
    data: [dayjs().format('YYYY-MM-DD')],
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    nameTextStyle: {
      color: '#5099d8'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisPointer: {
      show: true
    }
  },
  series: [
    {
      name: '消耗',
      id: 'cost',
      stack: 'cost',
      data: [],
      render: (value) => f2y(value),
      ...commonOptions
    },
    {
      name: '展现',
      id: 'show',
      stack: 'show',
      render: (value) => value,
      data: [],
      ...commonOptions
    },
    {
      name: '点击',
      id: 'click',
      stack: 'click',
      render: (value) => value,
      data: [],
      ...commonOptions
    },
    {
      name: '平均点击单价',
      id: 'avgClickCost',
      stack: 'avgClickCost',
      render: (value) => f2y(value),
      data: [],
      ...commonOptions
    }
  ]
}

export const chartPieOptions = {
  legend: {
    top: 'bottom'
  },
  toolbox: {
    show: true,
    feature: {
      mark: { show: true },
      dataView: { show: true, readOnly: false },
      restore: { show: true },
      saveAsImage: { show: true }
    }
  },
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: [50, 250],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
      data: [
        { value: 40, name: 'rose 1' },
        { value: 38, name: 'rose 2' },
        { value: 32, name: 'rose 3' },
        { value: 30, name: 'rose 4' },
        { value: 28, name: 'rose 5' },
        { value: 26, name: 'rose 6' },
        { value: 22, name: 'rose 7' },
        { value: 18, name: 'rose 8' }
      ]
    }
  ]
}
