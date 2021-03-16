export const activityConfig = {
  startTime: '2021-03-23 00:00:00',
  endTime: '2021-03-31 23:59:59'
}

export const COMMON_STATUS = 'common'
export const ACTIVITY_STATUS = 'activity'

export const fengmingDiscountInfo = {
  [COMMON_STATUS]: { // 平时文案展示
    discountInfo: [
      [1000, 200, 600, 600],
      [3088, 200, 600, 600],
      [5088, 600, 1200, 900],
      [10188, 1000, 1400, 1500]
    ],
    get discountInfoHTML () {
      return this.discountInfo.map((item) => {
        return `满<span style="min-width:40px">${item[0]}</span>元：
          同时购买精品官网（1年）官网<span class="red">减</span>立减 ${item[1]} 元；
          购买精品官网2年【送一年】官网<span class="red">减</span>立减 ${item[2]} 元；
          购买精品官网专业版1年官网<span class="red">减</span> ${item[3]}元；</p>`
      })
    }
  },
  [ACTIVITY_STATUS]: { // 活动文案展示(可替换)
    discountInfo: [
      [1000, 200, 600, 600],
      [3088, 200, 600, 600],
      [5088, 600, 1200, 900, 188],
      [10188, 1000, 1400, 1500, 388],
      [20000, 1000, 1400, 1500, 888]
    ],
    get discountInfoHTML () {
      return this.discountInfo.map((item) => {
        return `满<span style="min-width:40px">${item[0]}</span>元：
          ${item[4] ? `<span class="red">赠</span>送${item[4]}元凤鸣资金；` : ''}
          同时购买精品官网（1年）官网<span class="red">减</span>立减 ${item[1]} 元；
          购买精品官网2年【送一年】官网<span class="red">减</span>立减 ${item[2]} 元；
          购买精品官网专业版1年官网<span class="red">减</span> ${item[3]}元；</p>`
      })
    }
  }
}

export const biaowangDiscountInfo = {
  [COMMON_STATUS]: { // 平时文案展示
    get discountInfoHTML () {
      return [`<div class="notice">
        <p><span><i class="red">满</i>500-4999元，</span>购买精品官网1年立<i class="red">减</i>200元；购买精品官网2年（送一年）官网<i class="red">减</i>600元；购买精品官网专业版1年官网<i class="red">减</i>600元；</p>
        <p><span><i class="red">满</i>5000-9999元，</span>购买精品官网1年立<i class="red">减</i>600元；购买精品官网2年（送一年）官网<i class="red">减</i>1200元；购买精品官网专业版1年官网<i class="red">减</i>900元；</p>
        <p><span><i class="red">满</i>10000元及以上，</span>购买精品官网1年立<i class="red">减</i>1000元；购买精品官网2年（送一年）官网<i class="red">减</i>1400元；购买精品官网专业版1年官网<i class="red">减</i>1500元；</p>
      </div>`]
    }
  },
  [ACTIVITY_STATUS]: { // 活动文案
    get discountInfoHTML () {
      return [`<div class="notice">
        <p><span><i class="red">满</i>500-4999元，</span>同时购买精品官网1年送1年 标准版再<i class="red">减</i>200元/ 专业版再<i class="red">减</i>600 元；</p>
        <p><span><i class="red">满</i>5000-9999元，</span>同时购买精品官网1年送1年 标准版再<i class="red">减</i>600元/ 专业版再<i class="red">减</i>900 元；</p>
        <p><span><i class="red">满</i>10000元及以上，</span>同时购买精品官网1年送1年 标准版再<i class="red">减</i>1000元/ 专业版再<i class="red">减</i>1500 元；</p>
      </div>`]
    }
  }
}
