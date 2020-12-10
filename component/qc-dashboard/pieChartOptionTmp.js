export default {
  title: {
    show: true,
    text: '--个',
    subtext: '优选关键词正在\n投放百度中',
    left: 'center',
    top: '40%',
    textStyle: {
      fontSize: 16,
      lineHeight: 10,
      color: '#FF6350',
      fontWeight: 'normal',
    },
    subtextStyle: {
      fontSize: 12,
      lineHeight: 14,
      color: '#666',
    },
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
        // alignTo: 'edge',
        rich: {},
      },
      labelLine: {
        show: true,
      },
      color: ['#35a5e4', '#ffa205'],
      data: [],
    },
  ],
}
