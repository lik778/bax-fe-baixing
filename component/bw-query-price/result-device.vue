<template>
  <div class="row">
    <div class="label">关键词:
      <span class="keyword">{{deviceObj.word}}</span>
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
  }
}
</style>
