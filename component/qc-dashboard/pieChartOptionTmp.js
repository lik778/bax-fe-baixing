export default {
  title: {
    show: true,
    text: '平台词数',
    subtext: '当前在线词数',
    left: 'center',
    top: '43%',
    textStyle: {
      fontSize: 16,
      lineHeight: 10
    }
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: ['45%', '75%'],
      // radius: ['50%', '92%'],
      label: {
        // position: 'inner'
        formatter: '{richri|{b}}',
        backgroundColor: 'white',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 2,
        margin: 20,
        padding: [8, 6],
        alignTo: 'edge',
        rich: {}
      },
      labelLine: {
        show: true
      },
      color: ['#35a5e4', '#ffa205'],
      data: []
    }
  ]
}
