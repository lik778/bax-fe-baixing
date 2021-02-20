
<template>
  <span>
    <p v-if="loading" class="loading-info">
      <i class="el-icon-loading" /> 正在载入...
    </p>
    <template v-else>
      <bax-select v-if="options.length"
        class="selector"
        :disabled="disabled"
        :value="value"
        :options="options"
        @change="onChange">
      </bax-select>
      <p v-else>暂无数据</p>
    </template>
  </span>
</template>

<script>
import BaxSelect from './select'
import { getUserSites } from 'api/ka'
import { minTime } from 'util/kit'

export default {
  name: 'sites-selector',
  components: {
    BaxSelect
  },
  props: {
    initValue: {
      type: [String, Number],
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      isCurStoreInValid: false,
      value: null,
      loading: false,
      list: [],
      options: []
    }
  },
  async mounted () {
    await this.inits()
    if (this.initValue) {
      this.checkIsValid()
    }
  },
  methods: {
    async inits () {
      let sites
      try {
        this.loading = true
        sites = await minTime(getUserSites)
      } catch (error) {
        sites = []
      } finally {
        this.loading = false
      }
      this.list = sites
      this.options = this.list.map(x => ({
        label: x.name,
        value: +x.id
      }))
    },
    findSiteByID (id) {
      return this.list.find(x => +x.id === +id)
    },
    checkIsValid (id = this.initValue) {
      const find = this.findSiteByID(id)
      if (find) {
        if (+this.value !== +id) {
          this.value = +id
        }
      } else {
        this.isCurStoreInValid = true
      }
      return find
    },
    onChange (v) {
      const find = this.checkIsValid(v)
      if (find) {
        this.$emit('change', this.validURL(find), find.id)
      }
    },
    validURL (site) {
      return site
        ? 'http://' + site.domain + '.mvp.baixing.com'
        : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.selector {
  width: 560px;
}
p {
  margin-left: 10px;
  font-size: 14px;
  color: ff6350;
  height: 40px;
  line-height: 40px;
}
.loading-info {
  color: #C0C4CC;
}
</style>
