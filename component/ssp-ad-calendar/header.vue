
<template>
  <header class="ad-calendar-header">
    <div>
      <span class="filter-item">
        <label>广告位</label>
        <bax-select :options="adOpts" clearable
          v-model="adId">
        </bax-select>
      </span>
      <span class="filter-item">
        <label>类型</label>
        <bax-select :options="sspOrderTypeOpts" clearable
          v-model="sspOrderType">
        </bax-select>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>开始时间</label>
        <el-date-picker type="date" placeholder="选择日期"
          v-model="startAt">
        </el-date-picker>
      </span>
      <span class="filter-item">
        <label>结束时间</label>
        <el-date-picker type="date" placeholder="选择日期"
          v-model="endAt">
        </el-date-picker>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>区域</label>
        <span>
          <el-tag type="success" closable
            v-for="c in areas" :key="c"
            @close="removeArea(c)">
            {{ formatterArea(c) }}
          </el-tag>
          <i class="el-icon-plus"
            @click="areaDialogVisible = true">
          </i>
        </span>
      </span>
    </div>
    <div>
      <span class="filter-item">
        <label>类目</label>
        <span>
          <el-tag type="success" closable
            v-for="c in categories" :key="c"
            @close="removeCategory(c)">
            {{ formatterCategory(c) }}
          </el-tag>
          <i class="el-icon-plus"
            @click="categoryDialogVisible = true">
          </i>
        </span>
      </span>
    </div>
    <category-selector :all-categories="allCategories"
      :categories="categories"
      :visible="categoryDialogVisible"
      @ok="onChangeCategories"
      @cancel="categoryDialogVisible = false">
    </category-selector>
    <area-selector :all-areas="allAreas"
      :areas="areas"
      :visible="areaDialogVisible"
      @ok="onChangeAreas"
      @cancel="areaDialogVisible = false">
    </area-selector>
  </header>
</template>

<script>
import CategorySelector from 'com/common/category-selector'
import AreaSelector from 'com/common/area-selector'
import BaxSelect from 'com/common/select'

import { toTimestamp } from 'utils'
import {
  fmtCategoriesAndAreasInOpts,
  getCnName
} from 'util/meta'
import {
  normalizeRoles,
  checkRoles
} from 'util/role'

import {
  sspOrderTypeOpts
} from 'constant/order'

import {
  setCalendarOptions,
  getCalendar
} from './action'

export default {
  name: 'ad-calendar-header',
  components: {
    CategorySelector,
    AreaSelector,
    BaxSelect
  },
  props: {
    allCategories: {
      type: Array,
      required: true
    },
    allAreas: {
      type: Array,
      required: true
    },
    allAds: {
      type: Array,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      categoryDialogVisible: false,
      areaDialogVisible: false,

      sspOrderType: '',
      categories: [],
      areas: [],
      startAt: '',
      endAt: '',
      adId: ''
    }
  },
  computed: {
    sspOrderTypeOpts() {
      const roles = normalizeRoles(this.userInfo.roles)

      const isSales = checkRoles(roles, [
        'BAIXING_SALES',
        'AGENT_SALES'
      ])

      if (isSales) {
        return sspOrderTypeOpts
          .filter((o) => !['1', '2'].includes(o.value))
      }

      return [
        ...sspOrderTypeOpts
      ]
    },
    adOpts() {
      return this.allAds.map(ad => ({
        label: ad.name || ad.slotCode,
        value: ad.id
      }))
    }
  },
  methods: {
    formatterCategory(name) {
      const { allCategories } = this
      return getCnName(name, allCategories)
    },
    formatterArea(name) {
      const { allAreas } = this
      return getCnName(name, allAreas)
    },
    removeCategory(c) {
      this.categories = [
        ...this.categories.filter(i => i !== c)
      ]
    },
    removeArea(a) {
      this.areas = [
        ...this.areas.filter(c => c !== a)
      ]
    },
    onChangeCategories(v) {
      this.categoryDialogVisible = false
      this.categories = v
    },
    onChangeAreas(v) {
      this.areaDialogVisible = false
      this.areas = v
    },
    async queryCalendar(v, p) {
      const {
        sspOrderType,
        categories,
        areas,
        startAt,
        endAt,
        adId
      } = this

      if (!adId || !startAt || !endAt || !sspOrderType) {
        return
      }

      if (!areas.length || !categories.length) {
        return
      }

      await setCalendarOptions({
        start: toTimestamp(startAt),
        end: toTimestamp(endAt),
        categories,
        areas
      })

      await getCalendar(fmtCategoriesAndAreasInOpts({
        startAt: toTimestamp(startAt),
        endAt: toTimestamp(endAt),
        sspOrderType,
        categories,
        areas,
        adId
      }))
    }
  },
  watch: {
    sspOrderType: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    categories: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    areas: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    startAt: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    endAt: async function(v, p) {
      await this.queryCalendar(v, p)
    },
    adId: async function(v, p) {
      await this.queryCalendar(v, p)
    }
  }
}
</script>

<style scoped>

@import '../../cssbase/mixin';
@import 'cssbase/mixin';

@mixin filter-item;

.el-icon-plus {
  @mixin icon-btn;
}

.el-tag {
  margin-right: 3px;
}

.ad-calendar-header {
  @mixin top-filter;
  padding: 0 0 15px;
  width: 100%;

  & > div {
    display: flex;
    align-items: center;
  }

  & > div:nth-child(1), & > div:nth-child(2) {
    & > span {
      display: flex;
      flex-grow: 0.5;
      height: unset;
      width: unset;

      & > div:last-child {
      }
    }
  }

  & > div:nth-child(3), & > div:nth-child(4) {
    & > span {
      height: unset;
      width: unset;
    }
  }
}

</style>
