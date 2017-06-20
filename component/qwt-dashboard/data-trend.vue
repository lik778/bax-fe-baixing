
<template>
  <div class="qwt-dashboard-data-trend">
    <header>
      2017.09 - 2017.10 数据走势图
    </header>
    <main>
      <chart :options="options" />
    </main>
  </div>
</template>

<script>

export default {
  name: 'qwt-dashboard-data-trend',
  props: {
    statistics: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      options: {
        title: {
          text: '折线图堆叠'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['0601', '0602', '0603', '0604', '0605', '0606', '0607']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '妹子基金收益',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        }]
      }
    }
  }
}

</script>

<style scoped>

.qwt-dashboard-data-trend {
  margin: 50px 0 30px;

  & > header {
    display: flex;
    align-items: center;
    height: 35px;
    padding-left: 30px;
    border-radius: 3px;
    background: #e5e9f2;
    font-size: 14px;
    color: #6a778c;
  }
}

</style>
