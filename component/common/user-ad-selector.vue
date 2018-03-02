<template>
  <div class="user-ad-selector">
    <bax-input size="small" icon="el-icon-search"
      style="width: 240px; margin-bottom: 14px;"
      placeholder="请输入帖子标题进行搜索"
      v-model="keyword"
      @change="onKeywordChange" />
    <el-table :data="ads" border fit
      style="width: 530px">
      <el-table-column label="选择" width="50">
        <template slot-scope="s">
          <div class="center">
            <el-checkbox :value="adSelected(s.row.adId)"
              @change="onCheckAd(s.row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="帖子标题" width="310">
        <template slot-scope="s">
          <p class="line">
            {{ s.row.title }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="城市" width="70"
        :formatter="r => fmtCity(r.city)">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="s">
          <div class="op">
            <a target="_blank"
              :href="s.row.url && s.row.url[0]">
              查看
            </a>
            <a v-if="mode === MODE_SELECTED"
              @click="reset">重选</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <span>
        <bax-pagination v-if="mode !== MODE_SELECTED"
          :options="{ offset, limit, total }"
          @current-change="onCurrentChange">
        </bax-pagination>
      </span>
      <span>
        <el-button size="mini">取 消</el-button>
        <el-button type="primary" size="mini">确 定</el-button>
      </span>
    </footer>
  </div>
</template>

<script>
import BaxPagination from 'com/common/pagination'
import BaxInput from 'com/common/input'

import { queryAds } from 'api/fengming-mvp'
import { getCnName } from 'util/meta'

const TYPE_RESELECT = 'reselect'

const MODE_SELECTED = 'selected'
const MODE_INIT = 'init'

const isArray = Array.isArray

export default {
  name: 'mvp-user-ad-selector',
  components: {
    BaxPagination,
    BaxInput
  },
  props: {
    allAreas: {
      type: Array,
      required: true
    },
    selectedId: {
      type: String
    },
    type: {
      type: String,
      validator(v) {
        return [TYPE_RESELECT].includes(v)
      }
    }
  },
  data() {
    return {
      MODE_SELECTED,

      keyword: '',
      offset: 0,
      limit: 3,
      total: 0,
      ads: [],

      mode: MODE_INIT
    }
  },
  computed: {
    isModeSelected() {
      return this.mode === MODE_SELECTED
    }
  },
  methods: {
    async onKeywordChange(k) {
      console.info(99, k)
    },
    async onCurrentChange(opts) {
      const { offset } = opts
      this.offset = offset

      const { keyword, limit } = this

      const data = await queryAds({
        keyword,
        offset,
        limit
      })

      this.ads = data.ads
      this.total = data.total
    },
    adSelected(adId) {
      return adId === this.selectedId
    },
    onCheckAd(ad) {
      this.$emit('select-ad', {
        ...ad,
        url: isArray(ad.url) ? ad.url[0] : ad.url
      })
    },
    fmtCity(c) {
      const { allAreas } = this
      return getCnName(c, allAreas)
    },
    async reset() {
      this.offset = 0
      this.mode = MODE_INIT
      this.keyword = ''

      const { offset, limit } = this
      const data = await queryAds({
        offset,
        limit
      })

      this.ads = data.ads
      this.total = data.total
    }
  },
  watch: {
    async selectedId(now, pre) {
      if (this.type === TYPE_RESELECT && now && now !== pre) { // ??
        const data = await queryAds({
          adIds: [now]
        })

        this.ads = data.ads
      }
    }
  },
  async mounted() {
    const { type } = this

    if (type === TYPE_RESELECT) {
      this.mode = MODE_SELECTED
      return
    }

    await this.reset()
  }
}
</script>

<style>
@import '../../cssbase/var';
@import 'cssbase/mixin';

.center {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.line {
  @mixin wordline;
}

.op {
  & > a {
    cursor: pointer;
    color: var(--qwt-c-blue);
  }

  & > a:visited {
    color: var(--qwt-c-blue);
  }
}

.user-ad-selector {
  width: 540px;

  & .el-table__header-wrapper {
    background-color: #f7f7f7;
  }

  & > footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 25px 0 0;

    & > .bax-pagination {
      padding: unset;
    }
  }
}
</style>
