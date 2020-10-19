
export function getPagination(total, offset, limit) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPage = Math.ceil(total / limit)

  return {
    currentPage,
    totalPage,
    limit,
    total
  }
}

export function getImageSizeWarnTip(imgWidth, imgHeight, adWidth, adHeight) {
  if ((imgHeight < adHeight) || (imgWidth < adWidth)) {
    return `图片尺寸较小, 会影响效果哟~ (广告位: ${adWidth}*${adHeight}, 图片: ${imgWidth}*${imgHeight})`
  }
  if ((imgWidth / imgHeight).toFixed(2) !== (adWidth / adHeight).toFixed(2)) {
    return `图片尺寸比例与广告位不匹配, 会影响效果哟~ (广告位: ${adWidth}*${adHeight}, 图片: ${imgWidth}*${imgHeight})`
  }
  return ''
}

export function getImageInfo(file) {
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

/** 将”分“转换为”元“ */
export function f2y(fen) {
  if (typeof fen === 'string') {
    fen = toFloat(fen, 0)
  }
  return fen / 100
}

export function toFloat(str, f = 2) {
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

export function parseQuery(queryString) {
  var query = {}
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export function redirect(p, qs) {
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

export function isQiqiaobanSite(siteUrl) {
  const regExp = /\.shop\.baixing/i
  return regExp.test(siteUrl)
}

export function isWeishopSite(siteUrl) {
  const regExp = /baixing\.com\/(m\/)?weishop/i
  return regExp.test(siteUrl)
}

export function isSiteLandingType(landingPage) {
  const isSiteLandingTypeReg = /(\.shop|\.mvp)\.baixing\.com/i
  return isSiteLandingTypeReg.test(landingPage) || isWeishopSite(landingPage)
}

export function getLandingpageByPageProtocol(landingPage) {
  return landingPage.replace(/http:/, location.protocol)
}

export function isObj(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 请求参数清洗
 * 格式化，去除空参数
 * TODO 深拷贝
 */
export function formatReqQuery(obj = {}, formators = {}) {
  return Object.keys(obj).reduce((ret, key) => {
    let value = obj[key]
    const formator = formators[key]
    if (formator) value = formator(value)
    if (value) ret[key] = value
    return ret
  }, {})
}

// 睡眠函数
export function pause(time = 1000) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// 获取路由参数
export function getRouteParam(key) {
  return (this.$route && this.$route.params && this.$route.params[key]) || null
}

// simple deepclone
function deepClone(source) {
  const targetObj = source instanceof Array ? [] : {}
  Object.keys(source).forEach(keys => {
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
export function normalize(adaptorDes = {}, data, saveEmptyProp = false) {
  if (!data) return {}

  const adaptors = Object.entries(adaptorDes).map(([key, val]) => genAttrAdaptor(key, val))

  const normedData = data instanceof Array
    ? data.map(x => normalize(x))
    : wash(data, adaptors)

  const ret = deepClone(normedData)

  return ret

  // compose
  function wash(data, handlers) {
    return handlers.reduce((data, handler) => handler(data), data)
  }

  // 将所有规格不同的 keys 转换为一致的 key
  function genAttrAdaptor(targetKey, ...keys) {
    return obj => {
      const res = keys.map(key => obj[key]).find(x => x)
      if (res || saveEmptyProp) {
        keys.map(key => delete obj[key])
        obj[targetKey] = res
      }
      return obj
    }
  }
}
