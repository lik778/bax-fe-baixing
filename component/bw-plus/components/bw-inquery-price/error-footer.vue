<template>
    <section class="footer">
        <p v-if="!queryResult.error && queryResult.overHeat">{{queryResult.overHeatWords.join("、")}}PV过热，暂不支持购买</p>
        <p v-if="queryResult.error && !queryResult.overHeat">{{queryResult.errorWords.join("、")}}未获取到热度，请重试</p>
        <p v-if="queryResult.error && queryResult.overHeat">{{queryResult.overHeatWords.join("、")}}热度>2000，{{queryResult.errorWords.join("、")}}未获取到热度</p>
        <p v-if="queryResult.industryError">{{queryInfo.industryCn}}太热，暂无报价</p>
        <!-- <el-button @click="isSubmit = true" style="margin-top: 30px" type="danger">申请人工报价</el-button> -->
    </section>
</template>
<script>
export default {
  name: 'error-footer',
  props: {
    queryResult: {
      type: Object,
      default: () => {},
      require: true
    }
  }
}
</script>
