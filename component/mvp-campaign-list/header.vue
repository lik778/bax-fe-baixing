<template>
  <header class="mvp-campaign-header">
    <div>
      <span>
        <bax-input size="small"
          placeholder="请输入ID查询"
          icon="el-icon-search"
          @change="v => queryCampaigns({id: v})">
        </bax-input>
        <el-button @click="showMore = !showMore">
          更多筛选<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </span>
      <span>
        <el-button
          type="primary" icon="el-icon-plus"
          @click="gotoCreateCampaign">
          新建推广计划
        </el-button>
      </span>
    </div>
    <div v-if="showMore">
      <section>
        <span class="filter-item">
          <label>投放状态</label>
          <bax-select clearable
            :options="campaignStatusOpts"
            @change="v => queryCampaigns({statuses: v})" />
        </span>
        <span class="filter-item">
          <label>投放区域</label>
          <bax-select clearable
            :options="areaOpts"
            :filter-method="v => this.areaQueryWord = v"
            @change="v => queryCampaigns({areas: v})" />
        </span>
        <span class="filter-item">
          <label>渠道来源</label>
          <bax-select clearable
            :options="semPlatformOpts"
            @change="v => queryCampaigns({source: v})" />
        </span>
      </section>
    </div>
  </header>
</template>

<script>
import BaxSelect from 'com/common/select'
import BaxInput from 'com/common/input'

import {
  campaignStatusOpts,
  semPlatformOpts
} from 'constant/fengming'

export default {
  name: 'mvp-campaign-header',
  components: {
    BaxSelect,
    BaxInput
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      campaignStatusOpts,
      semPlatformOpts,
      showMore: false,

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
    async queryCampaigns() {

    },
    gotoCreateCampaign() {
      this.$router.push({
        name: 'mvp-create-campaign'
      })
    }
  }
}
</script>

<style scoped>
@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.mvp-campaign-header {
  background: white;
  margin: 10px 10px 0;
  padding: 20px;

  & > div:first-child {
    display: flex;
    justify-content: space-between;

    & > span:first-child {
      display: flex;
      align-items: center;

      & > .el-input {
        margin-right: 10px;
      }
    }
  }

  & > div:nth-child(2) {
    @mixin top-filter;
    padding: 0 20px 15px;

    margin-top: 10px;

    & > section {
      display: flex;

      & > span {
        flex-grow: 0.33;
      }
    }
  }
}
</style>
