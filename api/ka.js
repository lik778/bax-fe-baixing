
import { ka } from './base'

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

export async function getUserTicketCount() {
  const body = await ka
    .get('/tickets')
    .query({
      status: 1
    })
    .json()

  return body.total
}

export async function baxUserLogin() {
  const body = await ka
    .get('/bax/user/login')
    .json()

  return body
}
