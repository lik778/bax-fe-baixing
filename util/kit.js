
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

export function isObj(obj){
  return Object.prototype.toString.call(obj) === '[object Object]'
}
