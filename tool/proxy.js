const axios = require('axios')

const baxApiHost = 'http://bax.baixing.cn'

const proxyMiddleare = (req, res, next) => {
    const method = req.method.toLocaleLowerCase()
    if (req.path.includes('/sem-batch/api/sem-batch')) {
      if (method === 'get') {
        axios.get(`${baxApiHost}${req.path}`, { params: {...req.query}, 
        headers: { 'Content-Type': 'application/json' }}).then(resData => res.json(resData.data))
      } else if (method === 'post') {
        axios.post(`${baxApiHost}${req.path}`, { data: { ...req.body }, 
        headers: { 'Content-Type': 'application/json' } }).then(resData => res.json(resData.data))
      } else {
        next()
      }
    } else {
      next()
    }
}
module.exports = proxyMiddleare