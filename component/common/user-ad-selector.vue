<template>
  <div class="user-ad-selector">
    <bax-input v-if="mode !== MODE_SELECTED"
      size="small" icon="el-icon-search"
      style="width: 240px; margin-bottom: 14px;"
      placeholder="请输入帖子标题进行搜索"
      v-model="keyword"
      @change="onKeywordChange" />
    <el-table :data="ads" border fit
      style="width: 530px">
      <template slot="empty">
        <a class="fabu" target="_blank"
          href="http://shanghai.baixing.com/fabu/">
          您当前账户无有效帖子，先去发一条吧！
        </a>
      </template>
      <el-table-column label="选择" width="50">
        <template slot-scope="s">
          <div class="center">
            <el-radio v-model="checkedAdId" :label="s.row.adId">&nbsp</el-radio>
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
              :href="s.row.url">
              查看
            </a>
            <a v-if="mode === MODE_SELECTED && !disabled"
              @click="reset">重选</a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <footer v-if="mode !== MODE_SELECTED">
      <span>
        <bax-pagination
          :options="{ offset, limit, total }"
          @current-change="onCurrentChange">
        </bax-pagination>
      </span>
      <span>
        <el-button size="mini"
          @click="onCancel()">
          取 消
        </el-button>
        <el-button type="primary" size="mini"
          @click="onSelectAd()">
          确 定
        </el-button>
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
    disabled: {
      type: Boolean,
      default: false
    },
    limitMvp: {
      type: Boolean,
      default: true
    },
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
        return [TYPE_RESELECT, ''].includes(v)
      }
    }
  },
  data() {
    return {
      MODE_SELECTED,

      requestStartTime: 0,
      keyword: '',
      offset: 0,
      limit: 3,
      total: 0,
      ads: [],

      checkedAdId: null,
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
      this.keyword = k
      this.offset = 0

      await this.queryAds()
    },
    async onCurrentChange(opts) {
      const { offset } = opts
      this.offset = offset

      await this.queryAds()
    },
    async queryAds(opts = {}) {
      const { limitMvp, keyword, offset, limit } = this

      const t = Date.now()

      const data = await queryAds({
        limitMvp,
        keyword,
        offset,
        limit,
        ...opts
      })

      if (t > this.requestStartTime) {
        this.ads = data.ads
        this.total = data.total
        this.requestStartTime = t
      }
    },
    async onSelectAd() {
      if (!this.checkedAdId) {
        return
      }

      const ad = this.ads.find(ad => ad.adId === this.checkedAdId)
      this.$emit('select-ad', {
        ...ad,
        url: isArray(ad.url) ? ad.url[0] : ad.url
      })

      await this.reset(MODE_SELECTED, this.checkedAdId)
    },
    async onCancel() {
      if (this.selectedId) {
        await this.reset(MODE_SELECTED, this.selectedId)
      }
    },
    fmtCity(c) {
      const { allAreas } = this
      return getCnName(c, allAreas)
    },
    async reset(mode, adId) {
      if (mode === MODE_SELECTED) {
        this.mode = MODE_SELECTED
        this.keyword = ''
        this.offset = 0

        await this.queryAds({
          adIds: [adId]
        })
        this.checkedAdId = this.ads[0].adId
        return
      }

      this.offset = 0
      this.mode = MODE_INIT
      this.keyword = ''

      await this.queryAds()
    }
  },
  watch: {
    async selectedId(now, pre) {
      if (this.type === TYPE_RESELECT && now) {
        await this.reset(MODE_SELECTED, now)
      }
    }
  },
  async mounted() {
    const { selectedId, type } = this
    if (type === TYPE_RESELECT) {
      await this.reset(MODE_SELECTED, selectedId)
    } else {
      await this.reset()
    }
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

.fabu {
  cursor: pointer;
  color: var(--qwt-c-blue);
  font-size: 14px;
}

.fabu:visited {
  color: var(--qwt-c-blue);
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
