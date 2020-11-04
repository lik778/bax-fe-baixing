export default {
  title: {
    show: false
  },
  tooltip: {
    trigger: 'axis'
  },
  color: 'rgba(53, 165, 228, 1)',
  legend: {
    left: 5,
    selectedMode: false,
    icon: 'path://M0 0h120v20H0z'
  },
  grid: {
    top: '16%',
    left: '2%',
    right: '2%',
    bottom: '2%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      alignWithLabel: true,
      lineStyle: {
        color: '#ccc'
      }
    },
    data: [
      '2020-10-21',
      '2020-10-22',
      '2020-10-23',
      '2020-10-24',
      '2020-10-25',
      '2020-10-26',
      '2020-10-27'
    ]
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: '#e3e3e3'
      }
    }
  }
}
