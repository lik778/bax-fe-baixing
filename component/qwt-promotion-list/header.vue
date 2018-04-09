
<template>
  <header class="qwt-promotion-header">
    <section>
      <span>
        <bax-input placeholder="请输入ID查询" icon="el-icon-search"
          @change="v => queryCampaigns({id: v})">
        </bax-input>
        <el-button @click="switchShowMoreFilters">
          更多筛选<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </span>
      <span>
        <el-button v-if="canCreate"
          type="primary" icon="el-icon-plus"
          @click="gotoCreatePromotion">
          新建推广计划
        </el-button>
        <el-button type="primary" v-if="!canCreate">
          <router-link :to="{name: 'qwt-dashboard', query: {userId}}" tag="span">
            查看数据报表
          </router-link>
        </el-button>
      </span>
    </section>
    <section v-if="showMoreFilters">
      <div>
        <span class="filter-item">
          <label>投放状态</label>
          <bax-select :options="campaignStatusOpts" clearable
            @change="v => queryCampaigns({statuses: v})">
          </bax-select>
        </span>
        <span class="filter-item">
          <label>投放区域</label>
          <bax-select :options="areaOpts" clearable
            :filter-method="v => this.areaQueryWord = v"
            @change="v => queryCampaigns({areas: v})">
          </bax-select>
        </span>
        <span class="filter-item">
          <label>渠道来源</label>
          <bax-select :options="semPlatformOpts" clearable
            @change="v => queryCampaigns({source: v})">
          </bax-select>
        </span>
      </div>
    </section>
  </header>
</template>

<script>
import BaxSelect from 'com/common/select'
import BaxInput from 'com/common/input'

import {
  semPlatformOpts
} from 'constant/fengming'

import track from 'util/track'

import store from './store'

const campaignStatusOpts = [{
  label: '推广中/审核中',
  value: '100'
}, {
  label: '计划预算不足',
  value: '5'
}, {
  label: '账户余额不足',
  value: '-51'
}, {
  label: '已暂停',
  value: '-10,-50'
}, {
  label: '已下线',
  value: '-1'
}]

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
    },
    allAreas: {
      type: Array,
      required: true
    },
    query: {
      type: Object,
      required: true
    },
    userId: {
      type: [Number, String]
    },
    canCreate: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      campaignStatusOpts,
      semPlatformOpts,
      areaQueryWord: ''
    }
  },
  computed: {
    areaOpts() {
      const q = this.areaQueryWord

      if (!q) {
        return this.allAreas
      }

      return this.allAreas
        .filter(a => {
          return a.name.includes(q) ||
            a.nameCn.includes(q)
        })
    }
  },
  methods: {
    async queryCampaigns(opts) {
      await store.getCurrentCampaigns({
        ...this.query,
        ...opts
      })
    },
    switchShowMoreFilters() {
      store.switchShowMoreFilters()

      track({
        action: 'campaign list: click more filters'
      })
    },
    gotoCreatePromotion() {
      this.$router.push({
        name: 'qwt-create-promotion'
      })

      track({
        action: 'campaign list: click create campaign'
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
        flex-grow: 0.33;
      }

      & > span:last-child {
        /* margin-left: 40px; */
      }
    }
  }
}
</style>
