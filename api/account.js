
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { api, trim } from './base'

export async function getUserIdFromBxSalesId(salesId) {
  const body = await api
    .get('/user/sales')
    .query({
      baixing_sales_id: salesId
    })
    .json()

  return body.data
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
