export default {
  title: {
    show: false
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['45%', '75%'],
      label: {
        show: true,
        padding: 10,
        borderRadius: 2,
        borderWidth: 1
        // borderColor: '#888'
      },
      labelLine: {
        show: true
      },
      color: ['#35a5e4', '#ffa205'],
      data: [
        {
          name: '电脑端',
          value: 0
        },
        {
          name: '移动端',
          value: 0
        }
      ]
    }
  ]
}
