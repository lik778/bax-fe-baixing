<template>
<div>
  <el-form
    label-position="left"
    :model="form"
    label-width="100px"
  >
    <div v-show="isActionGroupExpand">
      <el-form-item label="计划id">
        <el-select
            v-model="form.campaign_id"
            placeholder="请选择"
            @change="(value) => handleChange(value, 'campaign_id')"
        >
            <el-option
                v-for="item in promotions"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="投放状态">
        <el-checkbox-group v-model="form.statuses" @change="(value) => handleChange(value, 'statuses')">
          <el-checkbox
            class="checkbox"
            v-for="c in statusOpts"
            :key="c.value"
            :label="c.value"
          >
          {{ c.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="渠道涞源">
        <el-checkbox-group v-model="form.source" @change="(value) => handleChange(value, 'source')">
          <el-checkbox
            class="checkbox"
            v-for="c in SOURCES_OPTS"
            :key="c.value"
            :label="c.value"
          >
            {{ c.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="投放区域" v-if="tab === 'plan'">
        <el-tag
          v-for="a in form.areas"
          @close="removeSelectedArea(a)"
          :key="a"
          type="danger"
          :closable="true"
          class="tag"
        >
          {{ a | transformCityName(allAreas) }}
        </el-tag>
        <i class="el-icon-plus icon" @click="areaDialogVisible = true" />
      </el-form-item>
    </div>
    <el-form-item label="投放优化">
      <el-checkbox-group v-model="form.statuses" @change="(value) => handleChange(value, 'statuses')">
        <el-checkbox
          class="checkbox"
          v-for="c in CAMPAIGN_OPTIMIZATION_OPTS"
          :key="c.value"
          :label="c.value"
        >
          {{ c.label }}
        </el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="单元名称" v-if="tab === 'group'">
      <el-input v-model="form.group_name" @input="debounceInput"></el-input>
    </el-form-item>
  </el-form>
  <areaSelector
      type="qwt"
      :areas="form.areas"
      :all-areas="allAreas"
      :visible="areaDialogVisible"
      :enable-china="false"
      @ok="handleSelectArea"
      @cancel="areaDialogVisible = false"
    />
</div>
</template>

<script>
import { options, CAMPAIGN_OPTIMIZATION_OPTS } from '../constant'
import { semPlatformOpts as SOURCES_OPTS } from 'constant/fengming'
import areaSelector from 'com/common/area-selector'
import { getCnName } from 'util'
import debounce from 'lodash.debounce'

export default {
  name: 'bax-form',
  components: { areaSelector },
  props: {
    selectOptions: {
      type: Array,
      require: true,
      default: () => []
    },
    isActionGroupExpand: {
      type: Boolean,
      require: true,
      default: false
    },
    tab: {
      type: String,
      require: true,
      default: ''
    },
    allAreas: {
      type: Array,
      require: true,
      default: () => []
    },
    fetchData: {
      type: Function,
      require: true,
      default: () => {}
    },
    formData: {
      type: Object,
      require: true,
      default: () => {}
    },
    promotions: {
      type: Array,
      require: true,
      default: () => []
    },
    campaignId: {
      type: Number,
      require: true,
      default: null
    },
    statusOpts: {
      type: Array,
      require: true,
      default: () => []
    },
    statusOrigin: {
      type: Object,
      require: true,
      default: () => {}
    }
  },
  data () {
    return {
      CAMPAIGN_OPTIMIZATION_OPTS,
      options,
      SOURCES_OPTS,
      areaDialogVisible: false,
      form: this.formData,
      debounce
    }
  },
  methods: {
    debounceInput: debounce(function (value) {
      this.$emit('fetchData', { value, key: 'group_name' })
    }, 500),
    handleChange (value, key) {
      this.$emit('fetchData', { value, key })
    },
    removeSelectedArea (area) {
      this.form.areas = this.form.areas.filter((a) => a !== area)
      const params = { value: this.form.areas, key: 'areas' }
      this.$emit('fetchData', params)
    },
    handleSelectArea (areas) {
      this.form.areas = areas
      this.areaDialogVisible = false
      const params = { value: areas, key: 'areas' }
      this.$emit('fetchData', params)
    }
  },
  filters: {
    transformCityName (name, allAreas) {
      return getCnName(name, allAreas)
    }
  }
}
</script>

<style scoped>
  .el-input{
      width: 40%;
  }
</style>
