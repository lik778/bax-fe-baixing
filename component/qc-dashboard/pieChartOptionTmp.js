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
        formatter: '{b}',
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 2,
        padding: [8, 6],
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
