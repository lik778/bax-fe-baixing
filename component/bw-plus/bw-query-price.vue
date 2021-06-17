<template>
    <section class="bw-query-price">
        <el-card class="box-card">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="标王2.0" name="first">
                    <InqueryForm :allAreas="allAreas"/>
                    <section class="bw-query-price_item">
                      <Title title="关键词热度明细"/>
                      <KeywordHotDetail :tableData="keywordHots"/>
                    </section>
                    <section class="bw-query-price_item">
                      <Title title="查价结果" extra="请选择需要的平台*时段*时长"/>
                      <InqueryResult :tableData="inqueryResult" />
                    </section>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </section>
</template>

<script>
import { InqueryForm, KeywordHotDetail, Title, InqueryResult } from './components'
export default {
  name: 'BwQueryPricePlus',
  components: {
    InqueryForm,
    KeywordHotDetail,
    Title,
    InqueryResult
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      keywordHots: [
        {
          keyword: '总热度',
          pcHot: 60,
          wapHot: 40
        },
        {
          keyword: '发电机',
          pcHot: 40,
          wapHot: 20
        },
        {
          keyword: '发电机哪家强',
          pcHot: 20,
          wapHot: 20
        }
      ],
      inqueryResult: [
        {
          type: '360天',
          bothse: 38766,
          bothfe: 29800,
          wapse: 29640,
          wapfe: 18800,
          pcse: 25700,
          pcfe: 19800
        },
        {
          type: '360天',
          bothse: 38766,
          bothfe: 29800,
          wapse: 29640,
          wapfe: 18800,
          pcse: 25700,
          pcfe: 19800
        }
      ]
    }
  },
  methods: {
    handleClick () {}
  }
}
</script>

<style lang="scss" scoped>
    .bw-query-price{
        height: 100%;
        &_item{
          margin-bottom: 20px;
        }
    }
   .box-card{
       margin: 10px;
   }
</style>
