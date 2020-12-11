export default {
  series: [
    {
      type: 'liquidFill',
      radius: '75%',
      data: [],
      color: ['#80c2fb', '#6caaf8', '#80c2fb'],
      amplitude: '3%',
      silent: true,
      period: (value, index) => Math.floor(Math.random() * index * 2000) + 1000,
      waveAnimation: 1800,
      itemStyle: {
        shadowBlur: 0,
      },
      label: {
        formatter() {
          return '{num|---} {sub|次}'
        },
        position: ['52%', '32%'],
        color: '#FF6350',
        fontSize: 20,
        fontWeight: 'normal',
        rich: {
          num: {
            fontSize: 14,
          },
          sub: {
            fontSize: 12,
            verticalAlign: 'bottom',
          },
        },
      },
      outline: {
        borderDistance: 0,
        itemStyle: {
          borderWidth: 7,
          borderColor: '#35a5e4',
          shadowBlur: 0,
        },
      },
      backgroundStyle: {
        color: '#f4f9ff',
        borderColor: 'white',
        borderWidth: 8,
      },
    },
  ],
}
