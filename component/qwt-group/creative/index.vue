<template>
  <div class="creative-container">
    <fm-tip class="creative-tip"
            position="creative"
            img-url="//file.baixing.net/201903/d6f4502a0e8a659b78a33fbb3713e6b9.png">创意怎么才能飘红
    </fm-tip>
    <el-tabs type="card"
             class="creative-tab"
             v-model="activeName"
             @tab-add="handleTabsAdd"
             @tab-remove="handleTabsRemove">
      <el-tab-pane v-for="(item, index) in creatives"
                   :label="'创意' + (index + 1)"
                   :key="index"
                   :name="String(index + 1)"
                   class="creative-panel">
        <creative-editor :disabled="disabled"
                         :platforms="[source]"
                         :idx="index"
                         :title="item.title"
                         :content="item.content"
                         :group-status="groupStatus"
                         :status-text="groupStatusDetail"
                         :group-offline="groupOffline"
                         @change="handleCreativeValueChange"
                         @error="handleCreativeError"
                         @validate-len-change="handleValidateLenChange" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CreativeEditor from './creative-editor'
import FmTip from 'com/widget/fm-tip'

const MAX_CREATIVE_LEN = 3

export default {
  name: 'qwt-creative',
  props: {
    groupStatus: {
      type: Number
    },
    groupStatusDetail: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    source: {
      type: Number,
      required: true
    },
    creatives: {
      type: Array,
      required: true,
      default: () => {
        return [{
          title: '',
          content: ''
        }]
      }
    },
    groupOffline: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeName: '1'
    }
  },
  methods: {
    handleTabsAdd () {
      if (this.creatives.length >= MAX_CREATIVE_LEN) return this.$message.error('最多只能增加3条创意')
      const newTabName = String(this.creatives.length + 1)
      this.$emit('add-creatives')
      this.activeName = newTabName
    },
    handleTabsRemove (targetName) {
      if (this.creatives.length === 1) return this.$message.error('必须要有一条创意')
      let resIdx = 0
      const currIdx = parseInt(targetName)
      resIdx = this.creatives.length === currIdx ? currIdx - 1 : currIdx
      this.activeName = String(resIdx)
      this.$emit('remove-creatives', parseInt(resIdx) - 1)
    },
    handleCreativeValueChange ({ title, content, idx }) {
      const creativeObj = this.creatives[idx]
      this.$emit('update-creatives', idx, {
        ...creativeObj,
        title,
        content
      })
    },
    handleCreativeError (msg, idx) {
      const creativeObj = this.creatives[idx]
      if (msg) {
        this.$message.error(msg)
      }
      this.$emit('update-creatives', idx, {
        ...creativeObj,
        msg
      })
    },
    handleValidateLenChange (isValid, idx) {
      const creativeObj = this.creatives[idx]
      this.$emit('update-creatives', idx, {
        ...creativeObj,
        lenValid: isValid
      })
    }
  },
  components: {
    CreativeEditor,
    FmTip
  }
}
</script>

<style lang="scss" scoped>
.creative-container {
  position: relative;

  .creative-tab {
    /deep/ .el-tabs__nav {
      border-radius: 4px 0 0 0;
    }
    /deep/ .el-tabs__header {
      display: flex;
    }

    /deep/ .el-tabs__new-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      order: 1;
      width: 100px;
      height: 40px;
      border: 1px solid #d3dce6;
      margin: 0;
      border-left: 0;
      border-bottom: 0;
      border-top-left-radius: 0;
      .el-icon-plus {
        font-size: 30px;
      }
    }
  }
  .creative-tip {
    position: absolute;
    bottom: 40px;
    left: 650px;
    z-index: 1;
  }
}
</style>
