import dayjs from 'dayjs'
export const chartLineOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
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
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      lineStyle: {
        width: 1
      },
      itemStyle: {
        // 普通样式。
        normal: {
          // 点的颜色。
          color: '#5099d8'
        }
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 14
      }
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
