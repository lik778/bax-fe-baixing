/**
 * tracker 当前的方案有几个重要的设计决策：
 * 1. 是所有浏览器共用的（且未来可能与桌面版的 tracker 统一），而非依据浏览器返回不同版本；
 * 2. 是直接内嵌于 HTML 中，而非独立脚本资源文件；所嵌入的位置是 head 元素的尾部；
 * 3. 上报方式是通过 ping 服务器端的 url，产生 weblog；数据编码于 url 的查询参数中。
 *
 * 基于上述设计决策，tracker 的浏览器端 JavaScript 代码实现有如下要求：
 * 1. tracker 本身不做也不依赖任何形式的以复用为目标的兼容抽象层；
 * 2. 避免使用 ES5 及以上的 JS 语言特性和 API，除非是在确定可用的分支代码中。比如：
 *    Date.now() 应该用 new Date().getTime() 替代。
 * 3. 对于无法直接替代的特性，提供合理的 fallback 方式。比如：
 *    通过 XMLHttpRequest 发送 POST 请求降级为通过 Image 发送 GET 请求。
 *    这些 fallback 可能需要服务器端的理解和配合。
 */

// todo: 增加noscript，通过image发统计信息
// todo: 每个参数都应要encode
// todo: 整理后端对应的方法
// 依赖：全局变量__trackerData, tracker.data

void (function() {
  'use strict'
  var host = '//www.baixing.com'
  var tracker = window.tracker || {}

  tracker.lastTimestamp = new Date().getTime()
  tracker.send = window.XMLHttpRequest
    ? function(url) {
      url = host + url
      if (url.slice(0, 2) === '//') {
        this.sendRequestByImage(url)
        return
      }
      var xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      if (xhr.setRequestHeader) {
        xhr.setRequestHeader('Content-Type', 'text/ping')
        xhr.send('PING')
      } else {
        xhr.send('ping')
      }
    }
    : function(url) {
      this.sendRequestByImage(url)
    }
  tracker.sendRequestByImage = function(url) {
    var img = new Image()
    img.onload = img.onerror = dispose
    img.src = url
    this._tmp = img

    var that = this
    function dispose() { that._tmp = null }
  }
  tracker.random = function() {
    return Math.random().toString(36).substring(2)
  }
  tracker.serializeParams = function(params, options) {
    if (options == null) options = {}
    var prefix = options.prefix != null ? options.prefix : ''

    var s = ''
    for (var key in params) {
      var value = params[key]
      if (typeof value === 'undefined') continue
      s += '&' + this.encode(prefix + key)
      if (value === null) continue
      s += '=' + this.encode(value)
    }
    return s.substring(1)
  }
  tracker.encode = typeof encodeURIComponent === 'function' ? encodeURIComponent : escape
  tracker.dataStr = function() {
    var str = '&_pvid=' + this.lastPvId +
            '&_reid=' + this.data.reid +
            '&_city=' + this.data.city_name +
            '&_category=' + this.data.category +
            '&_ad=' + this.data.adId +
            '&_trackId=' + this.data.trackId +
            '&_visitor=' + this.data.visitorId +
            '&_tk1=' + this.data.tk1 +
            '&_tk2=' + this.data.tk2 +
            '&_tk3=' + this.data.tk3 +
            '&_tk4=' + this.data.tk4 +
            '&_tk5=' + this.data.tk5 +
            '&_url=' + this.encode(document.location.href) +
            '&_refer=' + this.encode(this.data.referrer)
    return str
  }
  tracker.generateId = function() {
    var now = new Date().getTime()
    var id = this.random() + '-' + now + '-' + (now ^ this.data.requestTime ^ this.data.trackId ^ parseInt(this.data.reid, 16)) + '-' + (now - this.lastTimestamp)
    this.lastTimestamp = now
    this.lastPvId = id
    if (window.sessionStorage) window.sessionStorage.setItem('bx:pvid', id)
    return id
  }
  tracker.parentId = function() {
    if (this.lastPvId) return this.lastPvId
    if (window.sessionStorage) return window.sessionStorage.getItem('bx:pvid')
    return 'NA'
  }
  // API
  tracker.pv = function(type) {
    type = type || ''
    var str = 'ppvid=' + this.parentId() +
            '&pvid=' + this.generateId() +
            '&reid=' + this.data.reid +
            '&ct=' + this.data.city +
            '&cat=' + this.data.category +
            '&tk1=' + this.data.tk1 +
            '&tk2=' + this.data.tk2 +
            '&tk3=' + this.data.tk3 +
            '&tk4=' + this.data.tk4 +
            '&tk5=' + this.data.tk5 +
            '&cv2=' + this.data.cv2 + '_' + screen.width + '_' + screen.height + '_status_' + this.data.status +
            '&cv4=' + this.data.requestTime +
            '&cv5=' + this.data.trackId +
            '&tid=' + this.data.trackId +
            '&vid=' + this.data.visitorId +
            '&url=' + this.encode(document.location.href + (type ? '#' + type : '')) +
            '&ref=' + this.encode(type ? this.data.lastUrl : document.referrer || this.data.referrer) +
            '&latlng=' + this.data.latlng +
            '&latlngcity=' + this.data.latlngcity

    this.data.lastUrl = document.location.href

    this.send(['//gary.baixing', '.com/arrow.php?'].join('') + str)
  }
  tracker.evt = function(key, obj) {
    var url = '/c/ev/' + key + '?'

    // add obj
    for (var i in obj) {
      if (obj[i] != null) {
        url += '&' + i + '=' + this.encode(obj[i])
      }
    }

    // add hash
    url += this.dataStr() + '&hash=' + this.random()

    this.send(url)
  }
  tracker.resErr = function(elem) {
    // 只抽样 0.1% 上报数据
    if (Math.random() > 0.1 / 100) return

    var url
    switch (elem.nodeName.toLowerCase()) {
      case 'link':
        url = elem.href
        break
      case 'script':
      case 'img':
      case 'iframe':
        url = elem.src
        break
      default: return
    }
    var errInfo = {
      errMessage: 'Resource Error',
      errFile: url,
      errPage: location.href
    }
    this.kLog('fe_error', errInfo)
  }
  // todo: ping应该是post，应该符合此spec：https://html.spec.whatwg.org/multipage/semantics.html#hyperlink-auditing
  tracker.ping = function(url, referer) {
    // url必须是原始url，不要encode
    if (!url) return

    // 先拿20%的量走后端转发 zhanglin@baixing.com
    if ((new Date()).valueOf() % 10 < 2) {
      this.send('/p/ping.php?hash=' + this.random() + '&url=' + this.encode(url) + '&referer=' + this.encode(referer))
    } else {
      this.send('/arch/ping?hash=' + this.random() + '&url=' + this.encode(url))
    }
  }
  tracker.dailyUVCounter = function(key) {
    this.send('/c/duvc/' + this.encode(key))
  }
  tracker.ic = function(key) {
    this.send('/c/ic/' + this.encode(key))
  }
  // 前端向 LTA 打点
  // 记下的数据可以在 Kibana 里看
  /**
   * @param key 需要在LTA类里注册
   * @param params
   * @example
   * tracker.kLog('wap_log', {
   *  'type': 'frontend_tips',
   *  'contact': '',
   *  'error_content': ''
   * })
   */
  tracker.kLog = function(key, params) {
    this.send('/c/klog/' + key + '?' + this.serializeParams(params))
  }

  /**
   * @param obj navigationTiming
  */
  tracker.perf = function(obj) {
    // 因 test key 不够用了，前端性能 A/B 测试暂时下线
    obj.TS = '0'
    // get test segment
    if (!('TS' in obj)) {
      var tk = this.data.tk3
      if (tk.charAt(tk.length - 1) === '1') obj.TS = '1'
    }

    var url = '/c/perf/' + this.data.pageType + '?'
    // add obj
    for (var i in obj) {
      if (obj[i] != null) {
        url += '&' + i + '=' + this.encode(obj[i])
      }
    }

    // add hash
    url += this.dataStr() + '&hash=' + this.random()
    this.send(url)
  }

  // 前端向 MTA 打点
  // 记下的数据可以在这里看: https://bj-monitor.baixing.com/metric/
  // 还可参考: https://github.com/baixing/haojing/wiki/Grafana-at-bx-from-A-to-Z
  /**
   * 使用 Mta::count() 记录数据
  */
  tracker.count = function(group, key) {
    this.send('/c/mc/' + this.encode(group) + '.' + this.encode(key))
  }
  /**
   * 使用 Mta::timing() 记录数据
   */
  tracker.timing = function(group, key, time) {
    this.send('/c/tm/' + this.encode(group) + '.' + this.encode(key) + '.' + this.encode(time))
  }

  // --------------- 【比基尼】打点新规范 --------------------
  tracker.bx = function(key, obj) {
    this.send(this.url('/c/bx/', key, obj))
  }
  tracker.aux = function(key, obj) {
    this.send(this.url('/c/aux/', key, obj))
  }
  tracker.stg = function(key, obj) {
    this.send(this.url('/c/stg/', key, obj))
  }
  tracker.dev = function(key, obj) {
    this.send(this.url('/c/dev/', key, obj))
  }
  tracker.epv = function(key, obj) {
    this.send(this.url('/c/bx/', key, obj))
    // this.sendRequestByImage('/c/bx/' + this.encode(action) + '?' + query +
    //     '&_refer=' + this.encode(document.referrer || this.data.referrer) +
    //     '&hash=' + this.encode(this.random())
    // )
  }
  tracker.url = function(url, key, obj) {
    var params = Object.assign({}, obj, window.__trackerData && window.__trackerData.common, {
      _refer: document.referrer || '',
      hash: this.random()
    })
    return url + key + '?' + this.serializeParams(params)
  }

  // exports
  window.tracker = tracker

  // report saved resErr
  var _arrayResErr = window._arrayResErr || []
  if (_arrayResErr.length) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        for (var i = 0; i < _arrayResErr.length; i++) {
          var elem = _arrayResErr[i]
          tracker.resErr(elem)
        }
        window._arrayResErr = null
      }, 1000)
    }, false)
  }
}())
