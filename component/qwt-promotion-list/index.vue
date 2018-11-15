<template>
  <div class="qwt-promotion-list">
    <main class="container">
      <h2 class="header">我的站外推广计划</h2>
      <div class="action-group">
        <div class="top">
          <el-button class="button" icon="el-icon-plus" type="primary">新建推广计划</el-button>
          <a href="javascript:;" class="expand-button" @click="isActionGroupExpand = !isActionGroupExpand">
            更多筛选
            <i class="el-icon-arrow-down icon" />
          </a>
        </div>
        <div v-show="isActionGroupExpand">
          <div class="column">
            <span class="title">计划id</span>
            <el-input class="input" placeholder="请输入ID查询" suffix-icon="el-icon-search"/>
          </div>
          <div class="column">
            <h6 class="title">投放状态</h6>
            <div class="checkbox-group">
              <el-checkbox-group v-model="params.status">
                <el-checkbox
                  class="checkbox"
                  v-for="c in STATUS_OPTS"               
                  :key="c.value" 
                  :label="c.value"
                >
                  {{c.label}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="column">
            <h6 class="title">渠道来源</h6>
            <div class="checkbox-group">
              <el-checkbox-group v-model="params.source">
                <el-checkbox
                  class="checkbox"
                  v-for="c in SOURCES_OPTS"               
                  :key="c.value" 
                  :label="c.value"
                >
                  {{c.label}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="column">
            <span class="title">渠道区域</span>
            <el-tag
              v-for="a in params.areas"
              @close="removeSelectedArea(a)"
              :key="a"
              type="success"
              :closable="true"
              class="tag"
            >
              {{a | transformCityName(allAreas)}}
            </el-tag>
            <i class="el-icon-plus icon" @click="areaDialogVisible = true"/>
          </div>
          <div class="column">
            <h6 class="title hightlight">投放优化</h6>
            <div class="checkbox-group">
              <el-checkbox-group v-model="params.source">
                <el-checkbox
                  class="checkbox"
                  v-for="c in SOURCES_OPTS"               
                  :key="c.value" 
                  :label="c.value"
                >
                  {{c.label}}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <list class="list"/>
    </main>
    <area-selector
      type="qwt"
      :areas="params.areas"
      :all-areas="allAreas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="handleSelectArea"
      @cancel="areaDialogVisible = false"
    />
  </div>
</template>

<script>
import {
  semPlatformOpts as SOURCES_OPTS
} from 'constant/fengming'
import {getCnName } from 'util'

import List from './list'
import AreaSelector from 'com/common/area-selector'

const STATUS_OPTS = Object.freeze(
  [
    {label: '推广中/审核中', value: 100},
    {label: '计划预算不足', value: 5},
    {label: '账户余额不足', value: -51},
    {label: '已暂停', value: -10},
    {label: '已下线', value: -1},
    {label: '审核驳回', value: -50}
  ]
)

export default {
  name: 'qwt-promotion-list',
  data() {
    return {
      STATUS_OPTS,
      SOURCES_OPTS,

      params: {
        areas: [],
        status: STATUS_OPTS.map(s => s.value).filter(v => v !== -1),
        source: []
      },

      isActionGroupExpand: false,
      areaDialogVisible: false
    }
  },
  props: ['allAreas'],
  components: {AreaSelector, List},
  methods: {
    handleSelectArea(areas) {
      
      this.params.areas = areas
      this.areaDialogVisible = false
    },
    removeSelectedArea(area) {
      console.log(area)
      this.params.areas = this.params.areas.filter(a => a !== area)
    }
  },
  filters: {
    transformCityName(name, allAreas) {
      return getCnName(name, allAreas)
    }
  },
  watch: {
    params: {
      deep: true,
      handler(val) {
        console.log({...val})
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
  .container {
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 9px 0 rgba(83, 95, 127, .10);
    color: #666;
    font-size: 14px;
  }
  .header {
    font-size: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e6e6e6;
    font-weight: 600;
  }
  .action-group {
    padding: 40px 30px 0;
    & .top {
      display: flex;
      align-items: center;
      padding-bottom: 34px;
      & .button {
        padding: 8px 21px;
        margin-right: auto;
      }
      & .expand-button {
        color: #35A5E4;
      }
      & .icon {
        margin-left: 10px;
        color: #666;
      }
    }
    & .column {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      text-align: left;
      margin-bottom: 25px;
      & .title {
        font-weight: 600;
        text-align: left;
        width: 11%;
        height: 100%;
        max-width: 165px;
        flex: none;
        &.hightlight {
          color: #B66969;
        }
      }
      & .input {
        width: 27%;
        max-width: 380px;
        height: 38px;
      }
      & .checkbox-group {
        flex: 1;
      }
      & .icon {
        height: 100%;
        width: 50px;
        font-size: 20px;
        color: #333;
        cursor: pointer;
        margin-top: 10px;
      }
      & .tag {
        margin-right: 5px;
        margin-top: 8px;
        font-size: 13px;
        &:last-of-type{
          margin-right: 12px;
        }
      }
    }
  }
  .list {
    padding: 10px 30px 30px;
  }
</style>
