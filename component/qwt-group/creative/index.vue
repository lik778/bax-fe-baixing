<template>
  <el-tabs
    type="card"
    class="creative"
    v-model="activeName"
    editable
    @tab-add="handleTabsAdd"
    @tab-remove="handleTabsRemove"
  >
    <el-tab-pane
      v-for="(item, index) in creatives"
      :label="'创意' + (index + 1)"
      :key="index"
      :name="String(index + 1)"
      class="creative-pane"
    >
      <fm-tip
        class="creative-tip"
        position="creative-pane"
        img-url="//file.baixing.net/201903/d6f4502a0e8a659b78a33fbb3713e6b9.png"
      >创意怎么才能飘红</fm-tip
      >
      <creative-editor
        :disabled="disabled"
        :platforms="[source]"
        :idx="index"
        :title="item.title"
        :content="item.content"
        :creative-status="auditStatus"
        :status-text="detailStatusText"
        @change="handleCreativeValueChange"
        @error="handleCreativeError"
      />
    </el-tab-pane>
  </el-tabs>
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
    auditStatus: {
      type: Number
    },
    detailStatusText: {
      type: String
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
    }
  },
  data () {
    return {
      activeName: '1'
    }
  },
  computed: {
    creativeAuditing () {
      return this.auditStatus === CREATIVE_STATUS_PENDING
    },
    disabled () {
      const { source } = this.source
      // TIP 审核中：神马，百度，360落地页和创意应该可以修改；搜狗无法修改
      if (source === SEM_PLATFORM_SOGOU && this.creativeAuditing) return true
      return false
    }
  },
  methods: {
    handleTabsAdd () {
      if (this.creatives.length >= MAX_CREATIVE_LEN) return this.$message.error('最多只能增加3条创意')
      const newTabName = String(this.creatives.length + 1)
      this.$emit('update-creatives', { type: 'add' })
      this.activeName = newTabName
    },
    handleTabsRemove (targetName) {
      if (this.creatives.length === 1) return this.$message.error('必须要有一条创意')
      let resIdx = 0
      const currIdx = parseInt(targetName)
      resIdx = this.creatives.length === currIdx ? currIdx - 1 : currIdx
      this.activeName = String(resIdx)
      this.$emit('update-creatives', {
        type: 'remove',
        idx: parseInt(resIdx) - 1
      })
    },
    handleCreativeValueChange ({ title, content, idx }) {
      const creativeObj = this.creatives[idx]
      this.$emit('update-creatives', {
        type: 'update',
        idx,
        data: {
          ...creativeObj,
          title,
          content
        }
      })
    },
    handleCreativeError (msg) {
      if (msg) this.$message.error(msg)
      this.creativeError = msg
    }
  },
  components: {
    CreativeEditor,
    FmTip
  }
}
</script>

<style lang="scss" scoped>
.creative {
  /deep/ .el-tabs__new-tab {
    border: 1px solid $c-tip;
    height: 22px;
    width: 22px;
    color: $c-tip;
    font-size: 18px;
  }
  .creative-pane {
    position: relative;
    .creative-tip {
      position: absolute;
      bottom: 40px;
      left: 650px;
    }
  }
}
</style>
