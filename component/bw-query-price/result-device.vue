<template>
  <div class="row">
    <div class="label">关键词:
      <span class="keyword">{{deviceObj.word}}</span>
      <p class="tips">过去<strong>90</strong>天，
        <label v-for="devicetType in deviceObj.deviceTypes">
          <strong>{{ devicetType.shows * 3 }}</strong>人{{DEVICE[devicetType.device]}}搜索过&nbsp;
        </label><span>（数据来源于历史流量）</span>
      </p>
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
  import {DEVICE} from 'constant/biaowang'

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
    data() {
      return {
        DEVICE
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
      display: inline-block;
      font-size: 12px;
      color: #000;
      margin-left: 15px;
      &  strong {
        font-size: 18px;
        color: #FF6350;
      }
    }
  }
}
</style>
