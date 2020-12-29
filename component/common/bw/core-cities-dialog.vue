<template>
  <el-dialog :visible="visible" title="提示" @close="handleClose" class="core-cities-dialog" width="580px">
    <div>请选择用户所在地：</div>
    <div class="city-container clearfix">
      <span :class="{city: true, active: coreCities.includes(item)}"
            v-for="item in areas"
            :key="item"
            @click="handleCoreCities(item)">
        {{ getCnName(item, allAreas) }}
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
      default: 3
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
      this.$message.error(`用户所在地最多不能超过${this.limit}个`)
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
    cursor: pointer;
    &.active {
      background: $--color-primary;
      color: #fff;
      border-color: transparent;
    }
  }
}
</style>

<style lang="scss">
.core-cities-dialog .el-dialog__body {
  padding: 20px;
}
</style>
