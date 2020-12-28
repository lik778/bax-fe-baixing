<template>
  <el-dialog
    class="column-dialog"
    :visible="visible"
    :width="this.styles.width"
    :before-close="handleCancel"
    :show-close="false">
    <el-scrollbar :style="{ width: '100%', height: this.styles.height }">
      <!-- computedContents 是二维数组，以下按“行”和“列”进行拆分 -->
      <template v-for="(row, ridx) in computedContents">
        <div class="row" :key="`row-${+ridx+1}}`">
          <template v-for="(column, cidx) in contents[ridx]">
            <div :key="`column-${+cidx+1}}`">
              <slot
                :name="`column-${+cidx+1}`"
                :value="contents[ridx][cidx]"
                :isChecked="isChecked"
                :add="val => add(ridx, cidx, val)"
                :del="val => del(ridx, cidx, val)"
              />
            </div>
          </template>
        </div>
      </template>
    </el-scrollbar>
    <header slot="title" class="dialog-header">
      <h5 class="title">{{title}}</h5>
      <div class="buttons">
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确认</el-button>
      </div>
    </header>
  </el-dialog>
</template>

<script>
export default {
  // TODO: refactor 部分属性可以抽到 Dialog.vue
  props: {
    // TODO 返回嵌套结构数据还是扁平化数据
    // flattened: {
    //   type: Boolean,
    //   default: true
    // }
    visible: Boolean,
    value: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '选择'
    },
    contents: {
      type: Array,
      default () { return [] }
    },
    confirm: Function,
    cancel: Function,
    width: {
      type: [String, Number],
      default: '55%'
    },
    height: {
      type: [String, Number],
      default: 'auto'
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 清洗返回值函数
    wash: {
      type: Function,
      default: val => val
    }
  },
  data () {
    return {
      localValue: []
    }
  },
  computed: {
    toEmitValue () {
      return [...this.localValue || []]
    },
    computedContents () {
      // TODO: 把 contents 中对象类型的子项转为数组
      return this.contents
    },
    computedWidth () {
      const w = String(this.width)
      const hasMeter = /[^\d]+/.test(w)
      return hasMeter ? w : w + 'px'
    },
    computedHeight () {
      const isAuto = this.height === 'auto'
      if (isAuto) return this.height

      const h = String(this.height)
      const hasMeter = /[^\d]+/.test(h)
      return hasMeter ? h : h + 'px'
    },
    styles () {
      return {
        width: this.computedWidth,
        height: this.computedHeight
      }
    }
  },
  watch: {
    value (n, o) {
      if (n) {
        console.log(n)
        this.localValue = n
      }
    }
  },
  methods: {

    /* 交互行为 */

    handleConfirm () {
      this.confirm
        ? this.$confirm(this.toEmitValue)
        : this.$emit('confirm', this.toEmitValue)
      this.closeModal()
    },
    handleCancel () {
      this.closeModal()
    },
    closeModal () {
      this.$emit('update:visible', false)
    },

    /* 数据维护 */

    add (ridx, cidx, val) {
      const vals = val instanceof Array ? val : [val]
      this.multiple
        ? this.localValue.push(...vals)
        : this.$set(this, 'localValue', [vals[0]])
      this.localValue = this.wash(this.localValue)
    },
    del (ridx, cidx, val) {
      const vals = val instanceof Array ? val : [val]
      vals.map(toDelItem => this.localValue.splice(this.localValue.findIndex(x => x === toDelItem), 1))
      this.localValue = this.wash(this.localValue)
    },

    /* 计算函数 */

    isChecked (val) {
      return this.localValue.includes(val)
    }
  }
}
</script>

<style lang="scss">
.column-dialog {
  font-size: 14px;

  .dialog-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .row {
    display: flex;
    align-items: center;
  }

  /deep/ .el-dialog__body {
    padding: 10px 15px 10px 25px;
  }
  /deep/ .el-scrollbar__wrap {
    overflow: hidden scroll;
  }
}
</style>
