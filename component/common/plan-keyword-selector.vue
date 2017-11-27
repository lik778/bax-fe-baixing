
<template>
  <el-dialog title="计划/关键词筛选" :visible="visible"
    :close-on-click-modal="false" size="small"
    :show-close="false"
    :before-close="ok">
    <main class="main">
      <span>
        <header>计划</header>
        <content>
          <li v-for="(campaign, i) in getLeftCampaigns()"
            class="tree" :key="'c' + campaign.id"
            @click="onClickCampaign(campaign.id)">
            <div class="tree-node">
              <i class="el-icon-caret-right"></i>
              <el-checkbox @click="() => onCheckCampaign(campaign)"
                :value="campaignChecked(campaign.id)">
              </el-checkbox>
              <label>{{ `推广：${campaign.id}` }}</label>
            </div>
            <div>
              <li v-for="(keyword, i) in campaign.keywords"
                class="tree-node" :key="'k' + keyword.id"
                @click="onCheckKeyword(keyword)">
                <el-checkbox @click="() => onCheckKeyword(keyword)"
                  :value="keywordChecked(keyword.id)">
                </el-checkbox>
                <label>{{ keyword.word }}</label>
              </li>
            </div>
          </li>
        </content>
        <footer>共条</footer>
      </span>
      <span>
        <header>关键词</header>
        <content>
          <li v-for="(campaign, i) in getRightCampaigns()"
            :key="'c' + campaign.id" class="tree"
            @click="onClickCampaign(campaign.id)">
            <div class="tree-node">
              <i class="el-icon-caret-right"></i>
              <el-checkbox @click="() => onCheckCampaign(campaign)"
                :value="campaignChecked(campaign.id)">
              </el-checkbox>
              <label>{{ `推广：${campaign.id}` }}</label>
            </div>
            <div>
              <li v-for="(keyword, i) in campaign.keywords"
                class="tree-node" :key="'k' + keyword.id"
                @click="onCheckKeyword(keyword)">
                <el-checkbox @click="() => onCheckKeyword(keyword)"
                  :value="keywordChecked(keyword.id)">
                </el-checkbox>
                <label>{{ keyword.word }}</label>
              </li>
            </div>
          </li>
        </content>
        <footer>共条</footer>
      </span>
    </main>
    <footer slot="footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="ok">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import {
  getCampaignKeywords,
  getCampaigns
} from 'api/fengming-campaign'

/**
 * 说明: 此组件目前仅用于 报表筛选, 理论上, 用户不会变
 *      考虑到关键词数量较大, 组件存续期间,
 *      不清空关键词搜索结果
 */

/**
 * TODO - TODO: 合并 two trees
 */

export default {
  name: 'bax-qwt-plan-keyword-selector',
  components: {
  },
  props: {
    campaignIds: {
      type: Array,
      required: true
    },
    keywordIds: {
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
  data() {
    return {
      httpReqPending: false,

      currentKeywords: [],

      allCampaigns: []
    }
  },
  computed: {

  },
  methods: {
    async initData() {
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
    async onClickCampaign(id) {
      const campaign = this.allCampaigns.find(c => c.id === id)

      if (!campaign.keywords) {
        const { keywords } = await getCampaignKeywords(id, {
          offset: 0,
          limit: 300
        })

        campaign.keywords = keywords

        this.$forceUpdate()
      }
    },
    getRightCampaigns() {
      const { campaignIds, keywordIds } = this

      return this.allCampaigns.map(c => {
        // keywords filter
        const { keywords = [] } = c
        return {
          ...c,
          keywords: keywords.filter(k => keywordIds.includes(k.id))
        }
      }).filter(c => {
        if (campaignIds.includes(c.id)) {
          return true
        }

        const kids = c.keywords.map(k => k.id)
        return overlap(kids, keywordIds)
      })
    },
    getLeftCampaigns() {
      const { campaignIds, keywordIds } = this

      return this.allCampaigns.map(c => {
        // keywords filter
        const { keywords = [] } = c

        return {
          ...c,
          keywords: keywords.filter(k => !keywordIds.includes(k.id))
        }
      }).filter(c => {
        if (campaignIds.includes(c.id)) {
          return false
        }

        const kids = c.keywords.map(k => k.id)
        return !overlap(kids, keywordIds)
      })
    },
    onCheckCampaign(campaign) {
      if (this.campaignChecked(campaign.id)) {
        this.$emit('remove-campaign', campaign)
      } else {
        this.$emit('select-campaign', campaign)
      }
    },
    onCheckKeyword(keyword) {
      if (this.keywordChecked(keyword.id)) {
        this.$emit('remove-keyword', {...keyword})
      } else {
        this.$emit('select-keyword', {...keyword})
      }
    },
    campaignChecked(id) {
      return this.campaignIds.includes(id)
    },
    keywordChecked(id) {
      return this.keywordIds.includes(id)
    },
    empty() {
      this.allCampaigns = []
      this.allKeywords = {}
    },
    cancel() {
      // this.$emit('cancel')
      this.$emit('ok')
    },
    ok() {
      this.$emit('ok', [])
    }
  },
  watch: {
    async channel(val, pre) {
      if (typeof val === 'number' &&
        val !== pre) {
        await this.initData()
      }
    },
    async userId(val, pre) {
      if (val && val !== pre) {
        await this.initData()
      }
    }
  }
}

function overlap(arr1, arr2) {
  let result = false

  for (const a of arr1) {
    if (arr2.includes(a)) {
      result = true
      break
    }
  }

  return result
}

</script>

<style scoped>
/*
.bax-dialog {
  width: 520px;
  min-width: 520px;
  max-width: 520px;
} */

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

.main {
  & > span:first-child {
    margin-left: 5px;
  }

  & > span:last-child {
    margin-left: 25px;
  }

  & > span {
    width: 200px;
    border: 1px solid #d1dbe5;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);

    & > header, & > footer {
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

    & > content {
      display: block;
      max-height: 280px;
      min-height: 280px;
      height: 280px;
      overflow-y: auto;
    }
  }
}

</style>
