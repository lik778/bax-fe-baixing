<template>
  <div class="layout-container">
    <div class="layout-left">
      <h5 class="layout-header">
        数据概览
        <span class="action" @click="() => $router.push({name: 'qwt-dashboard'})">查看详情</span>
      </h5>
      <div class="layout-content" v-if="hasCampaign">
        <div class="radio-group">
          <el-radio v-model="reportPrefix" label="">今日</el-radio>
          <el-radio v-model="reportPrefix" label="yesterday">昨日</el-radio>
          <el-radio v-model="reportPrefix" label="weekly">过去7天</el-radio>
        </div>
        <ul class="reports">
          <li class="report">
            <h6 class="title">预算(元)</h6>
            <p class="num">{{formatPrice(reportData[0])}}</p>
          </li>
          <li class="report">
            <h6 class="title">消耗(元)</h6>
            <p class="num">{{formatPrice(reportData[1])}}</p>
          </li>
          <li class="report">
            <h6 class="title">展现量</h6>
            <p class="num">{{reportData[2]}}</p>
          </li>
          <li class="report">
            <h6 class="title">点击量</h6>
            <p class="num">{{reportData[3]}}</p>
          </li>
        </ul>
      </div>
      <div class="no-campaign-data-placeholder" v-else>
        <span><i class="el-icon-info" />暂无站外推广数据概览</span>
      </div>
    </div>
    <div class="layout-right" v-if="fengmingOptimizer || userOptimizerInfo">
      <h5 class="layout-header">
        授权操作
      </h5>
      <div class="layout-content">
        <p class="item" v-if="fengmingOptimizer">
          站外推广：
          <el-button v-if="fengmingOptimizer.relation === RELATION_SERVICE && fengmingOptimizer.status === SERVICE_NOT_OPTIMIZE" @click="authorization" type="danger" size="medium">申请授权</el-button>
          <el-button v-if="fengmingOptimizer.relation === RELATION_SERVICE && fengmingOptimizer.status === SERVICE_OPTIMIZE_ING" @click="authorization" type="danger" size="medium">授权中</el-button>
          <el-button v-if="fengmingOptimizer.relation === RELATION_SERVICE && fengmingOptimizer.status === SERVICE_OPTIMIZED" :disabled="true" type="danger" size="medium">已授权</el-button>
          <el-button v-if="fengmingOptimizer.relation === RELATION_MANAGER" :disabled="true" type="danger" size="medium">{{ STATUS_MAP[fengmingOptimizer.status] }}</el-button>
        </p>
        <div v-if="userOptimizerInfo" class="item user-item">
          <p class="user-item-title"> 站外推广：</p>
          <div>
            <p v-for="(item, index) in userOptimizerInfo" :key="index">
              <span>已授权</span>
              <span>{{item.optimizer_name}}</span>
              <el-popconfirm
                title="确定要取消授权嘛？"
                @confirm="cancel(item.optimizer_id)"
              >
                <el-button slot="reference" type="danger" size="medium">取消授权</el-button>
              </el-popconfirm>
            </p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="授权"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="40%"
    >
      <p class="content-item">1.发送授权链接到百姓网站内信</p>
      <p class="content-item">接收用户： <el-input disabled class="number-input" v-model="phoneNumber" placeholder="请输入内容"></el-input> <el-button @click="send" size="medium">确认发送</el-button></p>
      <p class="content-item">或</p>
      <p class="content-item">2.复制授权链接发送给用户完成授权</p>
      <p class="content-item">{{jumpUrl}}<el-button size="medium" v-clipboard:copy="jumpUrl"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">复制链接</el-button></p>
      <p class="tips content-item">注：授权链接有效期为72小时，请尽快联系客户授权。</p>
    </el-dialog>

  </div>
</template>

<script>
import store from './store'
import gStore from '../store'
import { prepareAuthorize, sendMessage, getUserAuthRelation, cancel } from 'api/fengming'
import { isPro } from 'config'
const formatPrice = (p) => {
  return p ? (p / 100).toFixed(2) : 0
}

const CNT_REJECTED_CODE = '-53'
const SERVICE_OPTIMIZED = 2 // 已授权
const MANAGE_OPTIMIZED = -1 // 已授权
const SERVICE_NOT_OPTIMIZE = 0 // 未授权
const SERVICE_OPTIMIZE_ING = 1 // 授权中
const RELATION_MANAGER = 'manager' // 优化师主管
const RELATION_SERVICE = 'service' // 优化师
const STATUS_MAP = Object.freeze({
  [SERVICE_OPTIMIZED]: '已授权',
  [SERVICE_NOT_OPTIMIZE]: '未授权',
  [SERVICE_OPTIMIZE_ING]: '授权中',
  [MANAGE_OPTIMIZED]: '已授权'
})
export default {
  name: 'homepage-campaign',
  props: ['userInfo'],
  data () {
    return {
      reportPrefix: '',
      radarScores: [],
      dialogVisible: false,
      phoneNumber: '',
      isOptimizer: false,
      RELATION_MANAGER,
      STATUS_MAP,
      RELATION_SERVICE,
      SERVICE_NOT_OPTIMIZE,
      SERVICE_OPTIMIZED,
      SERVICE_OPTIMIZE_ING,
      userOptimizerInfo: null,
      jumpUrl: ''
    }
  },
  fromMobx: {
    fengmingData: () => store.fengmingData,
    fengmingOptimizer: () => gStore.fengmingOptimizer
  },
  async mounted () {
    const { query: { source, user_id: userId, sales_id: salesId } } = this.$route
    const redirectUri = encodeURIComponent(`http://${window.location.host}/authorization?user_id=${userId}&optimizer_id=${salesId}`)
    const origin = isPro ? 'https://www.baixing.com' : 'http://www.staging.baixing.cn'
    this.jumpUrl = `${origin}/oauth2/authorize?client_id=100008&redirect_uri=${redirectUri}&response_type=code&scope=userinfo&state=`
    if (!source) {
      await this.getUserAuthRelation()
    }
  },
  computed: {
    reportData () {
      const prefix = this.reportPrefix
      const data = this.fengmingData
      if (!data) return [0, 0, 0, 0]

      const keys = ['Budget', 'Consume', 'Shows', 'Clicks']
      if (prefix) {
        return keys.map(k => data[prefix + k])
      }
      return keys.map(k => data[k.toLowerCase()])
    },
    hasCampaign () {
      // 空 fengmingData 说明没有有效的计划
      return Object.keys(this.fengmingData || {}).length > 0
    }
  },
  methods: {
    async getUserAuthRelation () {
      const { data } = await getUserAuthRelation()
      if (data && data.length > 0) { this.userOptimizerInfo = data }
    },
    formatPrice,
    handlePointClick (key) {
      if (key === 'charge') return this.$router.push({ name: 'qwt-charge' })
      this.$router.push({
        name: 'qwt-promotion-list',
        query: {
          statuses: key
        }
      })
    },
    goPromotionList () {
      this.$router.push({
        name: 'qwt-promotion-list',
        query: {
          statuses: CNT_REJECTED_CODE
        }
      })
    },
    async authorization () {
      const { query: { user_id: userId } } = this.$route
      const { data } = await prepareAuthorize({ userId })
      this.phoneNumber = data
      this.dialogVisible = true
    },
    async send () {
      const { query: { user_id: userId } } = this.$route
      const { phoneNumber: mobile } = this
      const url = this.jumpUrl
      await sendMessage({ userId, mobile, url })
    },
    async cancel (id) {
      const optimizerId = id
      const { meta: { code } } = await cancel({ optimizerId })
      console.log('code', code)
      if (code === 0) {
        this.$message({
          message: '恭喜你，取消授权成功',
          type: 'success'
        })
        await this.getUserAuthRelation()
      }
    },
    onCopy (e) {
      this.$message({
        message: '授权链接已复制到粘贴板！',
        type: 'success'
      })
    },
    onError: function (e) {
      this.$message.error('授权链接复制失败')
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin placeholder {
  display: flex;
  height: 288px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
}
.layout-left {
  & .radio-group {
    display: flex;
    justify-content: space-around;
    width: 66%;
    max-width: 350px;
    margin: 32px auto;
    & /deep/ .el-radio__label {
      font-weight: 600;
    }
  }
  & .reports {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
      background-color: #fff;
      height: 16%;
      width: 18%;
      z-index: 1;
    }
    & > .report {
      flex: 1 0 50%;
      height: 110px;
      text-align: center;
      padding-top: 14px;
      line-height: 2;
      & .num {
        color: #ff4f49;
        font-size: 24px;
        font-weight: 600;
      }
      &:nth-of-type(2n + 1) {
        border-right: 1px solid #e6e6e6;
      }
      &:nth-of-type(1) {
        border-bottom: 1px solid #e6e6e6;
      }
      &:nth-of-type(2) {
        border-bottom: 1px solid #e6e6e6;
      }
    }
  }
}

.no-campaign-data-placeholder {
  @include placeholder;
  font-size: 16px;
  & .el-icon-info {
    margin-right: 4px;
  }
}

.no-campaign-radar-placeholder {
  @include placeholder;
  font-size: 17px;
  & .text {
    margin-bottom: 20px;
  }
}
.layout-content{
  .item{
    margin: 20px 0;
  }
}
.content-item{
  margin-bottom: 10px;
}
.number-input{
  width: 60%;
}
.tips{
  font-size: 12px;
  color: #ff4f49;
}
.user-item{
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.user-item-title{
  height: 36px;
  line-height: 36px;
}
</style>
