<template>
<div>
  <el-form
    label-position="left"
    ref="form"
    :model="form"
    label-width="100px"
  >
    <div v-show="isActionGroupExpand">
      <el-form-item label="计划id">
        <baxSelect
          :selectOptions="options"
          key="value"
          label="label"
          value="value"
        />
      </el-form-item>
      <el-form-item label="投放状态">
        <el-checkbox-group :value="form.statuses" @change="handleChange">
          <el-checkbox
            class="checkbox"
            v-for="c in CAMPAIGN_STATUS_OPTS"
            :key="c.value"
            :label="c.value"
          >
            {{ c.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="渠道涞源">
        <el-checkbox-group v-model="form.source">
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
      <el-checkbox-group v-model="form.statuses">
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
      <el-input v-model="form.groupName"></el-input>
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
import { CAMPAIGN_STATUS_OPTS, options, CAMPAIGN_OPTIMIZATION_OPTS } from '../constant'
import { semPlatformOpts as SOURCES_OPTS } from 'constant/fengming'
import baxSelect from './bax-select'
import areaSelector from 'com/common/area-selector'
import { getCnName } from 'util'
import clone from 'clone'

export default {
  name: 'bax-form',
  components: { baxSelect, areaSelector },
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
    }
  },
  data () {
    return {
      CAMPAIGN_OPTIMIZATION_OPTS,
      options,
      SOURCES_OPTS,
      CAMPAIGN_STATUS_OPTS,
      areaDialogVisible: false,
      form: this.formData
    }
  },
  methods: {
    handleChange (e) {
      console.log(e)
    },
    removeSelectedArea (area) {
      this.form.areas = this.form.areas.filter((a) => a !== area)
    },
    handleSelectArea (areas) {
      this.form.areas = areas
      this.areaDialogVisible = false
    }
  },
  filters: {
    transformCityName (name, allAreas) {
      return getCnName(name, allAreas)
    }
  },
  watch: {
    form: {
      deep: true,
      handler (val) {
        if (!val.campaignId || /^[0-9]+$/.test(val.campaignId)) {
          const params = clone(val)
          params.statuses = params.statuses.join(',').split(',').map(n => parseInt(n))
          //   this.fetchData(params)
          this.$emit('update-params', params)
        } else {
          this.$message.error('您要查询的计划id格式不正确')
        }
      }
    }
  }
}
</script>
