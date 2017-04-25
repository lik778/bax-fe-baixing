
import { reverseCamelcase, toCamelcase } from 'object-keys-mapping'
import { api, trim } from './base'

export async function getCurrentUser() {
  const body = await api
    .get('/user/current')
    .json()

  return toCamelcase(body.data)
}

export async function loginLocal(id = 2) {
  return await api
    .post('/user/login/local')
    .send({user_id: id})
    .json()
}

export async function login(email, password) {
  return await api
    .post('/user/login')
    .send({
      password,
      email
    })
    .json()
}

export async function logout() {
  return await api
    .post('/user/logout')
    .json()
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

export async function getUserInfo(uid) {
  const body = await api
    .get(`/user/${uid}`)
    .json()

  return toCamelcase(body.data)
}

export async function createUser(user) {
  const body = await api
    .post('/user')
    .send(reverseCamelcase(user))
    .json()

  return {
    password: body.data
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
