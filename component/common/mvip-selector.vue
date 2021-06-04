
<template>
  <span>
    <p v-if="loading" class="loading-info">
      <i class="el-icon-loading" /> 正在载入...
    </p>
    <template v-else>
      <p v-if="isValueInvalid" class="warning">所选店铺已失效，请重新选择！</p>
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
import { queryMvipShops } from 'api/mvip'
import { minTime } from 'util/kit'

export default {
  name: 'mvip-selector',
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
  computed: {
    isValueInvalid () {
      const isInvalid = !this.loading && (this.initValue && !this.value)
      this.$emit('valid-change', !isInvalid)
      return isInvalid
    }
  },
  async mounted () {
    await this.getMvipShops()
    if (this.initValue) {
      this.checkIsCurStoreValid()
    }
  },
  methods: {
    async getMvipShops () {
      let response
      try {
        this.loading = true
        response = await minTime(queryMvipShops)
      } catch (error) {
        response = {}
      } finally {
        this.loading = false
      }
      const { data = [] } = response
      this.list = data
      this.options = this.list.map(x => ({
        label: x.name,
        value: +x.id
      }))
    },
    findStoreByID (id) {
      return this.list.find(x => +x.id === +id)
    },
    checkIsCurStoreValid (id = this.initValue) {
      const find = this.findStoreByID(id)
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
      const find = this.checkIsCurStoreValid(v)
      if (find) {
        this.$emit('change', find.url, find.id)
      } else {
        this.$emit('change', '', '')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selector {
  width: 530px;
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
.warning {
  color: #ff6350;
}
</style>
