<template>
    <section>
        <el-card class="box-card">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="标王2.0" name="first">
                    <InqueryForm :allAreas="allAreas"/>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </section>
</template>

<script>
import { InqueryForm } from './components'
export default {
  name: 'BwQueryPricePlus',
  components: {
    InqueryForm
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick () {}
  }
}
</script>

<style lang="scss" scoped>
    section{
        height: 100%;
    }
   .box-card{
       margin: 10px;
       height: 100%;
   }
</style>
