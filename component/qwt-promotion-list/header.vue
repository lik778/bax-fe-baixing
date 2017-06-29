
<template>
  <header class="qwt-promotion-header">
    <section>
      <span>
        <bax-input placeholder="请输入订单号" icon="search">
        </bax-input>
        <el-button @click="switchShowMoreFilters">
          更多筛选<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </span>
      <span>
        <el-button type="primary" icon="plus"
          @click="gotoCreatePromotion">
          新建推广计划
        </el-button>
      </span>
    </section>
    <section v-if="showMoreFilters">
      <div>
        <span class="filter-item">
          <label>投放状态</label>
          <bax-select :options="[]" clearable></bax-select>
        </span>
        <span class="filter-item">
          <label>投放区域</label>
          <bax-select :options="[]" clearable></bax-select>
        </span>
      </div>
    </section>
  </header>
</template>

<script>

import BaxSelect from 'com/common/select'
import BaxInput from 'com/common/input'

import {
  switchShowMoreFilters
} from './action'

export default {
  name: 'qwt-promotion-header',
  components: {
    BaxSelect,
    BaxInput
  },
  props: {
    showMoreFilters: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {
    switchShowMoreFilters() {
      switchShowMoreFilters()
    },
    gotoCreatePromotion() {
      this.$router.push({
        name: 'qwt-create-promotion'
      })
    }
  }
}

</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.qwt-promotion-header {
  & > section:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
    width: 100%;

    & > span:first-child {
      display: flex;
      align-items: center;

      & > .el-input {
        margin-right: 10px;
      }
    }
  }

  & > section:nth-child(2) {
    @mixin top-filter;

    & > div {
      display: flex;
      align-items: center;

      & > span {
        display: flex;
        flex-grow: 0.5;
      }

      & > span:last-child {
        margin-left: 60px;
      }
    }
  }
}

</style>
