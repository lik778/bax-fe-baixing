
import { biaowang, trim } from './base'
import { getCurrentBalanceBreif } from './account'
import { SPUCODES } from 'constant/product'

const { BIAO_WANG_SPU_CODE } = SPUCODES

export async function queryKeywordPrice (opts = {}) {
  const body = await biaowang
    .post('/keyword/pricing/user/inquiry')
    .send(opts)
    .json()

  return body.data.content
}
export async function refreshKeywordPrice (keywords) {
  const requestBody = keywords.map(k => ({
    ...k,
    price: {
      [k.days]: k.price
    }
  }))
  const body = await biaowang
    .post('/keyword/pricing/user/inquiry/norec')
    .send({ pricingList: requestBody })
    .json()

  const parsedBody = body.data.content.map(i => {
    const days = keywords.find(k => k.word === i.word).days
    return {
      ...i,
      price: i.soldPriceMap[days],
      days: days
    }
  })
  return parsedBody
}

export async function getPromotes (opts = {}) {
  const q = {
    size: 20,
    page: 0,
    ...opts
  }
  const body = await biaowang
    .get('/promote/user')
    .query(trim(q))
    .json()

  return {
    items: body.data.content,
    total: body.data.totalElements
  }
}

export async function getCpcRanking (promoteIds = []) {
  const body = await biaowang
    .get('/promote/user/cpc_ranking')
    .query({ promoteIds })
    .json()

  return body.data
}

export async function getPromoteById (id) {
  const body = await biaowang
    .get(`/promote/user/${id}`)
    .json()

  return body.data
}

export async function getPromtesByOrders (orderIds) {
  const body = await biaowang
    .get('/promote/user/order')
    .query({ orderIds })
    .json()

  return body.data
}

export async function updatePromote (opts = {}) {
  return biaowang
    .post('/promote/user/info')
    .send(opts)
    .json()
}

// targetUserId, salesId are baxid, not baixingid
export async function createPreOrder (items, targetUserId, salesId, saleWithShopOrder, shopOrderAmount, shopType) {
  const body = await biaowang
    .post('/trade/user/order/pre')
    .send(trim({ pricingList: items, targetUserId, salesId, saleWithShopOrder, shopOrderAmount, shopType }))
    .json()

  return body.data
}

export async function getRecentSold () {
  const body = await biaowang
    .get('/promote/user/global/promote')
    .json()

  return body.data.content
}

export async function getLogs (parmas) {
  const body = await biaowang
    .get('/promote/timeline/query')
    .query(parmas)
    .json()

  return body.data
}

export async function getHomePageBiaowangData () {
  const [biaowangBalanceBrief, body] = await Promise.all([
    getCurrentBalanceBreif(BIAO_WANG_SPU_CODE),
    await biaowang.get('/promote/user/info').json()
  ])

  return {
    ...body.data,
    biaowangBalance: biaowangBalanceBrief.currentBalance
  }
}

export async function getQiqiaobanCoupon (promoteId) {
  const body = await biaowang
    .post('/promote/coupon/qiqiaoban')
    .query({ promoteId })
    .json()

  return body.data
}

export async function cancelOrder (orderId) {
  const body = await biaowang
    .post('/trade/user/order/cancel')
    .send({ orderId })
    .json()

  return body.data
}

export async function queryOrder (query) {
  const { data } = await biaowang
    .get('/trade/user/order')
    .query(query)
    .json()
  return {
    data: data.content,
    total: data.totalElements
  }
}

export async function queryKeywordPriceNew (opts) {
  const body = await biaowang
    .post('/keyword/v2/pricing/user/inquiry')
    .send(opts)
    .json()

  return body.data
}

export async function queryKeywordPackagePrice (opts) {
  const body = await biaowang
    .post('/keyword/v2/pricing/user/package/inquiry')
    .send(opts)
    .json()
  return body.data
}

// 把查价信息打给数据组
export async function sendSelectedIndustryToBW (query) {
  return await biaowang
    .post('/api/keyword/v2/pricing/user/keywordIndustry')
    .send(query)
    .json()
}

// 获取标王查价时需选择的行业信息
export async function queryBWIndustry () {
  return [
    {
      title: '工业制造',
      content: [
        '电子/元器件',
        '钢材',
        '工业设备',
        '其他工业制造',
        '水暖电工',
        '网络安防',
        '五金配件',
        '线缆照明',
        '冶金矿产',
        '仪器仪表'
      ]
    },
    {
      title: '能源材料',
      content: [
        '化工能源',
        '建材服务',
        '农林牧副渔',
        '其他能源材料',
        '橡塑涂料'
      ]
    },
    {
      title: '商务服务',
      content: [
        '保险服务',
        '代运营/托管',
        '翻译服务',
        '公司注册',
        '广告媒体',
        '会计审计',
        '货运物流',
        '律师服务',
        '喷绘招牌',
        '设计策划',
        '投资担保',
        '网络布线',
        '网站建设',
        '印刷包装',
        '展览展会',
        '招商加盟',
        '咨询'
      ]
    },
    {
      title: '生活服务',
      content: [
        '白事服务',
        '搬家服务',
        '办公家具',
        '保洁清洗',
        '保姆/月嫂',
        '拆旧服务',
        '代驾服务',
        '道路汽车救援',
        '电脑维修',
        '房屋维修',
        '工装服务',
        '管道维修',
        '婚庆服务',
        '家电维修',
        '家具维修',
        '驾校服务',
        '建筑维修',
        '酒店预订',
        '开锁修锁',
        '乐器/运动',
        '旅游度假',
        '签证服务',
        '庆典演出',
        '软装装饰',
        '商品出售',
        '设备维修',
        '设备租赁',
        '摄影服务',
        '生活配送',
        '手机维修',
        '物品回收',
        '休闲娱乐',
        '租车服务'
      ]
    },
    {
      title: '生活消费',
      content: [
        '家居家纺',
        '礼品定制',
        '其他生活消费'
      ]
    },
    {
      title: '房屋',
      content: [
        '厂房/仓库',
        '二手房出售',
        '其他房屋',
        '商铺出售',
        '商铺出租',
        '商铺转让',
        '写字楼出售',
        '写字楼出租',
        '新房出售',
        '租房/出租'
      ]
    },
    {
      title: '车辆',
      content: ['二手轿车', '货车', '工程车', '二手摩托车', '面包车/客车', '拖拉机/收割机', '其他车辆']
    },
    {
      title: '培训',
      content: ['家教机构', '职业技能', '在线教育', '婴幼儿教育', '学历教育', '其他培训']
    },
    {
      title: '宠物',
      content: ['狗狗', '猫猫', '宠物用品/食品', '宠物服务/配种', '其他宠物']
    },
    {
      title: '招聘',
      content: ['工人/技工', '司机', '餐饮', '物业管理/保安', '销售', '房产中介', '其他招聘']
    },
    {
      title: '其他',
      content: ['饿了么专营']
    }
  ]

  // eslint-disable-next-line
  return await biaowang
    .post('/api/keyword/v2/pricing/user/inqueryAllIndustry')
    .send()
    .join()
    .data
}

export async function refreshKeywordPriceNew (keywords, opt) {
  const requestBody = keywords.map(k => ({
    ...k,
    price: {
      [k.days]: k.price
    }
  }))
  const body = await biaowang
    .post('/keyword/v2/pricing/user/inquiry/norec')
    .send({
      ...opt,
      pricingList: requestBody
    })
    .json()

  const parsedBody = body.data.content.map(i => {
    const days = keywords.find(k => k.word === i.word && k.device === i.device).days
    return {
      ...i,
      price: i.soldPriceMap[days],
      days: days
    }
  })
  return parsedBody
}

export async function getUserRanking (opts = {}) {
  const body = await biaowang
    .post('/promote/user/ranking')
    .send(opts)
    .json()

  return body.data.rankList
}

export async function getUserLive (opts = {}) {
  const body = await biaowang
    .get('/promote/user/live')
    .query(opts)
    .json()
  return body.data
}

export async function getUserShow (opts = {}) {
  const body = await biaowang
    .post('/promote/user/show')
    .send(opts)
    .json()

  return body.data.showList
}

export async function getPromotionUserCollection (opts = {}) {
  const body = await biaowang
    .post('/promote/user/collect')
    .send({
      promoteList: [],
      ...opts
    })
    .json()
  return body.data
}

export async function sendUserManualApply (opts = {}) {
  const body = await biaowang
    .post('/keyword/v2/pricing/user/manual/apply')
    .send({
      ...opts
    })
    .json()

  return body.data
}

export async function getUserManualList (opts = {}) {
  const q = {
    size: 20,
    page: 0,
    ...opts
  }

  const { data } = await biaowang
    .get('/keyword/v2/pricing/user/manual/history')
    .query(q)
    .json()

  return {
    data: data.content,
    total: data.totalElements
  }
}
