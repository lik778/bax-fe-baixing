<template>
  <div class="creative-container">
    <fm-tip class="creative-tip"
            position="creative"
            img-url="//file.baixing.net/201903/d6f4502a0e8a659b78a33fbb3713e6b9.png">创意怎么才能飘红
    </fm-tip>
    <el-tabs type="card"
             class="creative"
             v-model="activeName"
             editable
             @tab-add="handleTabsAdd"
             @tab-remove="handleTabsRemove">
      <el-tab-pane v-for="(item, index) in creatives"
                   :label="'创意' + (index + 1)"
                   :key="index"
                   :name="String(index + 1)"
                   class="creative-pane">
        <!-- TODO: 此处的auditStatus和detailStatusText待确认（后端确认） -->
        <creative-editor :disabled="getDisabled(item)"
                         :platforms="[source]"
                         :idx="index"
                         :title="item.title"
                         :content="item.content"
                         :creative-status="item.auditStatus"
                         :status-text="item.detailStatusText"
                         :group-offline="groupOffline"
                         @change="handleCreativeValueChange"
                         @error="handleCreativeError"
                         @validate-len-change="handleValidateLenChange" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CreativeEditor from 'com/widget/creative-editor'
import FmTip from 'com/widget/fm-tip'

import { CREATIVE_STATUS_PENDING, SEM_PLATFORM_SOGOU } from 'constant/fengming'

const MAX_CREATIVE_LEN = 3

export default {
  name: 'qwt-creative',
  props: {
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
    getDisabled (item) {
      const { source } = this.source
      const creativeAuditing = item.auditStatus === CREATIVE_STATUS_PENDING
      // TIP 审核中：神马，百度，360落地页和创意应该可以修改；搜狗无法修改
      if (source === SEM_PLATFORM_SOGOU && creativeAuditing) return true
      return false
    },
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
  /deep/ .el-tabs__new-tab {
    border: 1px solid $c-tip;
    height: 22px;
    width: 22px;
    color: $c-tip;
    font-size: 18px;
  }
  .creative-tip {
    position: absolute;
    bottom: 40px;
    left: 650px;
    z-index: 1;
  }
}
</style>
