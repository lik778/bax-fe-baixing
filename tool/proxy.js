const axios = require('axios')

const baxApiHost = 'http://bax.baixing.cn'

const qianciURLPrefix = '/sem-batch/api/sem-batch'
const whiteList = [
  qianciURLPrefix
]
const redirect = {}
const plugins = {}

const proxyMiddleware = (req, res, next) => {
  const method = req.method.toLocaleLowerCase()
  const catched = !!whiteList.find(path => req.path.includes(path))
  const usePlugin = plugins[req.path]

  if (usePlugin) {
    console.log('usePlugin: ', req.path)
    usePlugin(req, res, next)

  } else if (catched) {
    const target = redirect[req.path] || {}
    const targetURL = target.url || `${baxApiHost}${req.path}`

    console.log('catched: ', req.path, targetURL)

    if (method === 'get') {
      axios
        .get(targetURL, {
          params: { ...req.query },
          headers: { 'Content-Type': 'application/json' }
        })
        .then(resData => res.json(resData.data))
        .catch(error => {
          console.error(error)
          next()
        })
    } else if (method === 'post') {
      axios
        .post(targetURL, {
          data: { ...req.body },
          headers: { 'Content-Type': 'application/json' }
        })
        .then(resData => res.json(resData.data))
        .catch(error => {
          console.error(error)
          next()
        })
    } else {
      next()
    }
  } else {
    next()
  }
}
module.exports = proxyMiddleware
