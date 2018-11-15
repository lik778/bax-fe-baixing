<template>
  <div class="bg">
    <main>
      <el-form :model="form" label-width="100px">
        <el-form-item label="推广关键词">
          <el-input v-model="form.keyword" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="推广平台">
          <el-checkbox-group v-model="form.platforms">
            <el-checkbox label="电脑" name="type"></el-checkbox>
            <el-checkbox label="手机" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="推广区域">
          <el-tag type="success" closable class="kw-tag"
            v-for="area in form.areas" :key="area"
            @close="removeArea(area)"
          >
            {{ formatArea(area) }}
          </el-tag>
          <i class="el-icon-plus" @click="areaDialogVisible = true"></i>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryPrice">查价</el-button>
        </el-form-item>
      </el-form>

      <hr>

      <label>查询结果</label>
      <result-row :value="exactMatch" @change="onSelected" />

      <label>推荐近似关键词</label>
      <result-row v-for="item in recommends" :key="item.keyword"
        :value="item" @change="onSelected" />
      <label>关键词: "{{exactMatch.keyword}}"</label>


      <area-selector type="qwt" :all-areas="allAreas"
        :areas="form.areas"
        :visible="areaDialogVisible"
        :enable-china="false"
        @ok="onAreasChange"
        @cancel="areaDialogVisible = false"
      />
    </main>

  </div>
</template>

<script>
  import AreaSelector from 'com/common/area-selector'
  import ResultRow from './result-row'

  import {
    f2y,
    fmtAreasInQwt,
    getCnName
  } from 'util'

  export default {
    name: 'bw-query-price',
    components: {
      AreaSelector,
      ResultRow
    },
    props: {
      userInfo: {
        type: Object,
        required: true
      },
      allAreas: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        form: {
          keyword: '',
          platforms: [],
          areas: []
        },
        results: [{
          keyword: '123',
          price: {
            '30': 50000,
            '90': 150000
          }
        }, {
          keyword: '234',
          price: {
            '30': 2300,
            '90': 80000
          }
        }],
        selected: [],


        areaDialogVisible: false,
      }
    },
    computed: {
      exactMatch() {
        return this.results.slice(0, 1)
      },
      recommends() {
        return this.results.slice(1)
      }
    },
    methods: {
      onAreasChange(areas) {
        this.form.areas = [...areas]
        this.areaDialogVisible = false
      },
      formatArea(name) {
        return getCnName(name, this.allAreas)
      },
      removeArea(area) {
        this.form.areas = [
          ...this.form.areas.filter(i => i !== area)
        ]
      },
      queryPrice() {

      }
    }
  }
</script>

<style lang="postcss" scoped>
div.bg {
  padding: 10px 10px 30px 10px;
  background-color: #f4f4f4;

  & > main {
    background-color: #fff;
    padding: 20px 0 10px 20px;
    box-shadow: 0px 2px 9px 0px rgba(83, 95, 127, .1);
  }
}
</style>
