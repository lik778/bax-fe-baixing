
import clone from 'clone'
import { usingCondition } from 'constant/coupon'
import { toHumanTime } from 'utils'

const isArray = Array.isArray

const specialCities = [
  'beijing',
  'tianjin',
  'shanghai',
  'chongqing'
]

export function isQwtEnableCity(name, allAreas) {
  const a = allAreas.find(i => i.name === name)

  if (!a) {
    return false
  }
  return !!a.baiduCode &&
    !!a.qihuCode &&
    !!a.sogouCode &&
    !!a.isAllowed
}

export function getDisAllowAreasDesc(allAreas) {
  const areas = getDisAllowAreas(allAreas)

  if (areas.length) {
    const desc = areas.map(i => i.nameCn).join('、')
    return `温馨提示：尊敬的用户，自2018年1月4日零点起，如果您的推广区域包含${desc}任一城市，请您致电：4008-627-637，开通账号，否则将无法投放喔`
  }

  return ''
}

export function getDisAllowAreas(allAreas) {
  const disAllowAreas = allAreas.filter(a => a.isAllowed === 0)
  const topAreas = disAllowAreas.filter(a => a.areaType === 2)
  const mainAreas = disAllowAreas
    .filter(a => a.areaType === 1)
    .filter(a => {
      const p = a.parent
      return !topAreas.map(t => t.name).includes(p)
    })

  return [...topAreas, ...mainAreas]
}

/**
 * @param {Object} opts
 *   说明: qwt, ssp 中对 quanguo, china 处理的逻辑不一样 (详见 common/area-selector)
 *     cities: ['quanguo'] -> ['china']
 *     areas: ['quanguo'] -> ['china']
 */
export function fmtAreasInQwt(opts, allAreas) {
  const result = clone(opts)

  let items = ['china']

  const disAllowAreas = getDisAllowAreas(allAreas)
  if (disAllowAreas.length) {
    items = [...specialCities]

    const topAreas = allAreas // ['a', 'b']
      .filter(a => a.areaType === 2 && a.isAllowed === 1)
      .map(a => a.name)

    for (const top of topAreas) {
      const exist = disAllowAreas.find(a => a.parent === top)
      if (exist) {
        const subAreas = allAreas
          .filter(a => a.parent === top && a.isAllowed === 1)
          .map(a => a.name)

        items = [...items, ...subAreas]
      } else {
        items.push(top)
      }
    }
  }

  if (isArray(opts.cities) && opts.cities.includes('quanguo')) {
    result.cities = items
  }

  if (isArray(opts.areas) && opts.areas.includes('quanguo')) {
    result.areas = items
  }

  return result
}

/**
 * @param {Object} opts
 * @param {Array} allAreas
 *   说明:
 *     categories: ['all-categories'] -> undefined
 *     cities: ['quanguo'] -> undefined
 *     areas: ['quanguo'] -> undefined
 *     将 areas 中的省份展开为下属的全部市
 */
export function fmtCategoriesAndAreasInOpts(opts, allAreas) {
  const result = clone(opts)

  if (isArray(opts.categories) && opts.categories.includes('all-categories')) {
    result.categories = undefined
  }

  if (isArray(opts.cities) && opts.cities.includes('quanguo')) {
    result.cities = undefined
  }

  if (isArray(opts.areas) && opts.areas.includes('quanguo')) {
    result.areas = undefined
  }
  // 展开省
  if (isArray(result.areas)) {
    result.areas = flattenProvinceAreas(result.areas, allAreas)
  }
  if (isArray(result.cities)) {
    result.cities = flattenProvinceAreas(result.cities, allAreas)
  }

  return result
}

export function filterCategories(allCategories, categories = []) {
  if (categories.length === 0) {
    return []
  }
  // 目前: category 仅两级
  return allCategories
    .filter(c => categories.includes(c.name) || categories.includes(c.parent))
    .map(c => ({...c}))
}

export function filterAreas(allAreas, areas = []) {
  if (areas.length === 0) {
    return []
  }

  return allAreas
    .filter(a => {
      if (a.areaType === 0 || a.areaType === 2) {
        // 全国, 省
        return areas.includes(a.name)
      }

      if (a.areaType === 1) {
        // 市 (包括直辖市)
        return areas.includes(a.name) || areas.includes(a.parent)
      }
    })
    .map(a => ({...a}))
}

export function getCategoryParent(allCategories, name) {
  // 目前: 层级仅 2 层
  let result = ''

  allCategories.forEach(c => {
    if (c.name === name) {
      result = c.belongsToFirst || c.belongsToSecond
    }
  })

  return result
}

export function getAreaParent(allAreas, name) {
  let result = ''

  allAreas.forEach(a => {
    if (a.name === name) {
      result = a.parent
    }
  })

  return result
}

export function displayCoupon(coupon) {
  let priceLimit = coupon.usingConditions.filter(c => c.type === usingCondition.ORDER_SUM_ORIGINAL_PRICE)

  if (priceLimit.length) {
    priceLimit = `满${priceLimit[0]['orderSumOriginalPrice'] / 100}元可用`
  } else {
    priceLimit = ''
  }

  const allProducts = this.usingConditions[usingCondition.PRODUCTS].fields[0].choices
  const allPackages = this.usingConditions[usingCondition.PRODUCT_PACKAGES].fields[0].choices
  let products = '任何产品可用'
  let packages = '任何套餐可用'
  let discountRatio = null

  let productConditions = coupon.usingConditions.filter(c => c.type === usingCondition.PRODUCTS)
  let packageConditions = coupon.usingConditions.filter(c => c.type === usingCondition.PRODUCT_PACKAGES)
  let discountConditions = coupon.usingConditions.filter(c => c.type === usingCondition.ORDER_DISCOUNT_PRICE_RATIO)

  if (productConditions.length) {
    products = productConditions[0].products
      .map(pid => allProducts[+pid]).join(',')
  }

  if (packageConditions.length) {
    packages = packageConditions[0].productPackages
      .map(pid => allPackages[+pid]).join(',')
  }

  if (discountConditions.length) {
    discountRatio = discountConditions[0].orderSumOriginalPriceRatio
  }

  const expire = toHumanTime(coupon.startAt, 'YYYY.MM.DD') + '-' +
    toHumanTime(coupon.expiredAt, 'YYYY.MM.DD')

  const o = {}
  o.discountRatio = discountRatio
  o.money = +(coupon.amount / 100).toFixed(0)
  o.text = priceLimit
  o.products = products
  o.packages = packages
  o.expire = expire
  return o
}

/**
 * 仅用于 区域 类目
 * @params {String} name
 * @params {Array} allItems
 *
 * @returns {String}
 */
export function getCnName(name, allItems) {
  if (name === 'all-categories') {
    return '全类目'
  }

  if (name === 'quanguo') {
    return '全国'
  }

  let result = name

  allItems.forEach(i => {
    if (i.name === name) {
      if (i.nameCn) {
        result = i.nameCn
      }
    }
  })

  return result
}

export function formatCategoriesOrAreas(names, allItems) {
  if (!isArray(names)) {
    return '无'
  }

  return names.map(c => {
    return getCnName(c, allItems)
  }).join(', ')
}

/**
 * private
 */

/**
 * 说明: 因为与 banana 交互的 miss, 后期需要把 省 展开为 市
 */
function flattenProvinceAreas(names, allAreas) {
  let result = []
  const allProvinces = allAreas
    .filter(a => a.areaType === 2)
    .map(a => a.name)

  const getCities = (name) => {
    return allAreas
      .filter(a => a.parent === name)
      .map(a => a.name)
  }

  names.forEach(name => {
    if (allProvinces.includes(name)) {
      result = [...result, ...getCities(name)]
    } else {
      result = [...result, name]
    }
  })

  return result
}
