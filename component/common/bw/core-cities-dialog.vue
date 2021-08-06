<template>
  <el-dialog :visible="visible" @close="handleClose" :show-close="false" class="core-cities-dialog" width="580px">
    <el-form label-width="140px">
      <el-form-item label="请选择用户所在地：">
        <el-select @change="searchFilter($event)" v-model="search" filterable placeholder="请选择">
          <el-option
            v-for="item in areasOption"
            :key="item"
            :label="getCityName(item, allAreas)"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="city-container clearfix">
      <span
        v-for="item in areasOption"
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
    <header slot="title" class="dialog-header">
      <h5 class="title">用户所在地</h5>
      <div class="buttons">
        <el-button type="primary" @click="handleConfirm">确定</el-button>
        <el-button plain @click="handleClose">取消</el-button>
      </div>
    </header>
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
      coreCities: [],
      search: '',
      OTHER_CITY_ENUM,
      areasOption: []
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
    },
    searchFilter (area) {
      this.handleCoreCities(area)
    }
  },
  watch: {
    originCoreCities: {
      deep: true,
      immediate: true,
      handler (val) {
        this.coreCities = val
      }
    },
    areas: {
      deep: true,
      immediate: true,
      handler (val) {
        this.areasOption = val
      }
    }
    // search: function (newQuestion, oldQuestion) {
    //   const result = this.areas.filter(city => getCnName(city, this.allAreas).indexOf(newQuestion) !== -1)
    //   this.areasOption = [...result]
    // }
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
.dialog-header {
  width: 100%;
  display: flex;
  text-align: center;
  line-height: 40px;
  & .title {
    text-indent: 10px;
    font-size: 18px;
    color: #565656;
  }
  & .buttons {
    margin-left: auto;
    margin-right: 26px;
  }
}
</style>

<style lang="scss">
.core-cities-dialog .el-dialog__body {
  padding: 20px;
}
</style>
