
<template>
  <el-dialog title="计划筛选" :visible="visible"
    width="420px"
    :close-on-click-modal="false"
    :show-close="false"
    :before-close="ok">
    <content class="content">
      <header>当前计划</header>
      <main>
        <li v-for="campaign in allCampaigns"
          class="tree" :key="campaign.id">
          <div class="tree-node">
            <el-checkbox @change="onCheckCampaign(campaign)"
              :value="campaignChecked(campaign.id)">
            </el-checkbox>
            <label>{{ `推广ID：${campaign.id}` }}</label>
          </div>
        </li>
      </main>
      <footer>{{ `总计：${allCampaigns.length}` }}</footer>
    </content>
    <footer slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="ok">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import {
  getCampaigns
} from 'api/fengming-campaign'

export default {
  name: 'bax-qwt-campaign-selector',
  props: {
    campaignIds: {
      type: Array,
      required: true
    },
    channel: {
      type: Number
    },
    visible: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      httpReqPending: false,
      allCampaigns: []
    }
  },
  methods: {
    async initData () {
      const { userId, channel } = this
      // 正常用户单一渠道: 推广 10 个不到 (此处简化处理, 一次性拉取)
      if (userId && typeof channel === 'number') {
        this.allCampaigns = await getCampaigns({
          source: channel,
          userId,
          offset: 0,
          limit: 300
        })
      }
    },
    onCheckCampaign (campaign) {
      if (this.campaignChecked(campaign.id)) {
        this.$emit('remove-campaign', campaign)
      } else {
        this.$emit('select-campaign', campaign)
      }
    },
    campaignChecked (id) {
      return this.campaignIds.includes(id)
    },
    empty () {
      this.allCampaigns = []
      this.allKeywords = {}
    },
    cancel () {
      this.$emit('ok')
    },
    ok () {
      this.$emit('ok')
    }
  },
  watch: {
    async channel (val, pre) {
      if (typeof val === 'number' &&
        val !== pre) {
        await this.initData()
      }
    },
    async userId (val, pre) {
      if (val && val !== pre) {
        await this.initData()
      }
    }
  },
  async mounted () {
    await this.initData()
  }
}
</script>

<style lang="scss" scoped>
.tree-node {
  display: flex;
  align-items: center;
  height: 30px;
  padding-left: 5px;

  & > label {
    margin-left: 10px;
  }

  &:hover {
    background: #eef1f6;
  }
}

.content {
  display: flex;
  flex-flow: column;
  margin: 0 auto;
  width: 220px;

  border: 1px solid #d1dbe5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  & > main {
    display: block;
    max-height: 280px;
    min-height: 280px;
    height: 280px;
    overflow-y: auto;
  }

  & > header,
  & > footer {
    display: flex;
    align-items: center;
    height: 36px;
    padding: 0 10px;
    background: #fbfdff;
  }

  & > header {
    border-bottom: 1px solid #d1dbe5;
  }

  & > footer {
    border-top: 1px solid #d1dbe5;
  }
}
</style>
