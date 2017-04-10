
import { toCamelcase } from 'object-keys-mapping'
import api from './base'

export async function getCurrentUser() {
  const body = await api
    .get('/user/current')
    .json()

  return toCamelcase(body.data)
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

export async function getRoles() {
  const body = await api
    .get('/user/role')
    .json()

  return toCamelcase(body.data)
}

export async function getUsers(opts = {}) {
  const query = {
    offset: 0,
    limit: 20,
    ...opts
  }

  const body = await api
    .get(`/user`)
    .query(query)
    .json()

  return {
    users: [...toCamelcase(body.data)]
  }
}

export async function getUserInfo(uid) {
  const body = await api
    .get(`/user/${uid}`)
    .json()

  return toCamelcase(body.data)
}

export async function createUser(user) {
  return await api
    .post('/user')
    .send(user)
    .json()
}
