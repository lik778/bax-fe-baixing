<script>
import ColumnSelectorDialog from './column-selector-dialog'

export default {
  components: {
    ColumnSelectorDialog
  },
  props: {
    // TODO 只选中叶子类目
    // isStrict: {
    //   type: Boolean,
    //   default: false
    // },
  },
  render (h) {
    const placeholder = this.$attrs.placeholder || ['', '']
    const hasSecondItem = val => !!(val && val.length)

    return h(ColumnSelectorDialog, {
      class: ['column-select-dialog'],
      on: this.$listeners,
      attrs: {
        ...this.$attrs
      },
      props: {
        ...this.$props
      },
      scopedSlots: {
        'column-1': function ({ value }) {
          return h('div', {
            attrs: {
              class: 'checkbox-item'
            }
          }, [value[0] || placeholder[0]])
        },
        'column-2': function ({ value, isChecked, add, del }) {
          return h('p', { domProps: { className: 'btn-con' } },
            hasSecondItem(value)
              ? value.map(
                  item => h('span', {
                    attrs: {
                      class: isChecked(item)
                        ? 'btn-item active'
                        : 'btn-item'
                    },
                    on: {
                      click: () => isChecked(item) ? del(item) : add(item)
                    }
                  }, item)
                )
              : [h('span', {
                  attrs: {
                    class: 'btn-item disabled'
                  }
                }, placeholder[1])]
          )
        },
        ...this.$scopedSlots
      }
    })
  }
}
</script>

<style lang="scss">
.column-select-dialog {

  .checkbox-item {
    flex: 1;
    min-width: 80px;
  }
  .btn-con {
    margin: 10px 0;
    padding: 0 10px;
    border-left: 1px gray dashed;
    min-height: 40px;
  }
  .btn-item {
    display: inline-block;
    margin: 8px 10px 0 0;
    padding: 5px 10px;
    min-width: 45px;
    border-radius: 3px;
    text-align: center;
    cursor: pointer;
    transition: .15s ease-in;

    &:hover {
      background: #fff6f5;
    }
    &.active {
      background: #ff6350;
      color: white;
    }

    &.disabled {
      background: none;
      color: #aaa;
      cursor: not-allowed;
      user-select: none;
    }
  }
}
</style>
