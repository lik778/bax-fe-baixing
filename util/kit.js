export function getPagination (total, offset, limit) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPage = Math.ceil(total / limit)

  return {
    currentPage,
    totalPage,
    limit,
    total
  }
}

export function getImageSizeWarnTip (imgWidth, imgHeight, adWidth, adHeight) {
  if (imgHeight < adHeight || imgWidth < adWidth) {
    return `图片尺寸较小, 会影响效果哟~ (广告位: ${adWidth}*${adHeight}, 图片: ${imgWidth}*${imgHeight})`
  }
  if ((imgWidth / imgHeight).toFixed(2) !== (adWidth / adHeight).toFixed(2)) {
    return `图片尺寸比例与广告位不匹配, 会影响效果哟~ (广告位: ${adWidth}*${adHeight}, 图片: ${imgWidth}*${imgHeight})`
  }
  return ''
}

export function getImageInfo (file) {
  if (typeof file === 'string') {
    // file -> url
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({
          height: img.height,
          width: img.width
        })
      }
      img.src = file

      setTimeout(() => reject(new Error('加载图片超时')), 3000)
    })
  }

  return new Promise((resolve, reject) => {
    // file -> file object
    const URL = window.URL || window.webkitURL
    const img = new Image()
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width
      })
    }
    img.src = URL.createObjectURL(file)

    setTimeout(() => reject(new Error('加载图片超时')), 2000)
  })
}

export const base64ToBin = base64 => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return {
    u8arr,
    mime
  }
}

/** 将”分“转换为”元“ */
export function f2y (fen) {
  if (typeof fen === 'string') {
    fen = toFloat(fen, 0)
  }
  return fen / 100
}

export function toFloat (str, f = 2) {
  if (!isString(str)) str = String(str)
  const i = parseFloat(str).toFixed(f)

  if (i === 'NaN') {
    return 0
  }

  const n = parseFloat(i)

  if (n <= 0) {
    return 0
  }

  return n
}

export function parseQuery (queryString) {
  const query = {}
  const pairs = (queryString[0] === '?'
    ? queryString.substr(1)
    : queryString
  ).split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export function stringifyQuery (res, separator = '&') {
  if (isString(res)) return res
  if (!isObj) return ''
  return Object.entries(res)
    .reduce((curr, [key, val]) => {
      return curr.concat(`${key}=${val}`)
    }, [])
    .join('&')
}

export function redirect (p, qs) {
  if (!p.startsWith('/')) {
    p = '/' + p
  }
  if (location.pathname === p) {
    return
  }

  if (qs) {
    location.href = location.origin + p + '?' + qs
  } else {
    location.pathname = p
  }
}

export function isQiqiaobanSite (siteUrl) {
  const regExp = /\.shop\.baixing/i
  return regExp.test(siteUrl)
}

export function isWeishopSite (siteUrl) {
  const regExp = /baixing\.com\/(m\/)?weishop/i
  return regExp.test(siteUrl)
}

export function isSiteLandingType (landingPage) {
  const isSiteLandingTypeReg = /(\.shop|\.mvp)\.baixing(\.com|\.cn)/i
  return isSiteLandingTypeReg.test(landingPage) || isWeishopSite(landingPage)
}

export function getLandingpageByPageProtocol (landingPage) {
  return landingPage.replace(/http:/, location.protocol)
}

export function isObj (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isString (obj) {
  return Object.prototype.toString.call(obj) === '[object String]'
}

// 去除对象的空字段
export function formatReqQuery (obj = {}, formators = {}) {
  const ret = Object.keys(obj).reduce((ret, key) => {
    let value = obj[key]
    const formator = formators[key]
    if (formator) value = formator(value)
    if (value) ret[key] = value
    return ret
  }, {})
  return deepClone(ret)
}

// 睡眠函数
export function pause (time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

// 获取路由参数
export function getRouteParam (key) {
  const routeParam =
    this.$route && this.$route.params && this.$route.params[key]
  if (routeParam) return routeParam
  const query = parseQuery(window.location.search)
  return query[key]
}

// simple deepclone
export function deepClone (source) {
  const targetObj = source instanceof Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 字段桥接器 / 数据一致化函数
 * @param {Object} adaptorDes 数据格式化定义
 * @param {Object} data 数组或对象，待一致化的数据
 * @param {Boolean} saveEmptyProp 如果没有找到键对应的值，也保存该键名
 * @example
 * normalize([{ _id: 1, ID: 1, Id: 1 }, {}]) => [{id: 1},{}]
 */
export function normalize (adaptorDes = {}, raw, saveEmptyProp = false) {
  if (!raw) return {}
  const data = deepClone(raw)

  const adaptors = Object.entries(adaptorDes).map(([key, val]) =>
    genAttrAdaptor(key, val)
  )

  const normedData =
    data instanceof Array ? data.map((x) => normalize(x)) : wash(data, adaptors)

  const ret = deepClone(normedData)

  return ret

  // compose
  function wash (data, handlers) {
    return handlers.reduce((data, handler) => handler(data), data)
  }

  // 将所有规格不同的 keys 转换为一致的 key
  function genAttrAdaptor (targetKey, ...keys) {
    return (obj) => {
      const res = keys.map((key) => obj[key]).find((x) => x)
      if (res || saveEmptyProp) {
        keys.map((key) => delete obj[key])
        obj[targetKey] = res
      }
      return obj
    }
  }
}

/**
 * 前端分页函数
 * @param {async function} getList 用于请求以获取所有数据的接口
 * @param {*} dataFormat getList 接口返回的格式化函数
 */
export function paginationWrapper (getList, dataFormat) {
  let responseStore = null
  const wrapperFn = async (...args) => {
    let response
    if (!responseStore) {
      response = await getList(...args)
      responseStore = dataFormat ? dataFormat(response) : response
      responseStore.total = responseStore.data.length
    }
    const { data = [], total } = responseStore
    const copiedData = [...data]
    const { size = 15, page = 0, prop, order } = args[0]
    const end = Math.min((page + 1) * size, total)

    /* 排序字段处理 */

    const shouldSort = prop && order
    const sortBy = {
      number: (a, b, order) => a === b ? 0 : order * (a < b ? -1 : 1),
      dict: (a, b, order) => a === b ? 0 : order * (a < b ? -1 : 1)
    }
    const orderEnum = {
      ascending: 1,
      descending: -1
    }
    // eslint-disable-next-line multiline-ternary
    const sortFn = !shouldSort ? undefined : (a, b) => {
      const sortOrder = orderEnum[order] || orderEnum.ascending
      const va = a[prop]
      const vb = b[prop]
      const isNumber = +va === va
      return isNumber
        ? sortBy.number(va, vb, sortOrder)
        : sortBy.dict(va, vb, sortOrder)
    }

    return {
      ...response,
      total,
      data: copiedData
        .sort(sortFn)
        .slice(page * size, end)
    }
  }

  // API 获取所有数据
  wrapperFn.getAll = () => ({
    data: responseStore.data,
    total: responseStore.data.length
  })
  // API 清空数据
  // * 页面上需要显式清空数据防止内存泄漏
  // TODO refactor
  wrapperFn.clear = () => (responseStore = null)

  return wrapperFn
}

// 防抖
export function debounce (func, time = 300, ctx) {
  let timer
  return async (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(ctx, args)
      timer = null
    }, time)
  }
}

/** 获取当前 IP，并缓存 */
let storedIP = null
export function getIP () {
  // TODO backup address
  const urls = [
    // '//icanhazip.com',
    '//api.myip.com',
    '//txt.go.sohu.com/ip/soip'
  ]
  return new Promise((resolve, reject) => {
    if (storedIP) return resolve(storedIP)

    ;(async function run () {
      const url = urls.shift()
      if (!url) return reject(new Error('Can\'t get IP'))

      // try next url when fetch error
      let ipRes
      try {
        ipRes = await fetch(url).then(res => res.text())
      } catch (fetchError) {
        return await run()
      }
      // ipv4 or ipv6
      const ipMatch = ipRes.match && (
        ipRes.match(/(\d+\.){3}(\d+)/g) ||
        ipRes.match(/([0-9a-zA-Z]+:){7}([0-9a-zA-Z]+)/g)
      )

      // try next url when not matched
      const ip = ipMatch && ipMatch[0]
      if (!ip) {
        return await run()
      } else {
        storedIP = ip
        return resolve(ip)
      }
    })()
  })
}

/**
 * 设置异步任务的最小时间（用来设置 Loading 效果的最小时间）
 * @param {Promise} promise 异步任务
 * @param {Number} time=800 最小完成时间
 * @param {Number} threshold=50 触发阈值，只有超过阈值才会走最小完成时间，否则立即返回
 */
export async function minTime (promise, time = 800, threshold = 50) {
  const start = +new Date()
  const res = await promise()
  const end = +new Date()
  return await new Promise(resolve => {
    const consumeTime = time - (end - start)
    if (consumeTime > 0 && consumeTime < threshold) {
      resolve(res)
    } else {
      const sleepTime = Math.max(0, consumeTime)
      setTimeout(() => {
        resolve(res)
      }, sleepTime)
    }
  })
}

// 对象转 Select Options
export function toOpt (obj, forceNumber = true, reverse = false) {
  if (reverse) {
    return Object.keys(obj)
      .map(key => ({
        label: key,
        value: obj[key]
      }))
  } else {
    return Object.keys(obj)
      .map(key => ({
        label: obj[key],
        value: forceNumber ? (key | 0) : key
      }))
  }
}

// 判断数组的值是否相等
export const isArrHasSameValue = (arrA = [], arrB = [], isSame = (a, b) => a === b) => {
  const isSameLen = arrA.length === arrB.length
  const sameContent = () => arrA.every((x, i) => isSame(x, arrB[i]))
  return isSameLen && sameContent()
}
