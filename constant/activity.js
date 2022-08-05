export const activityConfig = {
  startTime: '2021-06-10 00:00:00',
  endTime: '2021-06-18 23:59:59'
}

export const COMMON_STATUS = 'common'
export const ACTIVITY_STATUS = 'activity'

export const fengmingDiscountInfo = {
  [COMMON_STATUS]: { // 平时文案展示
    discountInfo: [
      [6088, 1200, 1800],
      [1000, 200, 600],
      [5000, 600, 1200],
      [9888, 1200, 2000]
    ],
    get discountInfoHTML () {
      const genHTML = item => `<p class="discount-info">站外资金满 ${item[0]} 元：
      同时购买 1 年钻石店铺，<i class="red">减</i>立减 ${item[1]} 元；
      同时购买 2 年钻石店铺，送 1 年钻石店铺时长，<i class="red">减</i>立减 ${item[2]} 元；</p>`
      return this.discountInfo.map(item => genHTML(item))
    }
  },
  [ACTIVITY_STATUS]: { // 活动文案展示(可替换)
    discountInfo: [
      [1000, 200, 600],
      [5000, 600, 1200],
      [9888, 1200, 2000]
    ],
    get discountInfoHTML () {
      return this.discountInfo.map((item) => {
        return `<p class="discount-info">站外资金满 ${item[0]} 元：
        同时购买 1 年钻石店铺，<i class="red">减</i>立减 ${item[1]} 元；
        同时购买 2 年钻石店铺，送 1 年钻石店铺时长，<i class="red">减</i>立减 ${item[2]} 元；</p>`
      })
    }
  }
}

export const biaowangDiscountInfo = {
  [COMMON_STATUS]: { // 平时文案展示
    discountInfo: [
      [1000, 200, 600],
      [5000, 600, 1200],
      [9888, 1200, 2000]
    ],
    get discountInfoHTML () {
      const genHTML = item => `<p class="discount-info">标王资金满 ${item[0]} 元：同时购买 1 年钻石店铺，<i class="red">减</i>立减 ${item[1]} 元；同时购买 2 年钻石店铺，送 1 年钻石店铺时长，<i class="red">减</i>立减 ${item[2]} 元；</p>`
      return this.discountInfo.map(item => genHTML(item))
    }
  },
  [ACTIVITY_STATUS]: { // 活动文案
    discountInfo: [
      [1000, 200, 600],
      [5000, 600, 1200],
      [9888, 1200, 2000]
    ],
    get discountInfoHTML () {
      const genHTML = item => `<p class="discount-info">标王资金满 ${item[0]} 元：同时购买 1 年钻石店铺，<i class="red">减</i>立减 ${item[1]} 元；同时购买 2 年钻石店铺，送 1 年钻石店铺时长，<i class="red">减</i>立减 ${item[2]} 元；</p>`
      return this.discountInfo.map(item => genHTML(item))
    }
  }
}

export const carefreeDiscountInfo = {
  [COMMON_STATUS]: { // 平时文案展示
    discountInfo: [
      [18888, 200],
      [23888, 500],
      [30888, 1000]
    ],
    get discountInfoHTML () {
      const genHTML = item => `<p class="discount-info">省心币 ${item[0]} 元：<i class="red">送</i> ${item[1]} 元</p>`
      return this.discountInfo.map(item => genHTML(item))
    }
  },
  [ACTIVITY_STATUS]: { // 活动文案
    discountInfo: [
      [18888, 200],
      [23888, 500],
      [30888, 1000]
    ],
    get discountInfoHTML () {
      const genHTML = item => `<p class="discount-info">省心币 ${item[0]} 元：<i class="red">送</i> ${item[1]} 元</p>`
      return this.discountInfo.map(item => genHTML(item))
    }
  }
}
