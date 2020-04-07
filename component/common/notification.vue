<template>
    <el-dialog
      width="578px"
      :show-close="false"
      :visible="showNotice"
      @close="handleNotificationClose"
    >
      <h3 slot="title">通知</h3>
      <div class="notification">
        <p>亲爱的用户，为了提供更稳定的系统服务，我们进行系统维护，在此期间可能对您的部分操作发生影响，但不影响广告投放和精品官网正常展示。感谢您的谅解。</p>
        <ul>
          <li>
            影响内容
            <p>1）无法登录搜索通bax系统、精品官网系统的情况</p>
            <p>2）站外推广计划、标王计划、首页宝计划、精品官网，不可进行新建、编辑、修改等操作</p>
            <p>3）不可购买站外推广、标王、首页宝、精品官网的情况</p>
          </li>
        </ul>
      </div>
      <!-- <div slot="footer">
        <el-button type="primary" @click="showNotice = false">确认</el-button>
      </div> -->
    </el-dialog>
</template>

<script>
const LAST_NOTIFICATION_KEY = 'LAST_NOTIFICATION'
const NOTICE_TIMES_KEY = 'NOTICE_TIMES'

const NOTIFICATION_DATE_RANGE = ['2020/02/25', '2020/02/28'].map(item => new Date(item))
const notificationCanVisible = new Date() >= NOTIFICATION_DATE_RANGE[0] && new Date() <= NOTIFICATION_DATE_RANGE[1]

const ONE_DAY_DURATION_MS = 86400000
const MAX_NOTICE_TIMES = 3

const getLocalstoreNumberData = function(key) {
  return Number(window.localStorage.getItem(key) || 0)
}

export default {
  name: 'notification',
  data() {
    return {
      showNotice: !window.localStorage.getItem('hack')
    }
  },
  methods: {
    handleNotificationClose() {
      const lastNotification = getLocalstoreNumberData(LAST_NOTIFICATION_KEY)
      const noticeTimes = getLocalstoreNumberData(NOTICE_TIMES_KEY)

      if (lastNotification + ONE_DAY_DURATION_MS > Date.now()) {
        window.localStorage.setItem(NOTICE_TIMES_KEY, (noticeTimes + 1).toString())
      } else {
        window.localStorage.setItem(LAST_NOTIFICATION_KEY, (Date.now() + ONE_DAY_DURATION_MS).toString())
        window.localStorage.setItem(NOTICE_TIMES_KEY, '1')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .notification {
    font-size: 15px;
    & > ul {
      padding: 20px;
    }
    & li {
      list-style: disc;
      margin-bottom: 10px;
      & p {
        line-height: 1.6;
        font-size: 14px;
        text-indent: 1.5em;
      }
    }
  }
</style>
