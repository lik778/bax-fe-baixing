<template>
  <div class="seo-create-container">
    <header>新建首页宝推广计划<small>您的首页宝推广余额为 {{f2y(balance)}} 元</small></header>
    <main>
      <div class="create-item" v-for="row in list" :key="row.id">
        <div class="hot-flag" v-if="row.isHot">
          <img src="//file.baixing.net/201910/04254536456b9a4cba2e0dc239dbcd79.png" width="69"
            height="33" alt="爆款">
        </div>
        <div class="create-item-content" @click="handleRouterPush(row)">
          <div class="create-title">{{row.title}}</div>
          <div class="create-desc">{{row.desc}}</div>
          <div class="create-btn">新建计划</div>
        </div>
        <div class="create-time" v-if="row.id!==SEO_CREATE_TYPE_CIBAO">
          根据您的余额，预计可推广{{keywords}}个关键词（60天展现期）
        </div>
        <div class="create-time" v-else>
          根据您的余额，预计可推广{{days}}天（单站点保底1000词推广）
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getBalance, getBusinessLicense } from 'api/seo'
import { f2y } from 'util'
const SEO_CREATE_TYPE_ZIXUAN = 1
const SEO_CREATE_TYPE_CIBAO = 2
const seoCreateEntryLis = [
  {
    id: SEO_CREATE_TYPE_ZIXUAN,
    title: '自选词',
    desc: '任意自选词推广至百度首页，4词起做，不达首页不计费，每词低至8元/端/天',
    isHot: false,
    routerName: 'seo-create-zixuan-promotion',
    canLink: true
  },
  {
    id: SEO_CREATE_TYPE_CIBAO,
    title: '加速词包版',
    desc: '推广至百度，达标词量不够不扣费',
    isHot: true,
    routerName: 'seo-create-cibao-promotion',
    canLink: false
  }
]
export default {
  name: 'seo-create',
  data () {
    return {
      balance: 0,
      list: seoCreateEntryLis,
      SEO_CREATE_TYPE_CIBAO
    }
  },
  methods: {
    f2y,
    async loadBalance () {
      const d = await getBalance()
      this.balance = d.balance
    },
    async getLiensence () {
      const businessUrl = await getBusinessLicense()
      if (businessUrl) {
        this.list.find(row => row.id === SEO_CREATE_TYPE_CIBAO).canLink = true
      }
    },
    async handleRouterPush ({ id, routerName, canLink }) {
      if (id === SEO_CREATE_TYPE_ZIXUAN) {
        return this.$router.push({ name: routerName })
      }

      const h = this.$createElement
      if (canLink) {
        await this.$confirm('为了确保投放合规，您的营业执照会同步到新闻源站点进行备案，点击“同意”我们会同步您的资质，点击“取消”您将不能创建首页宝计划。', '提示', {
          confirmButtonText: '同意',
          cancelButtonText: '取消'
        })
        this.$router.push({ name: routerName })
      } else {
        await this.$msgbox({
          title: '提示',
          message: h('div', null, [
            h('div', null, '根据《网络安全法》规定，请提供您的营业执照后再创建首页宝加速词包计划。'),
            h('div', { style: 'margin-top:10px;' }, '您尚未提交审核或未通过审核，请进行营业执照认证,如您已经通过认证审核，请关闭本弹窗后重新点击加速词包新建计划按钮。')
          ]),
          confirmButtonText: '前往认证'
        })
        window.open('https://www.baixing.com/bind/#bindList')
      }
    }
  },
  async mounted () {
    await this.loadBalance()
    await this.getLiensence()
  },
  computed: {
    keywords () {
      return Math.floor(this.f2y(this.balance) / 600)
    },
    days () {
      return Math.floor(this.f2y(this.balance) / 3000 * 90)
    }
  }
}
</script>

<style lang="scss" scoped>
.seo-create-container {
  color: #666;
  border-radius: 4px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 9px 0 rgba(83, 95, 127, 0.1);

  & > header {
    font-weight: bold;
    margin-bottom: 20px;

    & > small {
      font-weight: normal;
      font-size: 0.8em;
      margin-left: 5px;
    }
  }

  & > main {
    padding: 60px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  & .create-item {
    width: 260px;
    margin-right: 60px;
    & .hot-flag {
      position: relative;
      width: 0;
      height: 0;
      top: -9px;
      left: 186px;
    }
    & .create-item-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-item: center;
      width: 100%;
      height: 160px;
      border: 1px solid #ccc;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      &:hover {
        border-color: #ff8273;
        & .create-btn {
          background: #ff8273;
          color: #fff;
        }
      }
      & .create-title {
        height: 48px;
        color: #333;
        font-weight: 600;
        line-height: 48px;
        border-bottom: dotted 1px #ccc;
        font-size: 18px;
      }
      & .create-desc {
        padding: 8px;
        font-size: 13px;
        color: #666;
      }
      & .create-btn {
        height: 36px;
        line-height: 36px;
        color: white;
        background: #ccc;
        border-top: 1px dotted #ccc;
      }
    }
    & .create-time {
      font-size: 14px;
      color: #ff8273;
      margin-top: 10px;
    }
  }
}
</style>
