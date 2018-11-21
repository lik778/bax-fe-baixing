
import { ka } from './base'
import { toCamelcase } from 'object-keys-mapping'

export async function getUserSites(params) {
  const body = await ka
    .get('/sites')
    .query({
      online: true,
      limit: 100,
      offset: 0,
      type: 5
    })
    .json()

  return body.data
}

export async function getUserTicketCount(params = {status: 1}) {
  const body = await ka
    .get('/tickets')
    .query(params)
    .json()

  return body.total
}

export async function baxUserLogin() {
  const body = await ka
    .get('/bax/user/login')
    .json()

  return body
}

export async function kaSimpleReport() {
  const body = await ka
    .get('/user/simple-report')
    .json()

  return toCamelcase(body.data)
}
