
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { api, trim } from './base'
import { SPUCODES } from 'constant/product'

const { WHOLE_SPU_CODE, BIAO_WANG_SPU_CODE } = SPUCODES

export async function getUserIdFromBxSalesId(salesId) {
  const body = await api
    .get('/user/sales')
    .query({
      baixing_sales_id: salesId
    })
    .json()

  return body.data
}

export async function markNotNew() {
  await api
    .post('/user/not_new')
    .send({})
    .json()
}

export async function getCurrentUser() {
  const body = await api
    .get('/user/current')
    .json()

  return toCamelcase(body.data)
}

export async function loginLocal(id = 2) {
  const body = await api
    .get('/user/login/local')
    .send({user_id: id})
    .json()

  return body
}

export async function login(email, password) {
  const body = await api
    .post('/user/login')
    .send({
      password,
      email
    })
    .json()

  return body
}

export async function logout() {
  const body = await api
    .post('/user/logout')
    .json()

  return body
}

export async function getRoles() {
  const body = await api
    .get('/user/role')
    .json()

  return toCamelcase(body.data)
}

export async function getUsers(opts = {}) {
  const query = trim({
    offset: 0,
    limit: 20,
    ...opts
  })

  const [users, total] = await Promise.all([
    _getUsers(query),
    _getUserCount(query)
  ])

  return {
    query: {
      ...query,
      total
    },
    users
  }
}

export async function updateUserInfo(uid, info) {
  const body = await api
    .post(`/user/${uid}`)
    .send(info)
    .json()

  return body
}

export async function queryUserInfo(uid) {
  const body = await api
    .get(`/user/${uid}`)
    .json()

  return toCamelcase(body.data)
}

export async function getUserInfo(uid) {
  const users = await _getUsers({
    userId: uid
  })

  const user = (users && users[0]) || {}

  return user
}

export async function createUser(user) {
  const body = await api
    .post('/user')
    .send(reverseCamelcase(user))
    .json()

  return {
    userId: body.data
  }
}

/**
 * private
 */

async function _getUsers(query) {
  const body = await api
    .get('/user')
    .query(reverseCamelcase(query))
    .json()

  return toCamelcase(body.data)
}

async function _getUserCount(query) {
  const body = await api
    .get('/user/count')
    .query(reverseCamelcase(query))
    .json()

  return body.data
}

export async function queryOrder(query) {
  const { data } = await api
    .get('/order/query')
    .query(reverseCamelcase(query))
    .json()

  return {
    data: toCamelcase(data.data),
    total: data.totalElements
  }
}

export async function cancelOrder(tradeSeq) {
  const { data } = await api
    .post(`/order/cancel`)
    .send(reverseCamelcase({tradeSeq}))
    .json()

  return data
}

export async function payOrder(orderId) {
  const { data } = await api
    .get('/order/pay_url')
    .query(reverseCamelcase({orderId}))
    .json()

  return data
}

export async function getCurrentBalanceBreif(accountType) {
  const body = await api
    .get('/balance/brief')
    .query(reverseCamelcase({accountType}))
    .json()

  return body.data
}

export async function getChargeLogs(opts) {
  const { data } = await api
    .get('/balance/chargelog')
    .query(reverseCamelcase(opts))
    .json()

  return {
    total: data.totalElements,
    logs: toCamelcase(data.data)
  }
}

export async function getCurrentAllBalanceBreif() {
  const [ fengmingBalanceBrief = {}, biaowangBalanceBrief = {} ] = await Promise.all([
    getCurrentBalanceBreif(WHOLE_SPU_CODE),
    getCurrentBalanceBreif(BIAO_WANG_SPU_CODE)
  ])
  return {
    fengmingBalance: fengmingBalanceBrief.currentBalance,
    biaowangBalance: biaowangBalanceBrief.currentBalance
  }
}
