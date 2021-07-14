<template>
  <el-dialog :visible="visible" title="提示" @close="handleClose" class="core-cities-dialog" width="580px">
    <div>请选择用户所在地：</div>
    <!-- <slot>
      <el-input v-model="search" @click="handleSearch"> </el-input>
    </slot> -->
    <div class="city-container clearfix">
      <span
        v-for="item in displayAreas"
        class="city"
        :class="{
          active: isSelected(item),
          disabled: isDisabled(item),
        }"
        :key="item"
        @click="handleCoreCities(item)">
          {{ getCityName(item, allAreas) }}
      </span>
    </div>
    <div slot="footer" class="footer">
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button plain @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCnName } from 'util'

export const OTHER_CITY_ENUM = '_other'

export default {
  name: 'core-cities-dialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    allAreas: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    areas: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    originCoreCities: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      coreCities: []
    }
  },
  computed: {
    displayAreas () {
      return this.areas.concat([OTHER_CITY_ENUM])
    }
  },
  methods: {
    getCnName,
    handleClose () {
      this.$emit('cancel')
    },
    handleConfirm () {
      this.$emit('confirm', this.coreCities)
    },
    handleCoreCities (item) {
      const index = this.coreCities.indexOf(item)
      if (index > -1) {
        this.coreCities.splice(index, 1)
        return
      }
      if (this.coreCities.length + 1 <= this.limit) {
        this.coreCities.push(item)
        return
      }
      return this.$message.error(`用户所在地最多不能超过${this.limit}个`)
    },

    /* Atomics */

    getCityName (item, areas) {
      return item === OTHER_CITY_ENUM
        ? '其它'
        : getCnName(item, areas)
    },
    isSelected (item) {
      return this.coreCities.includes(item)
    },
    isDisabled (item) {
      return !this.isSelected(item) && (this.coreCities.length >= this.limit)
    }
  },
  watch: {
    originCoreCities: {
      deep: true,
      immediate: true,
      handler (val) {
        this.coreCities = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.core-cities-dialog {
  .city-container {
    padding-top: 10px;
  }
  .city {
    float: left;
    width: 80px;
    border: 1px solid #ddd;
    margin: 10px 10px 0 0;
    text-align: center;
    padding: 3px 0;
    border-radius: 4px;
    transition: .25s;
    cursor: pointer;

    &.active {
      background: $--color-primary;
      color: #fff;
      border-color: transparent;
    }
    &.disabled {
      background: #ddd;
      color: #aaa;
      pointer-events: none;
    }
  }
}
</style>

<style lang="scss">
.core-cities-dialog .el-dialog__body {
  padding: 20px;
}
</style>
