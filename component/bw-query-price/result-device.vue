<template>
  <div class="row">
    <div class="label">关键词:
      <span class="keyword">{{deviceObj.word}}</span>
      <span class="tips">根据过去<strong>90</strong>天，<strong>150</strong>人搜索过（数据来源于历史流量）</span>
    </div>
    <div>
      <div v-for="deviceI in deviceObj.deviceTypes" :key="deviceI.device">
        <result-row :priceList="deviceI.priceList"
                    :selected="selected"
                    @change="(v)=> $emit('change', v)" />
      </div>
    </div>
  </div>
</template>

<script>
  import ResultRow from './result-row'

  export default {
    name: 'result-device',
    props: {
      deviceObj: {
        type: Object,
        required: true
      },
      selected: {
        type: Array,
        required: true
      }
    },
    components: {
      ResultRow
    }
  }
</script>

<style lang="postcss" scoped>
.row {
  & .label {
    color: #999;
    & .keyword {
      display: inline-block;
      vertical-align: top;
      margin-bottom: 10px;
      color: #000;
    }
    & .tips {
      font-size: 12px;
      color: #000;
      margin-left: 15px;
      & > strong {
        font-size: 18px;
        color: #FF6350;
      }
    }
  }
}
</style>
